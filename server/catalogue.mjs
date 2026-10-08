import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export const dataDir = path.resolve(process.env.DATA_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '../data'));
mkdirSync(dataDir, { recursive: true, mode: 0o700 });
mkdirSync(path.join(dataDir, 'uploads'), { recursive: true, mode: 0o700 });
const db = new DatabaseSync(path.join(dataDir, 'catalogue.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS items(kind TEXT NOT NULL,id INTEGER NOT NULL,data TEXT NOT NULL,published INTEGER NOT NULL,PRIMARY KEY(kind,id));
CREATE TABLE IF NOT EXISTS categories(kind TEXT NOT NULL,name TEXT NOT NULL COLLATE NOCASE,visible INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(kind,name));
CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,value TEXT);
CREATE TABLE IF NOT EXISTS admin(id INTEGER PRIMARY KEY CHECK(id=1),username TEXT NOT NULL,salt TEXT NOT NULL,hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,csrf TEXT NOT NULL,expires INTEGER NOT NULL);`);
if (!db.prepare("SELECT value FROM metadata WHERE key='seeded'").get()) {
 const seed=JSON.parse(readFileSync(new URL('./catalogue-seed.json',import.meta.url),'utf8'));
 db.exec('BEGIN');
 try {const insert=db.prepare('INSERT INTO items VALUES (?,?,?,?)');for(const [kind,items] of Object.entries(seed))for(const item of items)insert.run(kind,item.id,JSON.stringify(item),item.published?1:0);db.prepare('INSERT INTO metadata VALUES (?,?)').run('seeded','1');db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
}
// Keep IDs monotonic so a deleted track cannot transfer a saved favourite to a new track.
for (const kind of ['products','books','music']) {
 const next=Number(db.prepare('SELECT COALESCE(MAX(id),0)+1 AS id FROM items WHERE kind=?').get(kind).id);
 db.prepare('INSERT INTO metadata(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=CAST(MAX(CAST(metadata.value AS INTEGER),CAST(excluded.value AS INTEGER)) AS TEXT)').run('next-'+kind,String(next));
}
// Migrate existing installations once without changing any items or admin credentials.
if (!db.prepare("SELECT value FROM metadata WHERE key='categories-seeded'").get()) {
 db.exec('BEGIN');
 try { for (const row of db.prepare('SELECT kind,data FROM items').all()) {
  const item=JSON.parse(row.data),name=row.kind==='products'?item.category:item.genre;
  if(name)db.prepare('INSERT OR IGNORE INTO categories(kind,name) VALUES (?,?)').run(row.kind,name);
 } db.prepare('INSERT INTO metadata VALUES (?,?)').run('categories-seeded','1');db.exec('COMMIT'); }
 catch(e){db.exec('ROLLBACK');throw e;}
}
const error=(message,status=400)=>Object.assign(new Error(message),{status});
const digest=value=>createHash('sha256').update(value).digest('hex');
export function configureAdmin(username,password){
 if(typeof username!=='string'||!username.trim()||username.length>80||typeof password!=='string'||password.length<12||password.length>1024)throw error('Use a username and a password of 12–1024 characters.');
 const salt=randomBytes(16).toString('hex'),hash=scryptSync(password,salt,64).toString('hex');
 db.prepare('INSERT OR REPLACE INTO admin VALUES (1,?,?,?)').run(username.trim(),salt,hash);db.exec('DELETE FROM sessions');
}
export function adminConfigured(){return !!db.prepare('SELECT id FROM admin WHERE id=1').get();}
export function listCatalogue(includeDrafts=false){
 const result={products:[],books:[],music:[]};
 for(const row of db.prepare(`SELECT kind,data FROM items ${includeDrafts?'':'WHERE published=1'} ORDER BY id`).all())result[row.kind].push(JSON.parse(row.data));
 result.categories=listCategories(includeDrafts);
 return result;
}
function text(value,name,max=200,required=true){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw error(`${name} must be ${required?'non-empty text':'text'} up to ${max} characters.`);return value.trim();}
function url(value,name,required=true){const str=text(value??'',name,2048,required);if(!str&&!required)return '';if(/^https?:\/\//i.test(str)){try{const u=new URL(str);if(u.username||u.password)throw Error();return u.href;}catch{throw error(`${name} must be a valid public URL.`);}}if(/^\/[a-zA-Z0-9_/-]/.test(str)&&!str.includes('..')&&!str.includes('\\')&&!str.startsWith('//')&&!/[\x00-\x1f]/.test(str))return str;throw error(`${name} must be an http(s) URL or a path starting with /.`);}
export function listCategories(includeHidden=false){
 const result={products:[],books:[],music:[]};
 for(const row of db.prepare(`SELECT kind,name,visible FROM categories ${includeHidden?'':'WHERE visible=1'} ORDER BY name COLLATE NOCASE`).all())result[row.kind].push({name:row.name,visible:!!row.visible});
 return result;
}
function categoryKind(kind){if(!['products','books','music'].includes(kind))throw error('Unknown category type.',404);}
export function saveCategory(kind,input,oldName){
 categoryKind(kind);const name=text(input.name,'Category name',100);
 if(['all products','all books','all genres'].includes(name.toLowerCase()))throw error('This name is reserved for the all-items filter.');
 if(typeof input.visible!=='boolean')throw error('Choose whether the category appears in filters.');
 const existing=oldName===undefined?undefined:db.prepare('SELECT name FROM categories WHERE kind=? AND name=?').get(kind,oldName);
 if(oldName!==undefined&&!existing)throw error('Category not found.',404);
 const duplicate=db.prepare('SELECT name FROM categories WHERE kind=? AND name=?').get(kind,name);
 if(duplicate&&duplicate.name!==existing?.name)throw error('A category with this name already exists.',409);
 db.exec('BEGIN IMMEDIATE');
 try {
  if(existing){
   db.prepare('UPDATE categories SET name=?,visible=? WHERE kind=? AND name=?').run(name,input.visible?1:0,kind,existing.name);
   const field=kind==='products'?'category':'genre';
   for(const row of db.prepare('SELECT id,data FROM items WHERE kind=?').all(kind)){
    const item=JSON.parse(row.data);if(item[field]?.toLowerCase()===existing.name.toLowerCase()){item[field]=name;db.prepare('UPDATE items SET data=? WHERE kind=? AND id=?').run(JSON.stringify(item),kind,row.id);}
   }
  }else db.prepare('INSERT INTO categories VALUES (?,?,?)').run(kind,name,input.visible?1:0);
  db.exec('COMMIT');return {name,visible:input.visible};
 }catch(e){db.exec('ROLLBACK');throw e;}
}
export function deleteCategory(kind,name){
 categoryKind(kind);const field=kind==='products'?'category':'genre';
 if(db.prepare('SELECT data FROM items WHERE kind=?').all(kind).some(row=>JSON.parse(row.data)[field]?.toLowerCase()===name.toLowerCase()))throw error('This category contains items. Move them to another category first.',409);
 if(!db.prepare('DELETE FROM categories WHERE kind=? AND name=?').run(kind,name).changes)throw error('Category not found.',404);
}
export function validateItem(kind,input){
 if(!['products','books','music'].includes(kind))throw error('Unknown catalogue type.',404);
 if(typeof input.published!=='boolean')throw error('Choose whether the item is published.');
 const item={title:text(input.title,'Title'),published:input.published};
 if(kind==='products'){
  Object.assign(item,{description:text(input.description??'','Description',3000,false),category:text(input.category,'Category',100),source:text(input.source||'Amazon','Source',100),image:url(input.image,'Image'),link:url(input.link,'Product link'),rating:Number(input.rating),badge:text(input.badge||'','Badge',80,false)});
  if(!Number.isFinite(item.rating)||item.rating<0||item.rating>5)throw error('Rating must be between 0 and 5.');
 }else if(kind==='books')Object.assign(item,{author:text(input.author,'Author'),genre:text(input.genre,'Genre',100),file:url(input.file,'Book link'),cover:url(input.cover,'Cover',false)});
 else Object.assign(item,{artist:text(input.artist,'Artist'),genre:text(input.genre,'Genre',100),url:url(input.url,'Audio URL'),licence:text(input.licence,'Usage rights',2000),cover:url(input.cover,'Cover',false)});
 return item;
}
export function saveItem(kind,input,id){
 const item=validateItem(kind,input);
 const field=kind==='products'?'category':'genre';
 // Keep older clients compatible while maintaining a single canonical spelling.
 const category=db.prepare('SELECT name FROM categories WHERE kind=? AND name=?').get(kind,item[field]);
 if(category)item[field]=category.name;

 if(id!==undefined){
  if(!Number.isSafeInteger(id)||id<1||!db.prepare('SELECT id FROM items WHERE kind=? AND id=?').get(kind,id))throw error('Item not found.',404);
  db.prepare('INSERT OR IGNORE INTO categories(kind,name) VALUES (?,?)').run(kind,item[field]);
  item.id=id;db.prepare('UPDATE items SET data=?,published=? WHERE kind=? AND id=?').run(JSON.stringify(item),item.published?1:0,kind,id);return item;
 }
 db.exec('BEGIN IMMEDIATE');
 try {
  id=Number(db.prepare('SELECT value FROM metadata WHERE key=?').get('next-'+kind).value);
  db.prepare('INSERT OR IGNORE INTO categories(kind,name) VALUES (?,?)').run(kind,item[field]);
  item.id=id;db.prepare('INSERT INTO items VALUES (?,?,?,?)').run(kind,id,JSON.stringify(item),item.published?1:0);
  db.prepare('UPDATE metadata SET value=? WHERE key=?').run(String(id+1),'next-'+kind);
  db.exec('COMMIT');return item;
 }catch(e){db.exec('ROLLBACK');throw e;}
}
export function deleteItem(kind,id){if(!['products','books','music'].includes(kind)||!Number.isSafeInteger(id)||id<1)throw error('Item not found.',404);if(!db.prepare('DELETE FROM items WHERE kind=? AND id=?').run(kind,id).changes)throw error('Item not found.',404);}
const loginAttempts=new Map();
function login(req,body){
 if(!adminConfigured())throw error('Admin is not configured. Run npm run admin:setup on the backend first.',503);
 const key=req.socket.remoteAddress,now=Date.now();let entry=loginAttempts.get(key);
 if(!entry||now-entry.start>900000)entry={start:now,count:0};entry.count++;loginAttempts.set(key,entry);
 if(loginAttempts.size>10000)for(const [ip,v]of loginAttempts)if(now-v.start>900000)loginAttempts.delete(ip);
 if(entry.count>10)throw error('Too many login attempts. Wait 15 minutes.',429);
 const admin=db.prepare('SELECT * FROM admin WHERE id=1').get();
 const supplied=typeof body.password==='string'&&body.password.length<=1024?body.password:'';
 const candidate=scryptSync(supplied,admin.salt,64);
 if(body.username!==admin.username||!timingSafeEqual(candidate,Buffer.from(admin.hash,'hex')))throw error('Username or password is incorrect.',401);
 loginAttempts.delete(key);db.prepare('DELETE FROM sessions WHERE expires<?').run(now);
 const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(token),csrf,now+8*3600000);
 return {token,csrf,username:admin.username};
}
function session(req){const token=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('khan_admin='))?.slice(11);if(!token||!/^[a-f0-9]{64}$/.test(token))throw error('Please sign in to the admin portal.',401);const row=db.prepare('SELECT * FROM sessions WHERE token=? AND expires>?').get(digest(token),Date.now());if(!row)throw error('Your session expired. Please sign in again.',401);return row;}
function cookie(token,age=28800){const cross=process.env.ADMIN_CROSS_SITE==='true',secure=process.env.COOKIE_SECURE==='true'||cross;return `khan_admin=${token}; Path=/api/admin; HttpOnly; SameSite=${cross?'None':'Lax'}; Max-Age=${age}${secure?'; Secure':''}`;}
export async function bodyJson(req,max=1024*1024){
 if(!req.headers['content-type']?.includes('application/json'))throw error('Send an application/json request.',415);
 let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max)throw error('Request is too large.',413);chunks.push(chunk);}let value;try{value=JSON.parse(Buffer.concat(chunks).toString());}catch{throw error('Invalid JSON.');}if(!value||Array.isArray(value)||typeof value!=='object')throw error('Send a JSON object.');return value;
}
export async function adminRoute(req,res,pathname,reply){
 if(pathname==='/api/catalogue'&&req.method==='GET'){reply(res,200,listCatalogue());return true;}
 if(pathname==='/api/music'&&req.method==='GET'){reply(res,200,listCatalogue().music);return true;}
 if(!pathname.startsWith('/api/admin/'))return false;
 if(req.method!=='GET'&&!req.headers.origin)throw error('Admin writes require an allowed browser origin.',403);
 if(pathname==='/api/admin/login'&&req.method==='POST'){const current=login(req,await bodyJson(req));res.setHeader('Set-Cookie',cookie(current.token));reply(res,200,{username:current.username,csrf:current.csrf});return true;}
 const current=session(req);
 if(req.method!=='GET'&&req.headers['x-csrf-token']!==current.csrf)throw error('Invalid security token. Sign in again.',403);
 if(pathname==='/api/admin/session'&&req.method==='GET'){reply(res,200,{username:db.prepare('SELECT username FROM admin WHERE id=1').get().username,csrf:current.csrf});return true;}
 if(pathname==='/api/admin/logout'&&req.method==='POST'){db.prepare('DELETE FROM sessions WHERE token=?').run(current.token);res.setHeader('Set-Cookie',cookie('',0));reply(res,200,{ok:true});return true;}
 if(pathname==='/api/admin/catalogue'&&req.method==='GET'){reply(res,200,listCatalogue(true));return true;}
 if(pathname==='/api/admin/uploads'&&req.method==='POST'){
  const data=await bodyJson(req,8*1024*1024);
  if(typeof data.base64!=='string'||!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data.base64))throw error('Invalid image data.');
  const bytes=Buffer.from(data.base64,'base64');if(!bytes.length||bytes.length>5*1024*1024)throw error('Image must be under 5 MB.',413);
  let ext;if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)ext='jpg';else if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')ext='webp';else throw error('Upload a PNG, JPEG or WebP image.');
  const filename=randomBytes(20).toString('hex')+'.'+ext;writeFileSync(path.join(dataDir,'uploads',filename),bytes,{mode:0o600});reply(res,201,{url:'/uploads/'+filename});return true;
 }
 if(pathname==='/api/admin/categories'&&req.method==='GET'){reply(res,200,listCategories(true));return true;}
 const categoryMatch=pathname.match(/^\/api\/admin\/categories\/(products|books|music)$/);
 if(categoryMatch){const kind=categoryMatch[1],input=await bodyJson(req);
  if(req.method==='POST'){reply(res,201,saveCategory(kind,input));return true;}
  if(req.method==='PUT'){reply(res,200,saveCategory(kind,input,text(input.oldName,'Original category',100)));return true;}
  if(req.method==='DELETE'){deleteCategory(kind,text(input.name,'Category name',100));reply(res,200,{ok:true});return true;}
 }
 const match=pathname.match(/^\/api\/admin\/catalogue\/(products|books|music)(?:\/(\d+))?$/);
 if(match){const [,kind,rawId]=match,id=rawId===undefined?undefined:Number(rawId);
  if(req.method==='POST'&&id===undefined){reply(res,201,saveItem(kind,await bodyJson(req)));return true;}
  if(req.method==='PUT'&&id!==undefined){reply(res,200,saveItem(kind,await bodyJson(req),id));return true;}
  if(req.method==='DELETE'&&id!==undefined){deleteItem(kind,id);reply(res,200,{ok:true});return true;}
 }
 throw error('Admin endpoint not found.',404);
}
