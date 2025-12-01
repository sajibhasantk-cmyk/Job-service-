export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  postedAt: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  category: string;
}

export enum AdType {
  BANNER = 'BANNER',
  INTERSTITIAL = 'INTERSTITIAL',
  REWARDED = 'REWARDED',
  APP_OPEN = 'APP_OPEN'
}

export const ADMOB_IDS = {
  // IDs provided by user
  BANNER: 'ca-app-pub-5278345254129535/2929690326',
  INTERSTITIAL: 'ca-app-pub-5278345254129535/5887149869',
  REWARDED: 'ca-app-pub-5278345254129535/3630304575',
  APP_OPEN: 'ca-app-pub-5278345254129535/7377977894'
};

export const JOB_CATEGORIES = [
  'All',
  'IT & Software',
  'Marketing',
  'Design',
  'Sales',
  'Management',
  'Engineering'
];