import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
const id='G-0WQKC20Q7N';
const storageKey='khan-analytics-choice';
type Choice='accepted'|'declined'|null;
type GoogleWindow=Window & {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void};
function savedChoice():Choice{try{const saved=localStorage.getItem(storageKey);return saved==='accepted'||saved==='declined'?saved:null;}catch{return null;}}
function disable(value:boolean){Object.assign(window,{['ga-disable-'+id]:value});}
function startTag(){
 const win=window as GoogleWindow;
 if(document.getElementById('khan-google-tag'))return;
 win.dataLayer=win.dataLayer||[];
 win.gtag=function(){win.dataLayer!.push(arguments);};
 win.gtag('js',new Date());
 win.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
 const script=document.createElement('script');script.id='khan-google-tag';script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${id}`;document.head.appendChild(script);
}
function clearAnalyticsCookies(){
 for(const cookie of document.cookie.split(';')){
  const name=cookie.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;
  const domains=['',location.hostname,'.'+location.hostname,'.ikhanproductions.com'];
  for(const domain of domains)document.cookie=`${name}=; Max-Age=0; Path=/;${domain?` Domain=${domain};`:''} SameSite=Lax`;
 }
}
export default function Analytics(){
 const {pathname}=useLocation();const [choice,setChoice]=useState<Choice>(savedChoice),[open,setOpen]=useState(false);const previous=useRef('');
 useEffect(()=>{const show=()=>setOpen(true);window.addEventListener('khan-analytics-settings',show);const sync=(event:StorageEvent)=>{if(event.key===storageKey)setChoice(savedChoice());};window.addEventListener('storage',sync);return()=>{window.removeEventListener('khan-analytics-settings',show);window.removeEventListener('storage',sync);};},[]);
 useEffect(()=>{
  const allowed=choice==='accepted'&&pathname!=='/admin';disable(!allowed);
  if(!allowed){previous.current='';return;}
  startTag();
  // Report real routes only: omit search queries, fragments and private admin pages.
  const path=(import.meta.env.BASE_URL.replace(/\/$/,'')||'')+pathname;
  const href=location.origin+path;
  if(previous.current===href)return;
  const timer=requestAnimationFrame(()=>{const referrer=previous.current||(()=>{try{const url=new URL(document.referrer);return url.origin+url.pathname;}catch{return '';}})();
   (window as GoogleWindow).gtag?.('event','page_view',{send_to:id,page_location:href,page_title:document.title,page_referrer:referrer});previous.current=href;
  });
  return()=>cancelAnimationFrame(timer);
 },[choice,pathname]);
 function choose(value:Exclude<Choice,null>){if(value==='declined'){disable(true);clearAnalyticsCookies();}try{localStorage.setItem(storageKey,value);}catch{/* Choice still applies for this visit. */}setChoice(value);setOpen(false);}
 if(pathname==='/admin'||(choice!==null&&!open))return null;
 return <aside className="analytics-choice" aria-label="Analytics preferences"><p className="font-semibold">Help us improve the website</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">With your permission, Google Analytics measures visits using cookies. You can use the website without accepting. <Link className="underline" to="/privacy">Privacy notice</Link></p><div className="mt-4 flex flex-wrap gap-3"><button className="secondary-action" onClick={()=>choose('declined')}>Decline analytics</button><button className="action" onClick={()=>choose('accepted')}>Accept analytics</button></div></aside>;
}
