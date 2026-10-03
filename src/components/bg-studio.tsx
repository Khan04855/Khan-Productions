import { useEffect, useState } from 'react';
import ToolLayout from './tools/ToolLayout';
import { downloadBlob } from '@/lib/tool-utils';

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const url = file ? URL.createObjectURL(file) : '';
    setSource(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [file]);
  useEffect(() => {
    const url = output ? URL.createObjectURL(output) : '';
    setResult(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [output]);

  async function choose(next?: File) {
    setFile(null); setOutput(null); setError(''); setProgress('');
    if (!next) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type) || next.size > 10 * 1024 * 1024) {
      setError('Choose a JPG, PNG or WebP image under 10 MB.'); return;
    }
    try {
      const image = await createImageBitmap(next);
      const pixels = image.width * image.height;
      image.close();
      if (pixels > 16000000) throw new Error('Choose an image under 16 megapixels for browser processing.');
      setFile(next);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not read this image.'); }
  }

  async function remove() {
    if (!file || busy) return;
    setBusy(true); setOutput(null); setError('');
    setProgress('Preparing the background removal model…');
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file, {
        model: 'isnet_quint8', device: 'cpu', proxyToWorker: false,
        publicPath: new URL('/background-model/', location.origin).href,
        output: { format: 'image/png', quality: 1 },
        progress: (key, current, total) => {
          setProgress(key.startsWith('fetch:')
            ? `Loading model resources: ${total ? Math.round(current / total * 100) : 0}% · First use can take longer.`
            : 'Removing the background on your device…');
        },
      });
      if (!blob.size) throw new Error('No image was produced. Try another image.');
      setOutput(blob); setProgress('Your transparent PNG is ready.');
    } catch (err) {
      console.error('Background removal failed', err);
      setProgress('');
      setError('Background removal could not finish. Check your connection for the initial model load, try a smaller image, and use a current Chrome or Edge browser.');
    } finally { setBusy(false); }
  }

  return <ToolLayout title="Background Remover" group="Image Tools" description="Remove backgrounds on your device and download a transparent PNG. No API key is needed; your image stays in your browser.">
    <div className="tool-panel" aria-busy={busy}>
      <label htmlFor="bg-file">1. Choose an image · JPG, PNG or WebP · Maximum 10 MB</label>
      <input id="bg-file" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => void choose(e.target.files?.[0])} />
      <p className="text-sm text-muted-foreground">The model loads on first use. Speed depends on your device. Use a clear subject; fine hair and transparent objects may need further editing.</p>
      <button className="action" disabled={!file || busy} onClick={() => void remove()}>{busy ? 'Removing background…' : '2. Remove Background'}</button>
      <p role="status">{progress}</p>
      {error && <p role="alert" className="error">{error}</p>}
    </div>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {source && <figure className="tool-panel"><figcaption>Original</figcaption><img src={source} alt="Uploaded original" className="max-h-96 w-full object-contain" /></figure>}
      {result && output && <figure className="tool-panel"><figcaption>Background removed</figcaption><img src={result} alt="Result with transparent background" className="checkerboard max-h-96 w-full object-contain" /><button className="action" onClick={() => downloadBlob(output, `${file?.name.replace(/\.[^.]+$/, '') || 'image'}-background-removed.png`)}>3. Download PNG</button></figure>}
    </div>
    <p className="mt-6 text-xs text-muted-foreground">Background removal uses IMG.LY (AGPL). <a className="underline" href="https://github.com/Khan04855/Khan-Productions" target="_blank" rel="noopener noreferrer">Project source</a> · <a className="underline" href="https://github.com/imgly/background-removal-js" target="_blank" rel="noopener noreferrer">Library source</a></p>
  </ToolLayout>;
}
