import { useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { booksData } from '@/data/books';

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

return (
  <section id="books" className="section-shell">
    <div className="section-inner">
      <p className="eyebrow">Read & learn</p>
      <h2 className="section-heading">Books Library</h2>

      <p className="section-description">
        Search by title or author, choose a genre, and read or
        download PDFs through Google Drive.
      </p>

      <div className="tool-panel mt-8">
        <label htmlFor="book-search">Search books</label>

        <input
          id="book-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Book title or author"
        />

        <label htmlFor="book-genre">Genre</label>

        <select
          id="book-genre"
          value={genre}
          onChange={event => setGenre(event.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap items-center gap-4">
          <p
            role="status"
            className="text-sm text-muted-foreground"
          >
            {filtered.length} books · {genre}
          </p>

          {(query || genre !== 'All Books') && (
            <button
              type="button"
              className="min-h-11 underline"
              onClick={reset}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map(b => (
          <article
            key={b.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="flex aspect-[3/4] items-center justify-center bg-muted/50 p-5">
              {covers[b.id] ? (
                <img
                  src={covers[b.id]}
                  alt={`${b.title} book cover`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between rounded-lg border border-border bg-background p-5">
                  <BookOpen
                    aria-hidden="true"
                    className="text-primary"
                  />

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      {b.genre}
                    </p>

                    <p className="font-serif text-xl leading-snug">
                      {b.title}
                    </p>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {b.author}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    PDF edition
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs text-muted-foreground">
                {b.genre}
              </p>

              <h3 className="mt-2 font-semibold leading-snug">
                {b.title}
              </h3>

              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                {b.author}
              </p>

              <div className="mt-auto space-y-2">
                <a
                  className="secondary-action w-full"
                  href={b.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${b.title} on Google Drive (opens in a new tab)`}
                >
                  Read PDF
                </a>

                <a
                  className="action w-full"
                  href={b.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${b.title} to download on Google Drive (opens in a new tab)`}
                >
                  <Download aria-hidden="true" size={16} />
                  Download on Drive
                </a>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Opens Google Drive. Use its Download button
                  to save the PDF.
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="tool-panel mt-6">
          <p>
            No matching books. Try another title or genre.
          </p>

          <button
            type="button"
            className="secondary-action"
            onClick={reset}
          >
            Show all books
          </button>
        </div>
      )}
    </div>
  </section>
);
}