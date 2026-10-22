import data from '../data/artifacts/upstream-prs.json';

export interface UpstreamPr {
  repo: string;
  number: number;
  title: string;
  mergedAt: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export const upstreamPrs: UpstreamPr[] = data.pullRequests;
export const upstreamVerifiedAt: string = data.verifiedAt;

export const prUrl = (pr: UpstreamPr): string => `https://github.com/${pr.repo}/pull/${pr.number}`;
