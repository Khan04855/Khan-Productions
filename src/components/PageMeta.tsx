import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const pages:Record<string,[string,string]>={
'/':['Online Store','Browse curated products for your home, work and lifestyle. Explore the Khan Productions collection and shop through Amazon.'],
'/tools':['Digital Tools','Browse background removal, image conversion, PDF editing and code execution tools by task.'],
'/library':['Books Library','Search the Khan Productions books collection by title, author and genre. Read or download supplied PDF editions.'],
'/music-library':['Music Library','Browse music by track, artist and genre. Preview audio and save favourites.'],
'/background-remover':['Background Remover','Remove an image background and download a transparent PNG. Upload JPG, PNG or WebP and preview your result.'],
'/compiler':['Universal Code Compiler','Run Python, JavaScript, C, C++ and Java code with standard input and clear execution results.'],
'/pdf-toolkit':['PDF Toolkit','Merge, extract, reorder and rotate PDF pages or create PDFs from images. Process files locally in your browser.'],
'/image-tools':['Image Converter & Compressor','Convert JPG, PNG and WebP images, resize dimensions and compress batches locally in your browser.']};
export default function PageMeta(){const {pathname}=useLocation();useEffect(()=>{const [title,description]=pages[pathname]||['Page not found','The requested Khan Productions page could not be found.'];document.title=`Khan Productions | ${title}`;for(const [selector,key,value] of [['meta[name="description"]','content',description],['meta[property="og:title"]','content',document.title],['meta[property="og:description"]','content',description]]){document.querySelector(selector)?.setAttribute(key,value);} const base=import.meta.env.VITE_SITE_URL?.replace(/\/$/,'');let canonical=document.querySelector('link[rel="canonical"]');if(base&&pages[pathname]){if(!canonical){canonical=document.createElement('link');canonical.setAttribute('rel','canonical');document.head.append(canonical);}canonical.setAttribute('href',base+pathname);}else canonical?.remove();},[pathname]);return null;}
