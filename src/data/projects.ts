export type ProjectStatus = 'Active research' | 'In development' | 'Exploration';
export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
  category: string;
  technologies: string[];
  summary: string;
  questions: string[];
  links: { label: string; href: string }[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    name: 'Ship of Theseus Workstation',
    slug: 'ship-of-theseus-workstation',
    status: 'Active research',
    category: 'Research infrastructure',
    technologies: ['Linux', 'GPU compute', 'Self-hosting', 'Reproducible systems'],
    summary: 'An AI/HPC research node and self-hosted engineering environment designed for hands-on systems work, experiments, and durable local workflows.',
    questions: [
      'How can a local research environment make experiments easier to inspect and repeat?',
      'Which parts of the system should be reproducible rather than dependent on workstation state?',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/rmems/Ship-of-Theseus-Workstation' }],
    featured: true,
  },
  {
    name: 'engram-parser',
    slug: 'engram-parser',
    status: 'In development',
    category: 'Model tooling',
    technologies: ['Rust', 'GGUF', 'Safetensors', 'Checkpoint formats'],
    summary: 'A pure-Rust checkpoint and tensor substrate for GGUF and Safetensors, with one format-independent API for tensor inventory, metadata and raw payload access.',
    questions: [
      'How much of a checkpoint can callers read without branching on the container format?',
      'Which format-specific surfaces, such as K-quant dequantization or mmap reads, belong behind features?',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/rmems/engram-parser' }],
    featured: true,
  },
  {
    name: 'nir-rs',
    slug: 'nir-rs',
    status: 'In development',
    category: 'Neuromorphic tooling',
    technologies: ['Rust', 'NIR', 'HDF5', 'Spiking neural networks'],
    summary: 'A pure-Rust implementation of the Neuromorphic Intermediate Representation: typed NIR graphs with opt-in HDF5 read and write that follows the official Python wire format.',
    questions: [
      'How closely can a Rust graph model track the reference implementation on the wire?',
      'Which dependencies, such as native HDF5, should stay opt-in?',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/Limen-Neural/nir-rs' }],
    featured: true,
  },
  {
    name: 'agoge-forger',
    slug: 'agoge-forger',
    status: 'In development',
    category: 'Post-training research',
    technologies: ['Python', 'PyTorch', 'TRL', 'PEFT'],
    summary: 'A post-training research platform for reproducible SFT, evaluation, checkpoints and experiment manifests. In the recorded run, SFT taught fence formatting: fence-normalized 10/16 before and after.',
    questions: [
      'What does a run need to record to be reproduced from its manifest?',
      'Which evaluation changes reflect formatting rather than capability?',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/rmems/agoge-forger' }],
    featured: true,
  },
  {
    name: 'Synthetic Factory',
    slug: 'synthetic-factory',
    status: 'In development',
    category: 'Data systems',
    technologies: ['Python', 'Deterministic pipelines', 'Provenance', 'Validation'],
    summary: 'Deterministic infrastructure for building provenance-focused synthetic engineering data, with an emphasis on executable sources and inspectable generation paths.',
    questions: [
      'How can generated engineering data retain a clear path back to executable sources?',
      'What validation makes a deterministic pipeline easier to inspect and revise?',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/rmems/synthetic-factory' }],
    featured: true,
  },
  {
    name: 'Grok-1/SAAQ research',
    slug: 'grok-1-saaq-research',
    status: 'Exploration',
    category: 'Research exploration',
    technologies: ['Quantization', 'Neuromorphic computing', 'Research engineering'],
    summary: 'An ongoing exploration of quantization and neuromorphic, brain-inspired systems through careful research and prototype-oriented engineering.',
    questions: [
      'Where do quantization and brain-inspired architectures create useful research questions?',
      'How can prototype-oriented engineering keep exploratory work legible?',
    ],
    links: [],
    featured: false,
  },
];
