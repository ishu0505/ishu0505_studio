import { asset } from '../utils/asset';

export const profile = {
  name: 'Ishaan Parmar',
  role: 'Senior AI Engineer',
  lead: 'Productionizing GenAI and machine-learning systems for complex enterprise data.',
  location: 'Singapore',
  school: 'SMU Masters',
  status: 'Open to work',
  email: 'iparmar0505@gmail.com',
  avatar: asset('assets/images/my-pic.jpeg'),
  resume: {
    url: asset('assets/resume/Ishaan-parmar-resume.pdf'),
    filename: 'Ishaan-Parmar-Resume.pdf',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/ishaan-parmar5/',
    github: 'https://github.com/ishu0505',
    kaggle: 'https://www.kaggle.com/ishu0505',
    medium: 'https://medium.com/@ishu0505',
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSesiQtADdP225MrveX5eyB0oL8Sps3PPH6ktD1nzVnfWIhZsw/viewform',
  },
  current: {
    title: 'Senior AI Engineer @ FileAI',
    text: 'Series A startup transforming unstructured enterprise data with GenAI.',
  },
  focus: ['GenAI & LLMs', 'Agentic Workflows', 'Document Intelligence', 'ML Platforms & MLOps'],
  toolkit: ['Python', 'PyTorch', 'LangGraph', 'AWS', 'FastAPI', 'Terraform'],
  certificate: {
    title: 'DataCamp Data Scientist',
    url: 'https://www.datacamp.com/certificate/DSA0018025332713',
  },
  startup: {
    title: 'Founded an AI startup in 2023',
    text: 'Nexie (formerly StealthAI) — multimodal AI automation.',
  },
};
