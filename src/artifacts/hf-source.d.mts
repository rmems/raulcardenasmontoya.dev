export const HF_OWNER: string;
export const EXCLUDED_DATASETS: Record<string, string>;
export const STATUS_LABELS: Record<string, string>;
export interface HfRepoRecord { id: string; dataFiles: number; status?: string[] }
export interface HfSnapshot { asOf: string; source: string; datasets: HfRepoRecord[]; models: HfRepoRecord[] }
export function classifyCardStatus(readme: string): string[];
export function countDataFiles(filenames: string[]): number;
export function listableRepos<T extends { id: string; dataFiles: number }>(repos: T[]): T[];
export function fetchHfSnapshot(options?: { fetchImpl?: typeof fetch; now?: Date }): Promise<HfSnapshot>;
