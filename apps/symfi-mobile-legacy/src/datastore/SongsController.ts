import SongPlayListData, { SongPlayListDataConstructor } from '../classes/SongPlayListData';
import Controller from './Controller';
import { Store } from './Store';

export default class SongsController extends Controller {
  public static store = Store.songs;

  public static async addToPlayList(songID: string, playListID: string) {
    const options: SongPlayListDataConstructor = {
      flags: {
        isFavourite: false,
      },
      order: (await Store.playLists.findOneAsync({ id: playListID })).songsCount,
      playListID,
      songID,
    };
    await Store.songPlayLists.insertAsync(new SongPlayListData(options));

    await Store.playLists.updateAsync({ id: playListID }, { $inc: { songsCount: 1 } }, {});
    await Store.songs.updateAsync({ id: songID }, { $push: { 'musicly.playListsIDs': playListID } });
  }

  public static async removeFromPlayList(songID: string, playListID: string) {
    await Store.songPlayLists.removeAsync({ songID, playListID });
    await Store.songs.updateAsync({ id: songID }, { $pull: { 'musicly.playListsIDs': playListID } });
  }

  public static async updateCover(songID: string, uri?: string) {
    await Store.songs.update(
      { id: songID },
      {
        $set: {
          'musicly.cover.uri': uri,
          'musicly.flags.hasCover': !!uri,
        },
      },
      {},
    );
  }
}
