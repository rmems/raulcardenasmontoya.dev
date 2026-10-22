import snapshot from '../data/artifacts/hf-snapshot.json';
import { fetchHfSnapshot, listableRepos, STATUS_LABELS } from './hf-source.mjs';
import type { HfSnapshot } from './hf-source.mjs';

export interface PublishedRepo {
  id: string;
  url: string;
  /** The card's own status labels; empty when the card states none. */
  statusLabels: string[];
}

export interface HfArtifacts {
  asOf: string;
  /** `live` when the Hugging Face API answered at build time, else the committed snapshot. */
  source: 'live' | 'snapshot';
  /** Why the snapshot was used, when it was. */
  fallbackReason?: 'skipped' | 'unreachable';
  datasets: PublishedRepo[];
  models: PublishedRepo[];
}

export function toArtifacts(data: HfSnapshot, source: HfArtifacts['source'], fallbackReason?: HfArtifacts['fallbackReason']): HfArtifacts {
  return {
    asOf: data.asOf,
    source,
    fallbackReason,
    datasets: listableRepos(data.datasets).map((repo) => ({
      id: repo.id,
      url: `https://huggingface.co/datasets/${repo.id}`,
      statusLabels: (repo.status ?? []).map((flag) => STATUS_LABELS[flag] ?? flag),
    })),
    models: listableRepos(data.models).map((repo) => ({ id: repo.id, url: `https://huggingface.co/${repo.id}`, statusLabels: [] })),
  };
}

/** Live HF data at build time; the dated snapshot when it is unreachable or SKIP_HF_FETCH is set. */
export async function loadHfArtifacts(): Promise<HfArtifacts> {
  let fallbackReason: HfArtifacts['fallbackReason'] = 'skipped';
  if (!process.env.SKIP_HF_FETCH) {
    fallbackReason = 'unreachable';
    try {
      return toArtifacts(await fetchHfSnapshot(), 'live');
    } catch (error) {
      console.warn(`[artifacts] Hugging Face API unavailable, using the ${snapshot.asOf} snapshot: ${String(error)}`);
    }
  }
  return toArtifacts(snapshot as HfSnapshot, 'snapshot', fallbackReason);
}
