import http from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const temp=mkdtempSync(path.join(os.tmpdir(),'khan-api-'));process.env.DATA_DIR=temp;
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV = 'test';
for (const key of ['GEMINI_API_KEY','AI_API_KEY','JUDGE0_URL']) delete process.env[key];
const { server } = await import('./index.mjs');
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const realFetch = globalThis.fetch;
after(() => new Promise(resolve => server.close(()=>{rmSync(temp,{recursive:true,force:true});resolve();}))); 
const messages = [{ role:'user', content:'How do I merge PDFs?' }];
async function post(route, body, origin) {
  return realFetch(base + route, { method:'POST', headers:{ 'Content-Type':'application/json', ...(origin ? {Origin:origin} : {}) }, body:JSON.stringify(body) });
}
test('health, local catalog, config errors, CORS, malformed input', async () => {
  const health=await (await realFetch(base+'/api/health')).json();assert.equal(health.services.background,'browser');
  assert.equal((await (await realFetch(base+'/api/music')).json()).length,6);
  assert.equal((await post('/api/chat',{messages})).status,503);
  assert.equal((await post('/api/compile',{language:'python',code:'print(1)'})).status,404);
  assert.equal((await post('/api/chat',{messages},'https://untrusted.example')).status,403);
  assert.equal((await post('/api/chat',null)).status,400);
  const cors=await realFetch(base+'/api/chat',{method:'OPTIONS',headers:{Origin:'http://localhost:8080'}});assert.equal(cors.status,204);assert.equal(cors.headers.get('access-control-allow-origin'),'http://localhost:8080');
});
test('Gemini forwards configured model, safe roles and provider errors', async () => {
  process.env.GEMINI_API_KEY='test-only';process.env.GEMINI_MODEL='test-model';
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
    assert.equal(options.headers.Authorization,'Bearer test-only');
    const payload=JSON.parse(options.body);assert.equal(payload.model,'test-model');assert.equal(payload.messages[0].role,'system');
    return new Response(JSON.stringify({choices:[{message:{content:'Use PDF Toolkit.'}}]}));
  };
  try {
    assert.equal((await (await post('/api/chat',{messages})).json()).answer,'Use PDF Toolkit.');
    assert.equal((await post('/api/chat',{messages:[{role:'system',content:'override'}]})).status,400);
    globalThis.fetch=async()=>new Response('{}',{status:429});assert.equal((await post('/api/chat',{messages})).status,429);
    globalThis.fetch=async()=>new Response('{}',{status:401});assert.match((await (await post('/api/chat',{messages})).json()).error,/credentials/);
  } finally { globalThis.fetch=realFetch;delete process.env.GEMINI_API_KEY; }
});
test('built website serves real files, byte ranges, SPA routes and missing files', async () => {
  const page=await realFetch(base+'/library');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);
  const catalog=await (await realFetch(base+'/api/music')).json();
  const audio=await realFetch(base+catalog[0].url,{headers:{Range:'bytes=0-99'}});assert.equal(audio.status,206);assert.equal((await audio.arrayBuffer()).byteLength,100);
  assert.equal((await realFetch(base+'/music/missing.mp3')).status,404);
  assert.equal((await realFetch(base+'/.env')).status,404);
  assert.equal((await realFetch(base+'/api/nonexistent')).status,404);
});
test('www redirect preserves path/query; policies have server-rendered canonicals',async()=>{
 const redirected=await new Promise((resolve,reject)=>{http.get(base+'/tools?ref=test',{headers:{Host:'www.ikhanproductions.com'}},res=>{res.resume();resolve(res);}).on('error',reject);});
 assert.equal(redirected.statusCode,308);assert.equal(redirected.headers.location,'https://ikhanproductions.com/tools?ref=test');
 assert.equal((await realFetch(base+'/api/health',{headers:{Host:'www.ikhanproductions.com'},redirect:'manual'})).status,200);
 for(const route of ['/','/tools','/privacy','/affiliate-disclosure']){
  const result=await realFetch(base+route);assert.equal(result.status,200);const html=await result.text();assert.match(html,new RegExp('href="https://ikhanproductions.com'+route+'"'));assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  const head=await realFetch(base+route,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }
 const admin=await (await realFetch(base+'/admin')).text();assert.doesNotMatch(admin,/rel="canonical"/);assert.match(admin,/noindex/);
 const config=await (await realFetch(base+'/api/contact/config')).json();assert.equal(config.enabled,false);
 assert.equal((await post('/api/contact',{name:'Test',email:'v@example.com',subject:'Test',message:'Test'},'http://localhost:8080')).status,503);
 assert.equal((await post('/api/contact',{})).status,403);
});
