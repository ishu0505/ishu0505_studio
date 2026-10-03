import { asset } from '../utils/asset';

export const articles = [
  {
    id: 'uganda-gender-gap',
    title: 'Gender Disparities in Digital Financial Access in Uganda',
    category: 'Explanatory Analysis',
    date: 'Nov 15, 2024',
    summary:
      'A detailed analysis using statistical and machine-learning techniques to explain the gender gap in digital financial access.',
    image: asset('assets/images/Data-analytcis-project.png'),
    href: 'https://medium.com/@ishu0505/explanatory-analysis-of-gender-disparities-in-digital-financial-access-in-uganda-4f31f877e0e9',
    tone: 'pink',
  },
];

export const writingLinks = [
  { id: 'report', label: 'Report', title: 'Read the full PDF ↗', href: asset('assets/uganda-report.pdf'), tone: 'white' },
  { id: 'medium', label: 'Medium', title: 'More articles ↗', href: 'https://medium.com/@ishu0505', tone: 'yellow' },
];
