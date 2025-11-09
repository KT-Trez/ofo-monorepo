import { Musicly } from '../../types';

export interface SongPlayListDataConstructor {
  flags: {
    isFavourite: boolean;
  };
  order: number;
  playListID: string;
  songID: string;
}

export default class SongPlayListData implements Musicly.Data.SongPlayList {
  public flags: { isFavourite: boolean };
  public order: number;
  public playListID: string;
  public songID: string;

  constructor(options: SongPlayListDataConstructor) {
    this.flags = {
      isFavourite: options.flags.isFavourite,
    };
    this.order = options.order;
    this.playListID = options.playListID;
    this.songID = options.songID;
  }
}
