import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  classifyCardStatus,
  countDataFiles,
  EXCLUDED_DATASETS,
  fetchHfSnapshot,
  listableRepos,
} from '../src/artifacts/hf-source.mjs';

const json = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const snapshot = json('src/data/artifacts/hf-snapshot.json');
const upstream = json('src/data/artifacts/upstream-prs.json');

test('card status flags come from the card text', () => {
  const legacy = '> **Rights:** legacy **research corpus**. Not\n> training data.\n> **Release status:** The raw, uncurated payload is published.';
  assert.deepEqual(classifyCardStatus(legacy), ['research-only', 'raw-uncurated', 'not-training-data']);
  assert.deepEqual(classifyCardStatus('release_stage: raw_uncurated_public, training_ready: false'), ['raw-uncurated', 'not-training-data']);
  assert.deepEqual(classifyCardStatus('Deterministic records, replay-gated.'), []);
});

test('personal-research wording on the Grok-1 cards gets its own label, not research-only', () => {
  assert.deepEqual(classifyCardStatus('# Grok-1 structural parse artifacts (personal research) **Personal research tooling output** — not a product release'),['personal-research']);
});

test('a missing card is an empty status, and a paginated listing is refused', async () => {
  const json = (body, headers = {}) => ({ ok: true, status: 200, headers: new globalThis.Headers(headers), json: async () => body });
  const fetchImpl = async (url) => {
    if (url.includes('/api/datasets?')) return json([{ id: 'rmems/nocard' }]);
    if (url.includes('/api/models?')) return json([]);
    if (url.includes('/api/datasets/')) return json({ siblings: [{ rfilename: 'data.jsonl' }] });
    return { ok: false, status: 404, headers: new globalThis.Headers() };
  };
  const result = await fetchHfSnapshot({ fetchImpl });
  assert.deepEqual(result.datasets, [{ id: 'rmems/nocard', dataFiles: 1, status: [] }]);
  await assert.rejects(fetchHfSnapshot({ fetchImpl: async () => json([], { link: '<https://huggingface.co/next>; rel="next"' }) }), /paginated/);
});

test('card-only and excluded repos are never listed', () => {
  assert.equal(countDataFiles(['README.md', '.gitattributes']), 0);
  assert.equal(countDataFiles(['README.md', 'data/train.jsonl']), 1);
  const listed = listableRepos([
    { id: 'rmems/real', dataFiles: 3 },
    { id: 'rmems/card-only', dataFiles: 0 },
    { id: 'rmems/agent-honest-stop-episodes', dataFiles: 9 },
  ]);
  assert.deepEqual(listed.map((repo) => repo.id), ['rmems/real']);
  assert.ok('rmems/agent-honest-stop-episodes' in EXCLUDED_DATASETS);
});

test('the committed snapshot is dated and lists no card-only or excluded dataset', () => {
  assert.match(snapshot.asOf, /^\d{4}-\d{2}-\d{2}$/);
  const listed = listableRepos(snapshot.datasets);
  assert.ok(listed.length > 0);
  for (const repo of listed) {
    assert.ok(repo.dataFiles > 0, `${repo.id} holds no data`);
    assert.notEqual(repo.id, 'rmems/agent-honest-stop-episodes');
  }
});

test('a failing Hugging Face API rejects so the loader falls back to the snapshot', async () => {
  await assert.rejects(fetchHfSnapshot({ fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
});

test('every upstream PR is recorded as merged with a diff size and links to its pull request', () => {
  assert.match(upstream.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(upstream.pullRequests.length > 0);
  for (const pr of upstream.pullRequests) {
    assert.match(pr.mergedAt, /^\d{4}-\d{2}-\d{2}$/, `${pr.repo}#${pr.number} is not merged`);
    assert.ok(Number.isInteger(pr.additions) && Number.isInteger(pr.deletions) && pr.additions >= 0 && pr.deletions >= 0 && pr.changedFiles >= 0);
    assert.doesNotMatch(pr.repo, /JuliaRegistries/i);
  }
  const page = read('src/pages/artifacts.astro');
  assert.match(read('src/artifacts/upstream.ts'), /https:\/\/github\.com\/\$\{pr\.repo\}\/pull\/\$\{pr\.number\}/);
  assert.match(page, /as of \{hf\.asOf\}/i);
  assert.match(page, /verified \{upstreamVerifiedAt\}/);
});

test('Artifacts is in the primary navigation and the page exists', () => {
  assert.match(read('src/data/site.ts'), /href: '\/artifacts\/', label: 'Artifacts'/);
});
