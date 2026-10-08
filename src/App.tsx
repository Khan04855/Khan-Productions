import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter,Routes,Route,useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Tools from './pages/Tools';
import Library from './pages/Library';
import TrustPage from './pages/TrustPage';
import PageMeta from './components/PageMeta';
const MusicLibrary=lazy(()=>import('./components/MusicLibary'));
const BackgroundRemover=lazy(()=>import('./components/bg-studio'));
const Admin=lazy(()=>import('./pages/Admin'));
import { CatalogueProvider } from './contexts/CatalogueContext';
const PdfToolkit=lazy(()=>import('./components/tools/PdfToolkit'));
const ImageTools=lazy(()=>import('./components/tools/ImageTools'));
import Assistant from './components/Assistant';
function ScrollManager(){const location=useLocation();useEffect(()=>{if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}else window.scrollTo(0,0);},[location]);return null;}
export default function App(){return <ThemeProvider defaultTheme="light"><CatalogueProvider><BrowserRouter basename={import.meta.env.BASE_URL}><ScrollManager/><PageMeta/><Suspense fallback={<main className="section-inner pt-32" role="status">Loading tool…</main>}><Routes><Route path="/" element={<Index/>}/><Route path="/privacy" element={<TrustPage kind="privacy"/>}/><Route path="/affiliate-disclosure" element={<TrustPage kind="affiliate"/>}/><Route path="/tools" element={<Tools/>}/><Route path="/library" element={<Library/>}/><Route path="/music-library" element={<MusicLibrary/>}/><Route path="/background-remover" element={<BackgroundRemover/>}/><Route path="/admin" element={<Admin/>}/><Route path="/pdf-toolkit" element={<PdfToolkit/>}/><Route path="/image-tools" element={<ImageTools/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense><Assistant/></BrowserRouter></CatalogueProvider></ThemeProvider>}
