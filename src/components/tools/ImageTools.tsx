import { useEffect, useState } from 'react';
import ToolLayout, { downloadBlob } from './ToolLayout';

type Output = { name: string; blob: Blob; original: number };
const sizes = (bytes: number) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  : `${(bytes / 1024).toFixed(2)} KB`;

async function exportImage(file: File, format: string, target: number | null) {
  const image = await createImageBitmap(file);
  try {
    if (image.width * image.height > 40000000) {
      throw new Error(`${file.name}: choose an image under 40 megapixels.`);
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser cannot process images.');
    async function encode(quality: number) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(value => value ? resolve(value) : reject(new Error('Image export failed.')), format, quality);
      });
      if (blob.type !== format) throw new Error('Your browser cannot export this format. Choose JPG or PNG.');
      return blob;
    }
    let scale = 1;
    for (let step = 0; step < 24; step++) {
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const high = await encode(.92);
      if (target === null || high.size <= target) return high;
      if (format !== 'image/png') {
        const low = await encode(.15);
        if (low.size <= target) {
          let best = low, left = .15, right = .92;
          for (let i = 0; i < 9; i++) {
            const mid = (left + right) / 2;
            const candidate = await encode(mid);
            if (candidate.size <= target) { best = candidate; left = mid; }
            else right = mid;
          }
          return best;
        }
      }
      if (canvas.width === 1 && canvas.height === 1) break;
      scale *= .8;
      // Give the browser a chance to paint progress and respond to input.
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    throw new Error(`${file.name}: target size could not be reached. Increase the maximum size or choose WebP/JPG.`);
  } finally { image.close(); }
}

export default function ImageTools() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState('compress');
  const [format, setFormat] = useState('image/webp');
  const [target, setTarget] = useState('200');
  const [unit, setUnit] = useState('KB');
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [source, setSource] = useState('');
  const [preview, setPreview] = useState('');
  useEffect(() => {
    const url = files[0] ? URL.createObjectURL(files[0]) : '';
    setSource(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [files]);
  useEffect(() => {
    const url = outputs[0] ? URL.createObjectURL(outputs[0].blob) : '';
    setPreview(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [outputs]);
  function reset() { setOutputs([]); setError(''); setProgress(''); }
  function choose(next: File[]) {
    reset();
    if (next.length > 20 || next.reduce((n, f) => n + f.size, 0) > 50 * 1024 * 1024 || next.some(f => f.size > 20 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(f.type))) {
      setFiles([]); setError('Choose up to 20 JPG, PNG or WebP files, 20 MB each and 50 MB total.'); return;
    }
    setFiles(next);
  }
  async function process() {
    reset(); setBusy(true);
    try {
      const maximum = mode === 'compress' ? Math.floor(Number(target) * (unit === 'MB' ? 1024 * 1024 : 1024)) : null;
      if (maximum !== null && (!Number.isFinite(maximum) || maximum < 1024 || maximum > 50 * 1024 * 1024)) {
        throw new Error('Enter a maximum size between 1 KB and 50 MB.');
      }
      const next: Output[] = [];
      for (const [i, file] of files.entries()) {
        setProgress(`Processing image ${i + 1} of ${files.length}…`);
        const blob = await exportImage(file, format, maximum);
        next.push({ name: `${i + 1}-${file.name.replace(/\.[^.]+$/, '')}-${mode === 'compress' ? 'compressed' : 'converted'}.${format === 'image/jpeg' ? 'jpg' : format.split('/')[1]}`, blob, original: file.size });
      }
      setOutputs(next); setProgress(`${next.length} image(s) ready. ${maximum !== null ? 'Each output meets your maximum size.' : ''}`);
    } catch (e) { setError((e as Error).message); setProgress(''); }
    finally { setBusy(false); }
  }
  async function downloadAll() {
    setBusy(true); setError('');
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip(); outputs.forEach(o => zip.file(o.name, o.blob));
      downloadBlob(await zip.generateAsync({ type: 'blob' }), 'processed-images.zip');
    } catch { setError('ZIP creation failed. Try downloading individually.'); }
    finally { setBusy(false); }
  }
  return <ToolLayout title="Image Converter & Compressor" group="Image Tools" description="Choose your maximum file size in KB or MB. Image processing stays in your browser.">
    <div className="tool-panel">
      <label htmlFor="image-file">1. Choose image(s) · Up to 20 JPG/PNG/WebP · 20 MB each, 50 MB total</label>
      <input id="image-file" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => choose(Array.from(e.target.files || []))} />
      <p className="text-sm text-muted-foreground">{files.length} image(s) selected. Preview shows the first image.</p>
      <fieldset disabled={busy} className="space-y-4">
        <legend className="mb-3 font-semibold">2. What would you like to do?</legend>
        <label htmlFor="image-mode">Action</label>
        <select id="image-mode" value={mode} onChange={e => { setMode(e.target.value); reset(); }}><option value="compress">Compress to a maximum file size</option><option value="convert">Convert format only</option></select>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label htmlFor="format">Output format</label><select id="format" value={format} onChange={e => { setFormat(e.target.value); reset(); }}><option value="image/webp">WebP · Recommended</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></div>
          {mode === 'compress' && <><div><label htmlFor="target-size">Maximum file size</label><input id="target-size" type="number" min={unit === 'MB' ? .001 : 1} step="any" value={target} onChange={e => { setTarget(e.target.value); reset(); }} aria-describedby="size-help" /></div><div><label htmlFor="size-unit">Unit</label><select id="size-unit" value={unit} onChange={e => { setUnit(e.target.value); reset(); }}><option>KB</option><option>MB</option></select></div></>}
        </div>
        <p id="size-help" className="text-sm text-muted-foreground">{mode === 'compress' ? 'The maximum applies to each image. Quality and dimensions adjust automatically while keeping proportions. Smaller targets can reduce detail. PNG compression adjusts dimensions because PNG is lossless.' : 'Converts the format without a target size. Output size may increase.'} JPG fills transparent areas with white.</p>
      </fieldset>
      <button className="action" disabled={busy || !files.length} onClick={() => void process()}>{busy ? 'Processing…' : mode === 'compress' ? 'Compress Image' : 'Convert Image'}</button>
      <p role="status">{progress}</p>{error && <p role="alert" className="error">{error}</p>}
    </div>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {source && <figure className="tool-panel"><figcaption>Original · {sizes(files[0].size)}</figcaption><img src={source} alt="Original image" className="max-h-80 w-full object-contain" /></figure>}
      {preview && outputs[0] && <figure className="tool-panel"><figcaption>Result · {sizes(outputs[0].blob.size)}</figcaption><img src={preview} alt="Processed image preview" className="checkerboard max-h-80 w-full object-contain" /><button className="action" onClick={() => downloadBlob(outputs[0].blob, outputs[0].name)}>Download Image</button></figure>}
    </div>
    {outputs.length > 1 && <section className="tool-panel mt-6"><h2 className="text-lg font-semibold">Batch results</h2><ul>{outputs.map(o => <li key={o.name} className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3"><span className="min-w-0 break-all text-sm">{o.name}<br />{sizes(o.original)} → {sizes(o.blob.size)}</span><button className="secondary-action" onClick={() => downloadBlob(o.blob, o.name)}>Download</button></li>)}</ul><button className="action" disabled={busy} onClick={() => void downloadAll()}>Download All as ZIP</button></section>}
  </ToolLayout>;
}
