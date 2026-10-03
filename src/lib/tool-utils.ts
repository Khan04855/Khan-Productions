export async function api<T>(path:string,body:unknown):Promise<T>{const base=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(50000)});let data;try{data=await r.json();}catch{throw new Error('Cannot reach the processing server. Please try again later.');}if(!r.ok)throw new Error(data.error||'Processing failed.');return data;}
export function downloadBlob(blob:Blob,name:string){
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');
 link.href=url;link.download=name;link.style.display='none';
 document.body.appendChild(link);link.click();link.remove();
 // Allow the browser time to begin large file downloads.
 setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export async function downloadFile(url:string,name:string,kind:'pdf'|'audio'){
 let response:Response;
 try{response=await fetch(url,{cache:'no-cache',signal:AbortSignal.timeout(120000)});}catch{throw new Error('File transfer failed. Keep the website server running and try again.');}
 if(!response.ok)throw new Error(`File unavailable (HTTP ${response.status}). Check that this file is included in the running project or deployment.`);
 const blob=await response.blob();
 if(!blob.size)throw new Error('This file is empty.');
 const head=await blob.slice(0,1024).text();
 if(blob.type.includes('text/html')||/^\s*(<!doctype html|<html)/i.test(head))throw new Error('The file URL returned a website page instead of the file. Check the asset path and deployed files.');
 if(kind==='pdf'&&!head.includes('%PDF-'))throw new Error('The requested file is not a valid PDF.');
 if(kind==='audio'&&blob.type&&!blob.type.startsWith('audio/')&&!blob.type.includes('octet-stream'))throw new Error('The requested file is not an audio file.');
 downloadBlob(blob,name);
}
