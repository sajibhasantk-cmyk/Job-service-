import { Job } from '../types';

const STORAGE_KEY = 'job_service_db_v2';

// Initial dummy data
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechFlow Solutions',
    location: 'Dhaka, Bangladesh (Remote)',
    salary: '150,000 - 200,000 BDT',
    description: 'We are looking for an experienced React developer to lead our frontend team. Must know TypeScript and Tailwind.',
    postedAt: new Date().toISOString(),
    type: 'Full-time',
    category: 'IT & Software'
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Creative Hub',
    location: 'Chittagong, Bangladesh',
    salary: '80,000 - 120,000 BDT',
    description: 'Design beautiful interfaces for mobile and web apps. Experience with Figma is required.',
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'Full-time',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Marketing Manager',
    company: 'Growth Hackers BD',
    location: 'Sylhet, Bangladesh',
    salary: '60,000 - 90,000 BDT',
    description: 'Looking for a digital marketing expert to handle social media campaigns and SEO strategies.',
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    type: 'Contract',
    category: 'Marketing'
  }
];

export const getJobs = (): Job[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
  return JSON.parse(stored);
};

export const addJob = (job: Job): Job[] => {
  const currentJobs = getJobs();
  const newJobs = [job, ...currentJobs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
  return newJobs;
};

export const deleteJob = (id: string): Job[] => {
  const currentJobs = getJobs();
  const newJobs = currentJobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
  return newJobs;
};