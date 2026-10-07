import { useEffect, useState } from 'react';
export function useCataloguePages<T extends {title:string}>(items:T[],filterKey:string){
 const [page,setPage]=useState(1),[size,setSize]=useState(12),[compact,setCompact]=useState(false),[sort,setSort]=useState('catalogue');
 useEffect(()=>setPage(1),[filterKey,size,sort]);
 const sorted=sort==='catalogue'?items:[...items].sort((a,b)=>sort==='za'?b.title.localeCompare(a.title):a.title.localeCompare(b.title));
 const pages=Math.max(1,Math.ceil(sorted.length/size)),current=Math.min(page,pages);
 return {items:sorted.slice((current-1)*size,current*size),page:current,setPage,size,setSize,compact,setCompact,sort,setSort,pages,total:items.length};
}
type Paging=ReturnType<typeof useCataloguePages>;
export function CatalogueControls({paging,id}:{paging:Paging;id:string}){return <div className="catalogue-controls"><label htmlFor={id+'-sort'}>Sort<select aria-label="Sort" id={id+'-sort'} value={paging.sort} onChange={e=>paging.setSort(e.target.value)}><option value="catalogue">Catalogue order</option><option value="az">Title A–Z</option><option value="za">Title Z–A</option></select></label><label htmlFor={id+'-size'}>Per page<select aria-label="Per page" id={id+'-size'} value={paging.size} onChange={e=>paging.setSize(Number(e.target.value))}>{[6,12,24].map(size=><option key={size}>{size}</option>)}</select></label><button className="secondary-action" aria-pressed={paging.compact} onClick={()=>paging.setCompact(!paging.compact)}>Compact view</button></div>}
export function CataloguePagination({paging}:{paging:Paging}){if(!paging.total)return null;return <nav className="catalogue-pagination" aria-label="Catalogue pages"><button className="secondary-action" disabled={paging.page===1} onClick={()=>paging.setPage(paging.page-1)}>← Previous</button><p role="status">Page {paging.page} of {paging.pages} · {paging.total} items</p><button className="secondary-action" disabled={paging.page===paging.pages} onClick={()=>paging.setPage(paging.page+1)}>Next →</button></nav>}
