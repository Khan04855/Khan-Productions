import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import seed from '@/data/catalogue.json';
import { publicAsset } from '@/lib/public-asset';
export type Product = typeof seed.products[number];
export type Book = typeof seed.books[number];
export type Track = typeof seed.music[number];
export type Catalogue = { products: Product[]; books: Book[]; music: Track[] };
export const apiBase=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
export function catalogueAsset(value:string|undefined){if(!value)return '';if(/^https?:\/\//i.test(value))return value;if(value.startsWith('/uploads/'))return apiBase+value;return publicAsset(value);}
function valid(value:unknown):value is Catalogue {return !!value&&typeof value==='object'&&['products','books','music'].every(key=>Array.isArray((value as Record<string,unknown>)[key])&&((value as Record<string,unknown>)[key] as unknown[]).every(item=>!!item&&typeof item==='object'&&typeof (item as Product).id==='number'&&typeof (item as Product).title==='string'));}
const Context=createContext<Catalogue>(seed as Catalogue);
export function CatalogueProvider({children}:{children:ReactNode}){
 const [catalogue,setCatalogue]=useState<Catalogue>(seed as Catalogue);
 useEffect(()=>{const controller=new AbortController();let busy=false;
  async function refresh(){if(busy)return;busy=true;try{const response=await fetch(apiBase+'/api/catalogue',{signal:controller.signal,cache:'no-store'});if(response.ok){const data:unknown=await response.json();if(valid(data))setCatalogue(data);}}catch{/* Static deployments keep the supplied catalogue. */}finally{busy=false;}}
  void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},60000);window.addEventListener('focus',refresh);window.addEventListener('khan-catalogue-updated',refresh);return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);window.removeEventListener('khan-catalogue-updated',refresh);};
 },[]);
 return <Context.Provider value={catalogue}>{children}</Context.Provider>;
}
export const useCatalogue=()=>useContext(Context);
