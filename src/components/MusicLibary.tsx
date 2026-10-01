import { useEffect, useRef, useState } from 'react';
import tracks from '@/data/music.json';
import ToolLayout, { downloadFile } from './tools/ToolLayout';

type Track = (typeof tracks)[number];

export default function MusicLibrary() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All Genres');
  const [catalog, setCatalog] = useState<Track[]>(tracks);
  const [current, setCurrent] = useState<Track | null>(tracks[0] ?? null);
  const [onlySaved, setOnlySaved] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [downloadStatus, setDownloadStatus] = useState('');

  const audio = useRef<HTMLAudioElement>(null);

  const [favourites, setFavourites] = useState<number[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem('khan-music-favourites') || '[]'
      );

      return Array.isArray(saved)
        ? saved.filter((id): id is number => typeof id === 'number')
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch('/api/music', {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data: unknown = await response.json();

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data.every(
            item =>
              item &&
              typeof item.id === 'number' &&
              typeof item.title === 'string' &&
              typeof item.artist === 'string' &&
              typeof item.genre === 'string' &&
              typeof item.licence === 'string' &&
              typeof item.url === 'string' &&
              item.url.startsWith('/music/')
          )
        ) {
          const updated = data as Track[];
          setCatalog(updated);

          setCurrent(previous =>
            updated.find(track => track.id === previous?.id) ?? updated[0]
          );
        }
      } catch {
        // Keep the supplied local catalog if the API is unavailable.
      }
    }

    void loadCatalog();

    return () => controller.abort();
  }, []);

  const genres = [
    'All Genres',
    ...new Set(catalog.map(track => track.genre)),
  ];

  const filtered = catalog.filter(track => {
    const matchesGenre =
      genre === 'All Genres' || track.genre === genre;

    const matchesSaved =
      !onlySaved || favourites.includes(track.id);

    const matchesSearch =
      `${track.title} ${track.artist}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());

    return matchesGenre && matchesSaved && matchesSearch;
  });

  const hasFilters =
    query.trim() !== '' || genre !== 'All Genres' || onlySaved;

  function resetFilters() {
    setQuery('');
    setGenre('All Genres');
    setOnlySaved(false);
  }

  function toggleSaved(id: number) {
    const next = favourites.includes(id)
      ? favourites.filter(savedId => savedId !== id)
      : [...favourites, id];

    setFavourites(next);

    try {
      localStorage.setItem(
        'khan-music-favourites',
        JSON.stringify(next)
      );
    } catch {
      setError(
        'Your browser could not save favourites. Please check your browser storage settings.'
      );
    }
  }

  async function playTrack(track: Track) {
    setError('');
    setCurrent(track);

    const player = audio.current;
    if (!player) return;

    player.src = track.url;

    try {
      await player.play();
    } catch {
      setError(
        'Audio could not play. Check the audio file or try the player controls.'
      );
    }
  }

  function playNextTrack() {
    if (!current) return;

    const index = catalog.findIndex(track => track.id === current.id);
    const next = catalog[index + 1];

    if (next) void playTrack(next);
  }

  async function downloadTrack(track: Track) {
    setDownloadingId(track.id);
    setError('');
    setDownloadStatus(`Preparing ${track.title}…`);

    const name =
      track.title.replace(/[^a-z0-9 -]/gi, '').trim() || 'track';

    try {
      await downloadFile(track.url, `${name}.mp3`, 'audio');
      setDownloadStatus(
        `Download started for ${track.title}. Check your browser downloads.`
      );
    } catch (err) {
      setDownloadStatus('');
      setError(
        err instanceof Error
          ? err.message
          : 'The audio download failed. Please try again.'
      );
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <ToolLayout
      title="Music Library"
      group="Audio Resources"
      description="Search by track or artist, filter by genre, and play or download music."
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
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Track or artist name"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="music-genre">Genre</label>

            <select
              id="music-genre"
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
            marginTop: '20px',
            minHeight: '44px',
            cursor: 'pointer',
          }}
        >
          <input
            id="music-only-saved"
            type="checkbox"
            checked={onlySaved}
            onChange={event => setOnlySaved(event.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              margin: 0,
              flexShrink: 0,
            }}
          />

          <span>Show saved tracks only</span>
        </label>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'track' : 'tracks'} found
          </p>

          {hasFilters && (
            <button
              type="button"
              className="secondary-action"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6 rounded-xl bg-muted p-4 sm:p-5">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Music player
          </p>

          <h2 className="font-semibold">
            {current ? `Selected: ${current.title}` : 'No tracks available'}
          </h2>

          {current && (
            <p className="mt-1 text-sm text-muted-foreground">
              {current.artist}
            </p>
          )}

          <audio
            ref={audio}
            controls
            src={current?.url}
            preload="metadata"
            aria-label="Music player"
            className="mt-4 w-full"
            onError={() =>
              setError(
                'The audio file could not be loaded. Check that the file exists at its configured URL.'
              )
            }
            onEnded={playNextTrack}
          />
        </div>

        {downloadStatus && (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            {downloadStatus}
          </p>
        )}

        {error && (
          <p role="alert" className="error mt-4">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {filtered.map(track => {
          const isSaved = favourites.includes(track.id);
          const isSelected = current?.id === track.id;
          const isDownloading = downloadingId === track.id;

          return (
            <article
              key={track.id}
              className="tool-panel flex flex-col"
            >
              <p className="text-xs text-muted-foreground">
                {track.genre}
              </p>

              <h2 className="mt-2 text-lg font-semibold leading-snug">
                {track.title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {track.artist}
              </p>

              {isSelected && (
                <p className="mt-2 text-sm font-medium text-primary">
                  Selected in player
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="action"
                  aria-label={`Play ${track.title}`}
                  onClick={() => void playTrack(track)}
                >
                  Play
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  aria-pressed={isSaved}
                  aria-label={`${isSaved ? 'Unsave' : 'Save'} ${track.title}`}
                  onClick={() => toggleSaved(track.id)}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  disabled={downloadingId !== null}
                  aria-label={`Download ${track.title} audio`}
                  onClick={() => void downloadTrack(track)}
                >
                  {isDownloading ? 'Preparing…' : 'Download Audio'}
                </button>
              </div>

              <details className="mt-4">
                <summary className="min-h-11 cursor-pointer py-3 text-sm">
                  Usage rights
                </summary>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {track.licence}
                </p>
              </details>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="tool-panel mt-6 text-center">
          <p>No tracks match your filters.</p>

          <button
            type="button"
            className="secondary-action mt-4"
            onClick={resetFilters}
          >
            Show all tracks
          </button>
        </div>
      )}
    </ToolLayout>
  );
}