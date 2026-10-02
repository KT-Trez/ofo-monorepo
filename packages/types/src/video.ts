import type { AuthorApi } from './author.ts';

export type VideoApi = {
  author: AuthorApi;
  duration: number;
  id: string;
  thumbnailUrl: string | null;
  title: string;
  views: number | null;
};
