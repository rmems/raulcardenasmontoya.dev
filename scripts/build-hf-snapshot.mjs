// Regenerates src/data/artifacts/hf-snapshot.json, the dated fallback used by the
// /artifacts/ page when the Hugging Face API is unreachable at build time.
//   node scripts/build-hf-snapshot.mjs
import { writeFileSync } from 'node:fs';
import { fetchHfSnapshot } from '../src/artifacts/hf-source.mjs';

const snapshot = await fetchHfSnapshot();
const target = new URL('../src/data/artifacts/hf-snapshot.json', import.meta.url);
writeFileSync(target, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`wrote ${snapshot.datasets.length} datasets and ${snapshot.models.length} models as of ${snapshot.asOf}`);
