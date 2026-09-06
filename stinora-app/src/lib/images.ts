/**
 * Locally generated imagery.
 *
 * Every salon photo used to come from picsum.photos and the welcome hero from
 * unsplash.com. Both are unreachable from the packaged Android app, from a phone
 * with no signal, and from any network that blocks them — and when they fail the
 * cards render as empty grey boxes with no fallback. These generators produce
 * deterministic SVG data URIs instead, so the app draws identically offline.
 *
 * They are intentionally abstract (the design already renders salon imagery
 * grayscale and luminosity-blended) rather than pretending to be photographs.
 */

function hashOf(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function svgUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * An abstract "studio interior": layered arcs and mirror shapes over a warm
 * gradient, deterministic per seed so a given salon always looks the same.
 */
export function salonImage(seed: string, size = 800): string {
  const h = hashOf(seed);
  const hue = h % 360;
  const hue2 = (hue + 35) % 360;
  const bars = 5 + (h % 4);
  const arc = 30 + (h % 40);

  const mirrors = Array.from({ length: bars }, (_, i) => {
    const x = 40 + i * ((size - 120) / bars);
    const w = (size - 160) / bars / 1.7;
    const y = 120 + ((h >> (i + 1)) % 90);
    const hgt = size - y - 150;
    return `<rect x="${x.toFixed(0)}" y="${y}" width="${w.toFixed(0)}" height="${hgt}" rx="${w / 2}" fill="rgba(255,255,255,0.14)" />`;
  }).join('');

  return svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue}, 24%, 34%)"/>
      <stop offset="100%" stop-color="hsl(${hue2}, 30%, 16%)"/>
    </linearGradient>
    <radialGradient id="lamp" cx="50%" cy="18%" r="55%">
      <stop offset="0%" stop-color="rgba(255,238,214,0.45)"/>
      <stop offset="100%" stop-color="rgba(255,238,214,0)"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" fill="url(#lamp)"/>
  ${mirrors}
  <path d="M0 ${size - 150} Q ${size / 2} ${size - 150 - arc * 3} ${size} ${size - 150} L ${size} ${size} L 0 ${size} Z" fill="rgba(0,0,0,0.28)"/>
  <circle cx="${size / 2}" cy="${arc + 40}" r="${arc}" fill="rgba(255,255,255,0.1)"/>
</svg>`);
}

/** The welcome screen's full-bleed backdrop. */
export function heroImage(size = 1000): string {
  return svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.4)}" viewBox="0 0 ${size} ${Math.round(size * 1.4)}">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#2A2724"/>
      <stop offset="100%" stop-color="#0C0B0A"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="22%" r="60%">
      <stop offset="0%" stop-color="rgba(84,82,255,0.30)"/>
      <stop offset="100%" stop-color="rgba(84,82,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#h)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  ${Array.from({ length: 7 }, (_, i) =>
    `<rect x="${70 + i * 130}" y="${300 + (i % 3) * 90}" width="66" height="${520 - (i % 3) * 60}" rx="33" fill="rgba(255,255,255,0.05)"/>`
  ).join('')}
</svg>`);
}
