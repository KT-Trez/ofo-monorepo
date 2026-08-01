import type { AuthorApi } from './author.js';

export type VideoApi = {
  author: AuthorApi;
  duration: number;
  id: string;
  thumbnailUrl: string | null;
  title: string;
  views: number | null;
};
