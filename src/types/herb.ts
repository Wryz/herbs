export interface HerbImage {
  src: string;
  alt: string;
}

export interface Herb {
  slug: string;
  name: string;
  englishName: string;
  chineseName: string;
  category: string;
  temperature: string;
  tastes: string[];
  organs: string[];
  image: HerbImage;
}

export interface HerbsData {
  herbs: Herb[];
}

export interface FilterState {
  temperature: string | null;
  tastes: string[];
  organs: string[];
  search: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  temperature: null,
  tastes: [],
  organs: [],
  search: '',
};

export interface FilterOptions {
  temperatures: string[];
  tastes: string[];
  organs: string[];
}
