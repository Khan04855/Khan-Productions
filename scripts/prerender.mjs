import { chromium } from '@playwright/test';
import bundled from '@sparticuz/chromium';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
const origin=(process.env.VITE_SITE_URL||loadEnv('production',process.cwd(),'VITE_').VITE_SITE_URL)?.replace(/\/$/,'');
if(origin){const u=new URL(origin);if(!['http:','https:'].includes(u.protocol)||u.pathname!=='/')throw new Error('VITE_SITE_URL must be a full HTTP(S) origin without a path.');}
const routes=['/','/tools','/library','/music-library','/background-remover','/compiler','/pdf-toolkit','/image-tools'];
const root=path.resolve('dist');
const template=await readFile(path.join(root,'index.html'));
const types={'.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.pdf':'application/pdf','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403).end();return;}let body;try{body=await readFile(filename);res.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');}catch{body=template;res.setHeader('Content-Type','text/html');}res.end(body);}catch{res.writeHead(500).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||(process.platform==='linux'?await bundled.executablePath():undefined),args:process.platform==='linux'?bundled.args.filter(a=>a!=='--single-process'):[]});
 const page=await browser.newPage();
 for(const route of routes){await page.goto(`http://127.0.0.1:${server.address().port}${route}`,{waitUntil:'networkidle'});await page.locator('h1').waitFor();await page.waitForFunction(()=>document.title.includes('| Khan Productions'));if(origin)await page.evaluate(href=>{let link=document.querySelector('link[rel=canonical]');if(!link){link=document.createElement('link');link.setAttribute('rel','canonical');document.head.append(link);}link.setAttribute('href',href);},origin+route);const html='<!doctype html>\n'+await page.content();const dir=route==='/'?root:path.join(root,route);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),html);console.log(`Prerendered ${route}`);}
 if(origin){const parsed=new URL(origin);if(!['http:','https:'].includes(parsed.protocol)||parsed.pathname!=='/')throw new Error('VITE_SITE_URL must be a full HTTP(S) origin without a path.');const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');await writeFile(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${escape(origin+r)}</loc></url>`).join('')}</urlset>`);await writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);console.log('Sitemap generated for configured domain.');}else console.log('Set VITE_SITE_URL to your real public origin to generate canonical URLs and sitemap.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
