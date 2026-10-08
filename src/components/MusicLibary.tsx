import { useEffect, useRef, useState } from 'react';
import { useCatalogue, categoryNames, catalogueAsset, type Track } from '@/contexts/CatalogueContext';
import { useCataloguePages, CatalogueControls, CataloguePagination } from './CatalogueControls';
import ToolLayout from './tools/ToolLayout';
import { downloadFile } from '@/lib/tool-utils';
import { musicArtwork } from '@/lib/music-artwork';

type CardProps = {
  track: Track;
  saved: boolean;
  onSave: () => void;
};

function MusicCard({ track, saved, onSave }: CardProps) {
  const fallbackCover = musicArtwork(track);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('');

  function activatePlayer() {
    document
      .querySelectorAll<HTMLAudioElement>('audio[data-khan-music]')
      .forEach(player => {
        if (player !== audio.current) player.pause();
      });

    setPlaying(true);
    setPlayError('');
  }

  async function play() {
    const player = audio.current;
    if (!player) return;

    setPlayError('');

    try {
      // Source stays unchanged while playback starts.
      await player.play();
    } catch (error) {
      // Switching tracks can interrupt a pending Play request.
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      setPlayError(
        'This track could not start. Try the player controls below.'
      );
    }
  }

  async function download() {
    setDownloading(true);
    setDownloadError('');
    setStatus('Preparing download…');

    const filename =
      track.title.replace(/[^a-z0-9 -]/gi, '').trim() || 'track';

    try {
      await downloadFile(catalogueAsset(track.url), `${filename}.mp3`, 'audio');
      setStatus('Download started. Check your browser downloads.');
    } catch (error) {
      setStatus('');
      setDownloadError(
        error instanceof Error
          ? error.message
          : 'Download failed. Please try again.'
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className="tool-panel music-card flex flex-col">
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl bg-muted">
        <img
          src={track.cover ? catalogueAsset(track.cover) : fallbackCover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={event => {
            if (event.currentTarget.src !== fallbackCover) {
              event.currentTarget.src = fallbackCover;
            }
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {track.genre}
      </p>

      <h2 className="text-lg font-semibold leading-snug">
        {track.title}
      </h2>

      <p className="text-sm text-muted-foreground">
        {track.artist}
      </p>

      <audio
        ref={audio}
        data-khan-music
        controls
        src={catalogueAsset(track.url)}
        preload="none"
        aria-label={`Player for ${track.title}`}
        className="w-full min-w-0"
        onPlay={activatePlayer}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() =>
          setPlayError(
            'Audio unavailable. Check this track file and its URL.'
          )
        }
      />

      {playing && (
        <p role="status" className="text-sm text-primary">
          Playing this track
        </p>
      )}

      {playError && (
        <p role="alert" className="error">
          {playError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="action"
          aria-label={`Play ${track.title}`}
          onClick={() => void play()}
        >
          Play
        </button>

        <button
          type="button"
          className="secondary-action"
          aria-pressed={saved}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${track.title}`}
          onClick={onSave}
        >
          {saved ? 'Saved' : 'Save'}
        </button>

        <button
          type="button"
          className="secondary-action"
          disabled={downloading}
          aria-label={`Download ${track.title} audio`}
          onClick={() => void download()}
        >
          {downloading ? 'Preparing…' : 'Download Audio'}
        </button>
      </div>

      {status && (
        <p role="status" className="text-sm text-muted-foreground">
          {status}
        </p>
      )}

      {downloadError && (
        <p role="alert" className="error">
          {downloadError}
        </p>
      )}

      <details className="catalogue-details">
        <summary className="min-h-11 cursor-pointer py-3 text-sm">
          Usage rights
        </summary>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {track.licence}
        </p>
      </details>
    </article>
  );
}

export default function MusicLibrary() {
  const catalogue=useCatalogue();const {music:catalog}=catalogue;
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All Genres');
  const [onlySaved, setOnlySaved] = useState(false);
  const [storageError, setStorageError] = useState('');

  const [favourites, setFavourites] = useState<number[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem('khan-music-favourites') || '[]'
      );

      return Array.isArray(saved)
        ? saved.filter(
            (id): id is number => typeof id === 'number'
          )
        : [];
    } catch {
      return [];
    }
  });

  const genres = [
    'All Genres',
    ...categoryNames(catalogue, 'music'),
  ];

  useEffect(()=>{if(!genres.includes(genre))setGenre('All Genres');},[catalogue,genre]);

  const filtered = catalog.filter(track => {
    const matchesGenre =
      genre === 'All Genres' || track.genre === genre;

    const matchesSaved =
      !onlySaved || favourites.includes(track.id);

    const matchesSearch = `${track.title} ${track.artist}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    return matchesGenre && matchesSaved && matchesSearch;
  });

  const paging=useCataloguePages(filtered,query+'|'+genre+'|'+onlySaved);

  function toggleSaved(id: number) {
    const next = favourites.includes(id)
      ? favourites.filter(savedId => savedId !== id)
      : [...favourites, id];

    setFavourites(next);
    setStorageError('');

    try {
      localStorage.setItem(
        'khan-music-favourites',
        JSON.stringify(next)
      );
    } catch {
      setStorageError(
        'Your browser could not save favourites for your next visit.'
      );
    }
  }

  function resetFilters() {
    setQuery('');
    setGenre('All Genres');
    setOnlySaved(false);
  }

  return (
    <ToolLayout
      title="Music Library"
      group="Audio Resources"
      description="Search by track or artist, filter by genre, and play music inside each track card."
    >
      <div className="tool-panel">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="music-search">
              Search by track or artist
            </label>

            <input
              id="music-search"
              type="search"
              placeholder="Track or artist name"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="music-genre">Genre</label>

            <select
              aria-label="Genre" id="music-genre"
              value={genre}
              onChange={event => setGenre(event.target.value)}
              className="w-full"
            >
              {genres.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label
          htmlFor="music-only-saved"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minHeight: '44px',
          }}
        >
          <input
            id="music-only-saved"
            type="checkbox"
            checked={onlySaved}
            onChange={event =>
              setOnlySaved(event.target.checked)
            }
            style={{
              width: '18px',
              height: '18px',
              margin: 0,
              flexShrink: 0,
            }}
          />

          <span>Show saved tracks only</span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'track' : 'tracks'} found
          </p>

          {(query || genre !== 'All Genres' || onlySaved) && (
            <button
              type="button"
              className="secondary-action"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <CatalogueControls paging={paging} id="music"/>
        {storageError && (
          <p role="alert" className="error">
            {storageError}
          </p>
        )}
      </div>

      <div className={`catalogue-grid music-grid mt-6 ${paging.compact?'compact':''}`}>
        {paging.items.map(track => (
          <MusicCard
            key={track.id}
            track={track}
            saved={favourites.includes(track.id)}
            onSave={() => toggleSaved(track.id)}
          />
        ))}
      </div>

      <CataloguePagination paging={paging}/>
      {!filtered.length && (
        <div className="tool-panel mt-6">
          <p>No tracks match your filters.</p>

          <button
            type="button"
            className="secondary-action"
            onClick={resetFilters}
          >
            Show all tracks
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
