import { useState } from 'react';
import { BookOpen,Download } from 'lucide-react';
import { downloadFile } from './tools/ToolLayout';
import { booksData } from '@/data/books';

const coverStyles: Record<
  number,
  { background: string; accent: string; symbol: string }
> = {
  3: { background: '#182638', accent: '#d8b878', symbol: 'mystery' },
  4: { background: '#353e32', accent: '#e3c998', symbol: 'war' },
  5: { background: '#482b2b', accent: '#e1b875', symbol: 'history' },
  6: { background: '#29234c', accent: '#dfc182', symbol: 'fantasy' },
  7: { background: '#174b43', accent: '#dfc990', symbol: 'arch' },
  8: { background: '#183a4d', accent: '#d6bd83', symbol: 'arch' },
  9: { background: '#523b28', accent: '#e5cf9e', symbol: 'arch' },
  10: { background: '#203c32', accent: '#e3c678', symbol: 'moon' },
};

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, character => {
    const replacements: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    };

    return replacements[character];
  });
}

function wrapCoverText(text: string, maxCharacters: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;

    if (current && next.length > maxCharacters) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function createBookCover(book: (typeof booksData)[number]): string {
  const style = coverStyles[book.id];
  const titleLines = wrapCoverText(book.title, 20);
  const authorLines = wrapCoverText(book.author, 29);

  const artwork: Record<string, string> = {
    mystery: `
      <circle cx="143" cy="111" r="32"/>
      <path d="M166 135l32 32"/>
      <path d="M128 108h30M143 93v30" opacity=".4"/>
    `,
    war: `
      <path d="M155 158V99M155 127l-24-15M155 141l24-17"/>
      <circle cx="155" cy="90" r="18"/>
      <circle cx="140" cy="86" r="12"/>
      <circle cx="170" cy="86" r="12"/>
    `,
    history: `
      <path d="M105 152h110M115 145V89h80v56"/>
      <path d="M105 88l50-25 50 25z"/>
      <path d="M132 96v42M155 96v42M178 96v42"/>
    `,
    fantasy: `
      <path d="M114 155V97l17-20 17 20v58"/>
      <path d="M148 155V79l17-23 17 23v76"/>
      <path d="M182 155v-52l16-18 16 18v52"/>
      <path d="M165 121v34"/>
      <path d="M93 75l3-8 3 8 8 3-8 3-3 8-3-8-8-3z"/>
    `,
    arch: `
      <path d="M111 158v-50c0-31 44-53 44-53s44 22 44 53v50"/>
      <path d="M126 158v-47c0-21 29-38 29-38s29 17 29 38v47"/>
      <path d="M101 159h108M155 81v68" opacity=".4"/>
    `,
    moon: `
      <path d="M175 66a47 47 0 1 0 22 81 43 43 0 0 1-22-81z"/>
      <path d="M207 81l3-9 3 9 9 3-9 3-3 9-3-9-9-3z"/>
    `,
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="440"
         viewBox="0 0 320 440">
      <rect width="320" height="440" fill="${style.background}"/>
      <rect x="14" y="14" width="292" height="412" rx="3"
            fill="none" stroke="${style.accent}" opacity=".65"/>
      <path d="M25 0v440" stroke="${style.accent}" opacity=".22"/>

      <g fill="none" stroke="${style.accent}" stroke-width="3"
         stroke-linecap="round" stroke-linejoin="round">
        ${artwork[style.symbol]}
      </g>

      <path d="M115 188h90" stroke="${style.accent}" opacity=".65"/>

      <text text-anchor="middle" fill="#fff8e9"
            font-family="Georgia, serif" font-size="24">
        ${titleLines
          .map(
            (line, index) =>
              `<tspan x="160" y="${225 + index * 31}">
                ${escapeXml(line)}
              </tspan>`
          )
          .join('')}
      </text>

      <text text-anchor="middle" fill="${style.accent}"
            font-family="Arial, sans-serif" font-size="13">
        ${authorLines
          .map(
            (line, index) =>
              `<tspan x="160" y="${355 + index * 19}">
                ${escapeXml(line)}
              </tspan>`
          )
          .join('')}
      </text>

      <text x="160" y="407" text-anchor="middle"
            fill="${style.accent}" font-family="Arial, sans-serif"
            font-size="9" letter-spacing="2">
        DIGITAL LIBRARY
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const covers: Record<number, string> = {
  1: '/books-covers/atomic-habits.png',
  2: '/books-covers/TheAlchemist.png',
  3: '/books-covers/sherlock-holmes.png',
  4: '/books-covers/all-quiet.png',
  5: '/books-covers/guns-of-august.png',
  6: '/books-covers/harry-potter.png',
  7: '/books-covers/al-farooq.png',
  8: '/books-covers/saviours-islamic-spirit.png',
  9: '/books-covers/lost-islamic-history.png',
  10: '/books-covers/sealed-nectar.png',
};
export default function Books(){const [downloading,setDownloading]=useState<number|null>(null);const [downloadError,setDownloadError]=useState('');const [downloadStatus,setDownloadStatus]=useState('');const [query,setQuery]=useState('');const [genre,setGenre]=useState('All Books');const categories=['All Books',...new Set(booksData.map(b=>b.genre))];const filtered=booksData.filter(b=>(genre==='All Books'||b.genre===genre)&&`${b.title} ${b.author}`.toLowerCase().includes(query.trim().toLowerCase()));function reset(){setQuery('');setGenre('All Books');}
async function saveBook(book:(typeof booksData)[number]){setDownloading(book.id);setDownloadError('');setDownloadStatus(`Preparing ${book.title}…`);try{await downloadFile(book.file,book.title.replace(/[^a-z0-9 -]/gi,'')+'.pdf','pdf');setDownloadStatus('File sent to your browser. Check Downloads.');}catch(e){setDownloadError((e as Error).message);setDownloadStatus('');}finally{setDownloading(null);}}
return <section id="books" className="section-shell"><div className="section-inner"><p className="eyebrow">Read & learn</p><h2 className="section-heading">Books Library</h2><p className="section-description">Search by title or author, choose a genre, and open or download a PDF.</p><div className="tool-panel mt-8"><label htmlFor="book-search">Search books</label><input id="book-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Book title or author"/><label htmlFor="book-genre">Genre</label><select id="book-genre" value={genre} onChange={e=>setGenre(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><div className="flex items-center gap-4"><p role="status" className="text-sm text-muted-foreground">{filtered.length} books · {genre}</p>{(query||genre!=='All Books')&&<button className="min-h-11 underline" onClick={reset}>Clear filters</button>}</div></div><p role="status" className="mt-4">{downloadStatus}</p>{downloadError&&<p role="alert" className="error mt-4">{downloadError}</p>}<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(b=><article key={b.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"><div className="flex aspect-[3/4] items-center justify-center bg-muted/50 p-5">{covers[b.id]?<img src={covers[b.id]} alt={`${b.title} book cover`} loading="lazy" className="h-full w-full object-contain"/>:<div className="flex h-full w-full flex-col justify-between rounded-lg border border-border bg-background p-5"><BookOpen aria-hidden="true" className="text-primary"/><div><p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">{b.genre}</p><p className="font-serif text-xl leading-snug">{b.title}</p><p className="mt-3 text-sm text-muted-foreground">{b.author}</p></div><p className="text-xs text-muted-foreground">PDF edition</p></div>}</div><div className="flex flex-1 flex-col p-5"><p className="text-xs text-muted-foreground">{b.genre}</p><h3 className="mt-2 font-semibold leading-snug">{b.title}</h3><p className="mb-4 mt-1 text-sm text-muted-foreground">{b.author}</p><div className="mt-auto space-y-2"><a className="secondary-action w-full" href={b.file} target="_blank" rel="noopener noreferrer" aria-label={`Read ${b.title} PDF (opens in a new tab)`}>Read PDF</a><button className="action w-full" disabled={downloading!==null} onClick={()=>void saveBook(b)} aria-label={`Download ${b.title} PDF`}><Download aria-hidden="true" size={16}/>{downloading===b.id?'Preparing download…':'Download PDF'}</button></div></div></article>)}</div>{!filtered.length&&<div className="tool-panel mt-6"><p>No matching books. Try another title or genre.</p><button className="secondary-action" onClick={reset}>Show all books</button></div>}</div></section>}
