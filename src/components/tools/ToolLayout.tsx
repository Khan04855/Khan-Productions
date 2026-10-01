import type { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link,useLocation } from 'react-router-dom';
const backgrounds:Record<string,string>={'/background-remover':'background-remover.png','/image-tools':'image-converter.png','/pdf-toolkit':'pdf-toolkit.png','/compiler':'code-compiler.png','/music-library':'music-library.png'};
export default function ToolLayout({title,description,group,children}:{title:string;description:string;group:string;children:ReactNode}){const {pathname}=useLocation();return <><Navbar/><main id="main-content" className="min-h-screen pt-20"><section className="resource-hero relative isolate overflow-hidden"><div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><img src={`/tool-backgrounds/${backgrounds[pathname]}`} alt="" fetchPriority="high" className="h-full w-full object-cover object-right"/><div className="hero-shade absolute inset-0"/></div><div className="section-inner py-12 sm:py-16"><nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-2 text-sm"><Link to="/">Store</Link><span aria-hidden="true">/</span><Link to="/tools">Tools</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav><p className="eyebrow">{group}</p><h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{description}</p></div></section><div className="section-inner py-10 sm:py-12">{children}</div></main><Footer/></>}
export async function api<T>(path:string,body:unknown):Promise<T>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});let data;try{data=await r.json();}catch{throw new Error('Cannot reach the processing server. Please try again later.');}if(!r.ok)throw new Error(data.error||'Processing failed.');return data;}
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
