import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { catalogueAsset, type Product } from '@/contexts/CatalogueContext';

/** Uses the current published catalogue; no invented offers or prices. */
export default function ProductShowcase({ products }: { products: Product[] }) {
 const [ref, api] = useEmblaCarousel({ loop: false });
 const [selected, setSelected] = useState(0);
 const groups = Array.from({ length: Math.min(3, Math.ceil(products.length / 4)) }, (_, i) => products.slice(i * 4, i * 4 + 4));
 useEffect(() => {
  if (!api) return;
  const update = () => setSelected(api.selectedScrollSnap());
  update(); api.on('select', update); api.on('reInit', update);
  return () => { api.off('select', update); api.off('reInit', update); };
 }, [api]);
 if (!groups.length) return null;
 const titles = ['Everyday favourites, together.', 'A little inspiration for your day.', 'Explore more of the collection.'];
 return <section className="product-showcase" aria-label="Product highlights" aria-roledescription="carousel">
  <div className="showcase-viewport" ref={ref}><div className="showcase-track">{groups.map((group, i) => <div className={`showcase-slide showcase-theme-${i}`} key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${groups.length}`} aria-hidden={selected!==i}>
   <div className="showcase-copy"><p className="eyebrow">Explore the collection</p><h2>{titles[i]}</h2><p>A mix of useful finds from our shop. Browse below for details and links.</p><a href="#shop-heading" className="action" tabIndex={selected===i?0:-1}>Browse products <ArrowRight size={16}/></a></div>
   <div className="showcase-products" aria-hidden="true">{group.map(product => <div key={product.id}><img src={catalogueAsset(product.image)} alt="" loading="lazy" decoding="async"/></div>)}</div>
  </div>)}</div></div>
  {groups.length>1&&<div className="showcase-controls"><button className="secondary-action" aria-label="Previous highlight" disabled={selected===0} onClick={()=>api?.scrollPrev()}><ArrowLeft size={18}/></button><div className="showcase-dots">{groups.map((_,i)=><button key={i} aria-label={`Show highlight ${i+1}`} aria-current={selected===i?'true':undefined} onClick={()=>api?.scrollTo(i)}/>)}</div><button className="secondary-action" aria-label="Next highlight" disabled={selected===groups.length-1} onClick={()=>api?.scrollNext()}><ArrowRight size={18}/></button></div>}
 </section>;
}
