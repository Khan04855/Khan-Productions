import { test, after } from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV = 'test';
for (const key of ['GEMINI_API_KEY','AI_API_KEY','JUDGE0_URL']) delete process.env[key];
const { server } = await import('./index.mjs');
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const realFetch = globalThis.fetch;
after(() => new Promise(resolve => server.close(resolve)));
const messages = [{ role:'user', content:'How do I merge PDFs?' }];
async function post(route, body, origin) {
  return realFetch(base + route, { method:'POST', headers:{ 'Content-Type':'application/json', ...(origin ? {Origin:origin} : {}) }, body:JSON.stringify(body) });
}
test('health, local catalog, config errors, CORS, malformed input', async () => {
  const health=await (await realFetch(base+'/api/health')).json();assert.equal(health.services.background,'browser');
  assert.equal((await (await realFetch(base+'/api/music')).json()).length,6);
  assert.equal((await post('/api/chat',{messages})).status,503);
  assert.equal((await post('/api/compile',{language:'python',code:'print(1)'})).status,503);
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
test('compiler language ID configuration, isolation limits, polling and errors', async () => {
  process.env.JUDGE0_URL='https://judge.invalid';process.env.JUDGE0_LANGUAGE_PYTHON='99';let calls=0;
  globalThis.fetch=async(url,options)=>{
    calls++;if(options.method==='POST') {
      const payload=JSON.parse(options.body);assert.equal(payload.language_id,99);assert.equal(payload.enable_network,false);assert.equal(payload.cpu_time_limit,3);assert.equal(payload.memory_limit,128000);
      assert.equal(Buffer.from(payload.source_code,'base64').toString(),'print(42)');return new Response(JSON.stringify({token:'job-123'}));
    }
    return new Response(JSON.stringify({status:{id:3,description:'Accepted'},stdout:Buffer.from('42\n').toString('base64')}));
  };
  try {
    const response=await post('/api/compile',{language:'python',code:'print(42)'});assert.equal(response.status,200);assert.equal((await response.json()).output,'42\n');assert.equal(calls,2);
    assert.equal((await post('/api/compile',{language:'unsupported',code:'x'})).status,400);
  } finally { globalThis.fetch=realFetch;delete process.env.JUDGE0_URL;delete process.env.JUDGE0_LANGUAGE_PYTHON; }
});
test('built website serves real files, byte ranges, SPA routes and missing files', async () => {
  const page=await realFetch(base+'/library');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);
  const catalog=await (await realFetch(base+'/api/music')).json();
  const audio=await realFetch(base+catalog[0].url,{headers:{Range:'bytes=0-99'}});assert.equal(audio.status,206);assert.equal((await audio.arrayBuffer()).byteLength,100);
  assert.equal((await realFetch(base+'/music/missing.mp3')).status,404);
  assert.equal((await realFetch(base+'/.env')).status,404);
  assert.equal((await realFetch(base+'/api/nonexistent')).status,404);
});
