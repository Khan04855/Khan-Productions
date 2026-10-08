import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { catalogueAsset, type Product } from '@/contexts/CatalogueContext';

/** Uses the current published catalogue; no invented offers or prices. */
export default function ProductShowcase({ products }: { products: Product[] }) {
 const [ref, api] = useEmblaCarousel({ loop: false });
 const [selected, setSelected] = useState(0);
 const definitions = [
  {title:'Everyday essentials',caption:'Useful finds for your home and routine.',categories:['Kitchen','Beauty & Skincare']},
  {title:'Fashion finds',caption:'Explore clothing, shoes and accessories.',categories:['Fashion']},
  {title:'Tech picks',caption:'Browse audio, devices and everyday tech.',categories:['Electronics']}
 ];
 const groups = definitions.map(group=>({...group,items:products.filter(p=>group.categories.includes(p.category)).slice(0,4)})).filter(group=>group.items.length);
 if(!groups.length&&products.length)groups.push({title:'Explore the collection',caption:'A mix of everyday finds from our shop.',categories:[],items:products.slice(0,4)});
 useEffect(() => {
  if (!api) return;
  const update = () => setSelected(api.selectedScrollSnap());
  update(); api.on('select', update); api.on('reInit', update);
  return () => { api.off('select', update); api.off('reInit', update); };
 }, [api]);
 if (!groups.length) return null;
 return <section className="product-showcase" aria-label="Product highlights" aria-roledescription="carousel">
  <div className="showcase-viewport" ref={ref}><div className="showcase-track">{groups.map((group, i) => <div className={`showcase-slide showcase-theme-${i}`} key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${groups.length}`} aria-hidden={selected!==i}>
   <div className="showcase-copy"><p className="eyebrow">Explore the collection</p><h2>{group.title}</h2><p>{group.caption}</p><a href="#shop-heading" className="action" tabIndex={selected===i?0:-1}>Browse products <ArrowRight size={16}/></a></div>
   <div className="showcase-products" aria-hidden="true">{group.items.map(product => <div key={product.id}><img src={catalogueAsset(product.image)} alt="" loading="lazy" decoding="async"/></div>)}</div>
  </div>)}</div></div>
  {groups.length>1&&<div className="showcase-controls"><button className="secondary-action" aria-label="Previous highlight" disabled={selected===0} onClick={()=>api?.scrollPrev()}><ArrowLeft size={18}/></button><div className="showcase-dots">{groups.map((_,i)=><button key={i} aria-label={`Show highlight ${i+1}`} aria-current={selected===i?'true':undefined} onClick={()=>api?.scrollTo(i)}/>)}</div><button className="secondary-action" aria-label="Next highlight" disabled={selected===groups.length-1} onClick={()=>api?.scrollNext()}><ArrowRight size={18}/></button></div>}
 </section>;
}
