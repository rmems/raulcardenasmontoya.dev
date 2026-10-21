export const site = {
  name: 'Ship of Theseus',
  fullName: 'Raul Cardenas Montoya',
  title: 'AI Engineer',
  description: 'Raul Cardenas Montoya — AI Engineer. AI/ML systems engineering across agentic systems, GPU compute, neuromorphic research, and reproducible software.',
  email: null,
  social: {
    github: 'https://github.com/rmems',
    linkedin: 'https://www.linkedin.com/in/raul-cardenas-montoya-8aa09839a',
    huggingface: 'https://huggingface.co/rmems',
    x: 'https://x.com/KeepOnSpiking',
    cratesio: 'https://crates.io/users/rmems',
    cursor: 'https://cursor.com/@hunkvsleon',
    instagram: 'https://instagram.com/raccooncity_resident',
    threads: 'https://threads.com/raccooncity_resident',
  },
  resumePath: null,
} as const;

export const navigation = [
  { href: '/work/', label: 'Work' },
  { href: '/evidence/', label: 'Evidence' },
  { href: '/labs/', label: 'Labs' },
  { href: '/about/', label: 'About' },
  { href: '/notes/', label: 'Notes' },
  ...(site.resumePath ? [{ href: '/resume/', label: 'Résumé' }] : []),
  { href: '/contact/', label: 'Contact' },
] as const;
