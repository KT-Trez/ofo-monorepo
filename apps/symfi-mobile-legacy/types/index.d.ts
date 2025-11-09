export declare module Musicly {
  export module Api {
    export interface MediaInfo {
      channel: {
        id: string;
        name: string;
        url: string;
      };
      description: string;
      id: string;
      metadata: {
        duration: {
          label: string;
          seconds: number;
        };
        published: string;
        thumbnails: Thumbnail[];
        views: {
          count: number;
          label: string;
        };
      };
      title: string;
    }

    export interface Thumbnail {
      height: number;
      url: string;
      width: number;
    }
  }

  export module Data {
    export interface Song extends SongInfo {
      musicly: SongMusicly;
    }

    export interface SongInfo {
      channel: {
        id: string;
        name: string;
        url: string;
      };
      description: string;
      id: string;
      metadata: {
        badges: string[];
        duration: {
          accessibility_label: string;
          seconds: number;
          simple_text: string;
        };
        owner_badges: string[];
        published: string;
        short_view_count_text: {
          accessibility_label: string;
          simple_text: string;
        };
        thumbnails: {
          height: number;
          url: string;
          width: number;
        }[];
        view_count: string;
      };
      title: string;
      url: string;
    }

    export interface SongMusicly {
      cover: {
        color: string;
        name: string;
        uri: string | undefined;
      };
      file: {
        downloadDate: Date;
        id: string | undefined;
        path: string | undefined;
        size: number | undefined;
      };
      flags: {
        hasCover: boolean;
        isDownloaded: boolean;
        isFavourite: boolean;
      };
      playList?: SongPlayList;
      playListsIDs: string[];
      version: number;
      wasPlayed: number;
    }

    export interface SongPlayList {
      flags: {
        isFavourite: boolean;
      };
      order: number;
      playListID: string;
      songID: string;
    }
  }
}
