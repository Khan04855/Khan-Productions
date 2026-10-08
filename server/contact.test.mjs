import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {deliverContact,validateContact} from './contact.mjs';
const old={key:process.env.RESEND_API_KEY,from:process.env.CONTACT_FROM,to:process.env.CONTACT_TO};
after(()=>{for(const [key,value] of [['RESEND_API_KEY',old.key],['CONTACT_FROM',old.from],['CONTACT_TO',old.to]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}});
const message={name:'Test visitor',email:'visitor@example.com',subject:'Website question',message:'A test enquiry.',website:''};
test('contact rejects invalid and bot input before delivery',async()=>{
 for(const body of [{...message,email:'bad'},{...message,subject:'header\ninjection'},{...message,website:'bot'},{...message,message:'x'.repeat(3001)}])assert.throws(()=>validateContact(body));
 delete process.env.RESEND_API_KEY;await assert.rejects(deliverContact(message),e=>e.status===503);
});
test('contact uses fixed configured recipient and only confirms provider acceptance',async()=>{
 process.env.RESEND_API_KEY='test-only';process.env.CONTACT_FROM='Site <support@example.com>';process.env.CONTACT_TO='support@example.com';
 const mock=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');const sent=JSON.parse(options.body);assert.deepEqual(sent.to,['support@example.com']);assert.equal(sent.reply_to,message.email);assert.match(sent.text,/A test enquiry/);assert.equal(sent.html,undefined);return new Response(JSON.stringify({id:'mock-email'}));};
 assert.deepEqual(await deliverContact({...message,to:'attacker@example.com'},mock),{ok:true});
 await assert.rejects(deliverContact(message,async()=>new Response('{}',{status:403})),e=>e.status===502);
 await assert.rejects(deliverContact(message,async()=>new Response('{}')),e=>e.status===502);
});
