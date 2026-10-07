import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
process.env.NODE_ENV='test';const temp=mkdtempSync(path.join(os.tmpdir(),'khan-admin-'));process.env.DATA_DIR=temp;
const {configureAdmin,listCatalogue}=await import('./catalogue.mjs');
const {server}=await import('./index.mjs');
configureAdmin('test-admin','test-password-long-123');
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
after(()=>new Promise(r=>server.close(()=>{rmSync(temp,{recursive:true,force:true});r();})));
const origin='http://localhost:8080';let cookie='',csrf='';
async function call(route,method='GET',body,extra={}){return fetch(base+route,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(csrf?{'X-CSRF-Token':csrf}:{}),...extra},...(body!==undefined?{body:JSON.stringify(body)}:{})});}
test('authentication, CSRF, draft privacy, CRUD, images and durable catalogue',async()=>{
 assert.equal((await call('/api/admin/catalogue')).status,401);
 assert.equal((await call('/api/admin/login','POST',{username:'test-admin',password:'bad'})).status,401);
 const response=await call('/api/admin/login','POST',{username:'test-admin',password:'test-password-long-123'});assert.equal(response.status,200);assert.match(response.headers.get('set-cookie'),/HttpOnly/);assert.match(response.headers.get('set-cookie'),/SameSite=Lax/);cookie=response.headers.get('set-cookie').split(';')[0];csrf=(await response.json()).csrf;
 const book={title:'Persistence test',author:'Test Author',genre:'Test genre',file:'https://example.com/book.pdf',cover:'',published:false};
 assert.equal((await call('/api/admin/catalogue/books','POST',book,{'X-CSRF-Token':'wrong'})).status,403);
 assert.equal((await call('/api/admin/catalogue/books','POST',book,{Origin:'https://attacker.invalid'})).status,403);
 const create=await call('/api/admin/catalogue/books','POST',book);assert.equal(create.status,201);const saved=await create.json();assert.equal(saved.id,11);
 assert.equal(listCatalogue().books.some(b=>b.id===saved.id),false);
 assert.equal((await (await call('/api/admin/catalogue')).json()).books.find(b=>b.id===11).published,false);
 assert.equal((await call('/api/admin/catalogue/books/11','PUT',{...book,file:'javascript:alert(1)'})).status,400);
 assert.equal((await call('/api/admin/catalogue/books/11','PUT',{...book,published:true})).status,200);
 assert.equal((await (await call('/api/catalogue')).json()).books.find(b=>b.id===11).title,book.title);
 const child=execFileSync(process.execPath,['--input-type=module','-e',"import {listCatalogue} from './server/catalogue.mjs';console.log(JSON.stringify(listCatalogue()));"],{cwd:path.resolve(new URL('..',import.meta.url).pathname),env:{...process.env,DATA_DIR:temp},encoding:'utf8'});assert.equal(JSON.parse(child).books.find(b=>b.id===11).title,book.title);
 assert.equal((await call('/api/admin/uploads','POST',{base64:Buffer.from('<svg onload="bad"/>').toString('base64')})).status,400);
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=';
 const upload=await call('/api/admin/uploads','POST',{base64:png});assert.equal(upload.status,201);const url=(await upload.json()).url;const image=await call(url);assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert.deepEqual(Buffer.from(await image.arrayBuffer()),Buffer.from(png,'base64'));
 assert.equal((await call('/uploads/catalogue.sqlite')).status,404);
 assert.equal((await call('/api/admin/catalogue/books/11','DELETE')).status,200);assert.equal(listCatalogue().books.some(b=>b.id===11),false);
 assert.equal((await call('/api/admin/catalogue/books/999','DELETE')).status,404);
 assert.equal((await call('/api/admin/logout','POST',{})).status,200);assert.equal((await call('/api/admin/catalogue')).status,401);
});
test('all three catalogue types validate required content',async()=>{
 const {saveItem}=await import('./catalogue.mjs');
 assert.throws(()=>saveItem('products',{title:'x',published:true,category:'x',image:'/x.png',link:'https://example.com',rating:9}),/Rating/);
 assert.throws(()=>saveItem('music',{title:'x',artist:'x',genre:'x',url:'/music/x.mp3',cover:'',published:true,licence:''}),/Usage rights/);
});

test('deleted track IDs are not reused by new tracks',async()=>{
 const {saveItem,deleteItem}=await import('./catalogue.mjs');
 const data={title:'Stable favourite ID',artist:'Test',genre:'Test',url:'/music/test.mp3',licence:'Test only',cover:'',published:false};
 const first=saveItem('music',data);deleteItem('music',first.id);const next=saveItem('music',data);assert.ok(next.id>first.id);deleteItem('music',next.id);
});
