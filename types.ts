
export enum View {
  INTRODUCTION = 'INTRODUCTION',
  DORKING = 'DORKING',
  ANALYSIS = 'ANALYSIS',
}

export interface DorkItem {
  type: 'google' | 'shodan' | 'cloud' | 'file';
  query: string;
  description: string;
  category?: string;
}

export interface BatchDorkResult {
  keyword: string;
  timestamp: string;
  categories: {
    [key: string]: DorkItem[];
  };
}
