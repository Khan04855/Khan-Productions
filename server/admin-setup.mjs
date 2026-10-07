import readline from 'node:readline';
import { Writable } from 'node:stream';
import { configureAdmin, adminConfigured, dataDir } from './catalogue.mjs';
let hidden=false;
const output=new Writable({write(chunk,encoding,callback){if(!hidden)process.stdout.write(chunk,encoding);callback();}});
const rl=readline.createInterface({input:process.stdin,output,terminal:!!process.stdin.isTTY});
const ask=(prompt,secret=false)=>new Promise(resolve=>{process.stdout.write(prompt);hidden=secret;rl.question('',answer=>{hidden=false;if(secret)process.stdout.write('\n');resolve(answer);});});
try{
 if(adminConfigured()){const answer=await ask('An admin already exists. Reset its credentials and sessions? Type RESET: ');if(answer!=='RESET'){console.log('No changes made.');process.exitCode=0;rl.close();}else await setup();}else await setup();
}catch(e){console.error(e.message);process.exitCode=1;}finally{rl.close();}
async function setup(){const username=await ask('Admin username: ');const password=await ask('Password (at least 12 characters, hidden): ',true);const confirmation=await ask('Confirm password: ',true);if(password!==confirmation)throw new Error('Passwords do not match.');configureAdmin(username,password);console.log(`Admin created. Persistent data folder: ${dataDir}\nStart the backend and visit /admin.`);}
