import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const version = String.raw`(\d+\.\d+\.\d+)`;

// Every place that names the adapter's current Rust toolchain, with the patterns
// that capture the version it names there. Two kinds of text are deliberately
// left out because they record the past: dated measurements and audits under
// docs/, and the `regenerate` command stored inside committed goldens (the NIR
// example and the plasticity session), which is part of their bytes.
const pinSites = {
  'crates/neuromorphic-adapter/Cargo.toml': [String.raw`rust-version = "${version}"`],
  'crates/neuromorphic-adapter/examples/stage_bench.rs': [String.raw`^//! cargo \+${version}`],
  'crates/neuromorphic-adapter/tests/nir_example.rs': [String.raw`^//! cargo \+${version}`],
  'crates/neuromorphic-adapter/tests/plasticity_session.rs': [String.raw`^//! cargo \+${version}`],
  'package.json': [String.raw`cargo \+${version}`],
  'scripts/build-neuromorphic-web.mjs': [String.raw`'\+${version}'`],
  'scripts/verify-browser-dependencies.mjs': [String.raw`'\+${version}'`],
  'scripts/verify-neuromorphic-browser.mjs': [String.raw`'\+${version}'`],
  'scripts/verify-neuromorphic-wasm.mjs': [String.raw`'\+${version}'`],
  'scripts/perf/run-wasi-stage-bench.mjs': [String.raw`--toolchain ${version}`, String.raw`cargo \+${version}`],
  '.github/workflows/quality.yml': [String.raw`Use Rust ${version}`, String.raw`# ${version} action revision`],
  'README.md': [String.raw`Rust ${version}`],
  'AGENTS.md': [String.raw`Rust \*\*${version}\*\*`, String.raw`cargo \+${version}`],
  '.agents/setup': [String.raw`Rust ${version}`, String.raw`rustup (?:toolchain install|default) ${version}`],
  '.coderabbit.yaml': [String.raw`rust-version = "${version}"`, String.raw`pins ${version}`],
  'docs/architecture/browser-runtime.md': [String.raw`^  cargo \+${version} test`],
  'docs/architecture/performance-budgets.md': [String.raw`^rustup target add wasm32-wasip1 --toolchain ${version}$`, String.raw`^cargo \+${version} build`],
  'docs/coverage-and-quality.md': [String.raw`with Rust ${version} \|`],
};

test('every Rust toolchain pin site names the crate rust-toolchain.toml channel', () => {
  const channel = read('crates/neuromorphic-adapter/rust-toolchain.toml').match(/^channel = "([^"]+)"$/m)?.[1];
  assert.match(channel ?? '', /^\d+\.\d+\.\d+$/, 'rust-toolchain.toml must pin an exact stable release');

  for (const [path, patterns] of Object.entries(pinSites)) {
    const source = read(path).replaceAll('\r\n', '\n');
    for (const pattern of patterns) {
      const found = [...source.matchAll(new RegExp(pattern, 'gm'))].map((match) => match[1]);
      assert.ok(found.length > 0, `${path} no longer matches ${pattern}`);
      for (const pinned of found) {
        assert.equal(pinned, channel, `${path} pins Rust ${pinned}, rust-toolchain.toml pins ${channel}`);
      }
    }
  }
});

test('both Quality workflow jobs use the same rust-toolchain action revision', () => {
  const workflow = read('.github/workflows/quality.yml');
  const revisions = [...workflow.matchAll(/dtolnay\/rust-toolchain@([0-9a-f]{40})/g)].map((match) => match[1]);
  assert.equal(revisions.length, 2);
  assert.equal(new Set(revisions).size, 1);
});
