export function musicArtwork(track: { id: number; title: string; artist: string }): string {
  const hue = Math.abs(track.id * 137) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="hsl(${hue},35%,16%)"/><circle cx="520" cy="80" r="160" fill="hsl(${hue},45%,30%)"/><circle cx="520" cy="80" r="90" fill="none" stroke="hsl(${hue},55%,65%)" stroke-width="2"/><path d="M72 80v80m14-110v140m14-90v40m14-65v90m14-55v20" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
