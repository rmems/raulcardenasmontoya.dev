// Regenerates public/assets/social-card.png (1200x630) from the shared profile photo
// on the site's light palette. Run: node scripts/build-social-card.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require_from = () => new URL('../node_modules/astro/package.json', import.meta.url);

const require = createRequire(require_from());
const sharp = require('sharp'); // installed transitively by astro

const W = 1200;
const H = 630;
const D = 360; // photo diameter
const photoPath = new URL('../public/assets/raul-cardenas-montoya-512.jpg', import.meta.url);
const outPath = new URL('../public/assets/social-card.png', import.meta.url);

const backdrop = await sharp({ create: { width: W, height: H, channels: 3, background: '#f7f8fa' } }).png().toBuffer();

const photo = await sharp(await readFile(photoPath))
  .resize(D, D)
  .composite([{ input: Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}"/></svg>`), blend: 'dest-in' }])
  .png()
  .toBuffer();

const px = 90;
const py = (H - D) / 2;
const ring = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${px + D / 2}" cy="${py + D / 2}" r="${D / 2 + 8}" fill="none" stroke="#4f46e5" stroke-width="4"/>
  <g font-family="Segoe UI, Helvetica, Arial, sans-serif" fill="#0f172a">
    <text x="530" y="285" font-size="68" font-weight="700">Raul Cardenas</text>
    <text x="530" y="365" font-size="68" font-weight="700">Montoya</text>
    <text x="532" y="430" font-size="34" fill="#4f46e5">AI/ML systems engineer</text>
    <text x="532" y="490" font-size="26" fill="#5b6474">raulcardenasmontoya.me</text>
  </g>
  <circle cx="${px + D - 40}" cy="${py + 40}" r="18" fill="#f43f5e" stroke="#f7f8fa" stroke-width="6"/>
</svg>`;

const png = await sharp(backdrop)
  .composite([{ input: Buffer.from(ring) }, { input: photo, left: px, top: py }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
await writeFile(outPath, png);
console.log(`wrote social-card.png ${W}x${H} (${png.length} bytes)`);
