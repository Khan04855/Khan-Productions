import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
export default function NotFound(){return <><Navbar/><main id="main-content" className="section-inner min-h-screen pt-40"><h1 className="text-4xl font-bold">Page not found</h1><p className="mt-4 text-muted-foreground">The page may have moved. Return to the homepage to choose a tool or resource.</p><Link to="/" className="action mt-6">Return Home</Link></main></>}
