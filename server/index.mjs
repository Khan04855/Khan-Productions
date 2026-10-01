import http from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.API_PORT || 3001);
const counters = new Map();
const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
function reply(res, status, value) { res.writeHead(status, headers);res.end(JSON.stringify(value)); }
async function json(req) { let size=0;const parts=[];for await(const chunk of req){size+=chunk.length;if(size>15*1024*1024)throw Object.assign(new Error('Upload is too large. Maximum request size is 15 MB.'),{status:413});parts.push(chunk);}try{return JSON.parse(Buffer.concat(parts).toString());}catch{throw Object.assign(new Error('Invalid JSON request.'),{status:400});} }
function need(key) { if(!process.env[key])throw Object.assign(new Error('This service has not been configured yet. Please contact the site administrator.'),{status:503});return process.env[key]; }
async function request(url, options={}) {const r=await fetch(url,{...options,signal:AbortSignal.timeout(30000)});if(!r.ok)throw Object.assign(new Error(r.status===429?'Service is busy. Please try again shortly.':'The processing service could not complete the request. Please try again.'),{status:502});return r;}
export const server = http.createServer(async(req,res)=>{
 try {
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET'&&pathname==='/api/health')return reply(res,200,{ok:true,services:{assistant:!!process.env.AI_API_KEY,compiler:!!process.env.JUDGE0_URL,background:!!process.env.REMOVE_BG_API_KEY}});
  if(req.method==='GET'&&pathname==='/api/music')return reply(res,200,JSON.parse(await readFile(new URL('../src/data/music.json',import.meta.url),'utf8')));
  if(req.method!=='POST')return reply(res,404,{error:'Endpoint not found.'});
  const origin=req.headers.origin;
  const allowed=(process.env.ALLOWED_ORIGINS||'http://localhost:8080,http://127.0.0.1:8080,http://localhost:4173,http://127.0.0.1:4173').split(',');
  if(origin&&!allowed.includes(origin))return reply(res,403,{error:'Origin is not allowed.'});
  const ip=req.socket.remoteAddress;const now=Date.now();const bucket=counters.get(ip)||{count:0,time:now};if(now-bucket.time>60000){bucket.count=0;bucket.time=now;}bucket.count++;counters.set(ip,bucket);if(bucket.count>20)return reply(res,429,{error:'Too many requests. Please wait a minute.'});
  if(counters.size>10000)for(const [k,v] of counters)if(now-v.time>60000)counters.delete(k);
  const body=await json(req);
  if(pathname==='/api/chat'){
   const key=need('AI_API_KEY');
   if(!Array.isArray(body.messages)||body.messages.length<1||body.messages.length>20||body.messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>4000))return reply(res,400,{error:'Send 1–20 messages, each up to 4,000 characters.'});
   const system='You are the Khan Productions website assistant. Answer briefly and helpfully, in the language used by the visitor. Tools: Background Remover /background-remover (images only); Image Converter & Compressor /image-tools (JPG PNG WebP resize); PDF Toolkit /pdf-toolkit (merge, extract/reorder/rotate pages, images to PDF, optimise structure); Code Compiler /compiler (Python JavaScript C C++ Java via isolated Judge0); Music Library /music-library. Tools dashboard /tools. Books Library /library. Homepage sections: /#featured-products, /#resources, /#blog, /#about, /#contact. Contact khanproductions7867@gmail.com. Product purchases happen on Amazon. Do not invent current prices, verified licences, orders, availability or features. Do not claim to have operated a tool. Never request passwords or secrets. Explain when you do not know.';
   const r=await request((process.env.AI_BASE_URL||'https://api.openai.com/v1').replace(/\/$/,'')+'/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.AI_MODEL||'gpt-4.1-mini',messages:[{role:'system',content:system},...body.messages],max_tokens:600})});const data=await r.json();const answer=data.choices?.[0]?.message?.content;if(typeof answer!=='string')throw new Error('The assistant returned an empty answer.');return reply(res,200,{answer});
  }
  if(pathname==='/api/compile'){
   const base=need('JUDGE0_URL').replace(/\/$/,'');const ids={python:71,javascript:63,c:50,cpp:54,java:62};
   if(!Object.hasOwn(ids,body.language)||typeof body.code!=='string'||!body.code.trim()||body.code.length>50000||typeof (body.stdin||'')!=='string'||(body.stdin||'').length>10000)return reply(res,400,{error:'Select a supported language and enter code (maximum 50,000 characters).'});
   const auth={'Content-Type':'application/json'};if(process.env.JUDGE0_API_KEY)auth['X-RapidAPI-Key']=process.env.JUDGE0_API_KEY;if(process.env.JUDGE0_API_HOST)auth['X-RapidAPI-Host']=process.env.JUDGE0_API_HOST;if(process.env.JUDGE0_AUTH_TOKEN)auth['X-Auth-Token']=process.env.JUDGE0_AUTH_TOKEN;
   const r=await request(base+'/submissions?base64_encoded=true&wait=false',{method:'POST',headers:auth,body:JSON.stringify({language_id:ids[body.language],source_code:Buffer.from(body.code).toString('base64'),stdin:Buffer.from(body.stdin||'').toString('base64'),cpu_time_limit:3,wall_time_limit:5,memory_limit:128000,max_file_size:1024,enable_network:false})});const {token}=await r.json();if(typeof token!=='string'||!/^[a-zA-Z0-9-]+$/.test(token))throw new Error('Execution service returned an invalid job.');
   for(let i=0;i<30;i++){await new Promise(resolve=>setTimeout(resolve,500));const poll=await request(base+'/submissions/'+token+'?base64_encoded=true',{headers:auth});const result=await poll.json();if(result.status?.id>2){for(const k of ['stdout','stderr','compile_output','message'])if(result[k])result[k]=Buffer.from(result[k],'base64').toString('utf8');return reply(res,200,{output:[result.stdout,result.stderr,result.compile_output,result.message].filter(Boolean).join('\n'),status:result.status.description});}}
   return reply(res,504,{error:'Execution timed out. Try a smaller program.'});
  }
  if(pathname==='/api/remove-background'){
   const key=need('REMOVE_BG_API_KEY');if(typeof body.image!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(body.image))return reply(res,400,{error:'Upload a JPG, PNG or WebP image.'});
   const payload=body.image.split(',')[1];const bytes=Buffer.from(payload,'base64');if(bytes.length>10*1024*1024)return reply(res,413,{error:'Image must be under 10 MB.'});
   const form=new FormData();form.append('image_file',new Blob([bytes]),'image');form.append('size','auto');form.append('format','png');const r=await request('https://api.remove.bg/v1.0/removebg',{method:'POST',headers:{'X-Api-Key':key},body:form});return reply(res,200,{image:'data:image/png;base64,'+Buffer.from(await r.arrayBuffer()).toString('base64')});
  }
  reply(res,404,{error:'Endpoint not found.'});
 }catch(e){reply(res,e.status||502,{error:e.status?e.message:'Processing failed or timed out. Please try again.'});}
});
if(process.env.NODE_ENV!=='test') server.listen(port,'127.0.0.1',()=>console.log(`Khan Productions API listening on ${port}`));
