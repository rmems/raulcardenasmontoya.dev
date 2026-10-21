// Regenerates public/assets/social-card.png (1200x630) from the shared profile photo
// and the site's existing dark line-art backdrop. Run: node scripts/build-social-card.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require_from = () => new URL('../node_modules/astro/package.json', import.meta.url);

const require = createRequire(require_from());
const sharp = require('sharp'); // installed transitively by astro

const W = 1200;
const H = 630;
const D = 360; // photo diameter
const photoPath = new URL('../public/assets/raul-cardenas-montoya.jpg', import.meta.url);
const outPath = new URL('../public/assets/social-card.png', import.meta.url);
const backdropPath = new URL('./assets/social-card-backdrop.png', import.meta.url);

const backdrop = await sharp(await readFile(backdropPath)).resize(W, H, { fit: 'cover' }).modulate({ brightness: 0.8 }).toBuffer();

const photo = await sharp(await readFile(photoPath))
  .resize(D, D)
  .composite([{ input: Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}"/></svg>`), blend: 'dest-in' }])
  .png()
  .toBuffer();

const px = 90;
const py = (H - D) / 2;
const ring = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${px + D / 2}" cy="${py + D / 2}" r="${D / 2 + 8}" fill="none" stroke="#d98f62" stroke-width="4"/>
  <g font-family="Segoe UI, Helvetica, Arial, sans-serif" fill="#f1f0e9">
    <text x="530" y="285" font-size="68" font-weight="700">Raul Cardenas</text>
    <text x="530" y="365" font-size="68" font-weight="700">Montoya</text>
    <text x="532" y="430" font-size="34" fill="#d98f62">AI/ML systems engineer</text>
    <text x="532" y="490" font-size="26" fill="#a9a79c">raulcardenasmontoya.me</text>
  </g>
</svg>`;

const png = await sharp(backdrop)
  .composite([{ input: Buffer.from(ring) }, { input: photo, left: px, top: py }])
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(outPath, png);
console.log(`wrote social-card.png ${W}x${H} (${png.length} bytes)`);
