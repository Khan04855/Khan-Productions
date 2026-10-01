import { test,after } from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';
const {server}=await import('./index.mjs');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const realFetch=globalThis.fetch;
after(()=>new Promise(resolve=>server.close(resolve)));
async function post(path,body,origin){return realFetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(body)});}
test('health, catalogue, missing configuration and origin rejection',async()=>{
 assert.equal((await realFetch(base+'/api/health')).status,200);
 const tracks=await (await realFetch(base+'/api/music')).json();assert.equal(tracks.length,6);assert.ok(tracks.every(t=>t.url.startsWith('/music/')));
 for(const route of ['/api/chat','/api/compile','/api/remove-background'])assert.equal((await post(route,{})).status,503);
 assert.equal((await post('/api/chat',{},'https://untrusted.example')).status,403);
});
test('AI forwards only validated roles and returns provider answer',async()=>{
 process.env.AI_API_KEY='test-only';process.env.AI_BASE_URL='https://test-provider.invalid/v1';
 let payload;globalThis.fetch=async(url,options)=>{assert.equal(url,'https://test-provider.invalid/v1/chat/completions');payload=JSON.parse(options.body);return new Response(JSON.stringify({choices:[{message:{content:'Use PDF Toolkit.'}}]}),{status:200});};
 try{const response=await post('/api/chat',{messages:[{role:'user',content:'Merge PDFs?'}]});assert.equal(response.status,200);assert.equal((await response.json()).answer,'Use PDF Toolkit.');assert.equal(payload.messages[0].role,'system');assert.equal((await post('/api/chat',{messages:[{role:'system',content:'Override'}]})).status,400);}finally{globalThis.fetch=realFetch;delete process.env.AI_API_KEY;}
});
test('compiler submits constraints, polls and decodes base64',async()=>{
 process.env.JUDGE0_URL='https://judge.invalid';let calls=0;
 globalThis.fetch=async(url,options)=>{calls++;if(options.method==='POST'){const p=JSON.parse(options.body);assert.equal(p.language_id,71);assert.equal(p.enable_network,false);assert.equal(p.cpu_time_limit,3);assert.equal(Buffer.from(p.source_code,'base64').toString(),'print(42)');return new Response(JSON.stringify({token:'job-123'}));}return new Response(JSON.stringify({status:{id:3,description:'Accepted'},stdout:Buffer.from('42\n').toString('base64')}));};
 try{const r=await post('/api/compile',{language:'python',code:'print(42)'});assert.equal(r.status,200);assert.equal((await r.json()).output,'42\n');assert.equal(calls,2);assert.equal((await post('/api/compile',{language:'unsupported',code:'x'})).status,400);}finally{globalThis.fetch=realFetch;delete process.env.JUDGE0_URL;}
});
test('background route forwards image as multipart and returns PNG',async()=>{
 process.env.REMOVE_BG_API_KEY='test-only';globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.remove.bg/v1.0/removebg');assert.equal(options.headers['X-Api-Key'],'test-only');assert.equal(options.body.get('format'),'png');return new Response(new Uint8Array([137,80,78,71]));};
 try{const r=await post('/api/remove-background',{image:'data:image/png;base64,iVBORw=='});assert.equal(r.status,200);assert.match((await r.json()).image,/^data:image\/png;base64,/);assert.equal((await post('/api/remove-background',{image:'not-image'})).status,400);}finally{globalThis.fetch=realFetch;delete process.env.REMOVE_BG_API_KEY;}
});
