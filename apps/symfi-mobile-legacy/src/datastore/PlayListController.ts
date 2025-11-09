import Controller from './Controller';
import { Store } from './Store';

export default class PlayListController extends Controller {
  public static store = Store.playLists;

  public static async decreaseSongsCount(playListsIDs: string[]) {
    for (const playListID of playListsIDs) {
      await this.store.updateAsync(
        { id: playListID },
        {
          $inc: {
            songsCount: -1,
          },
        },
        {},
      );
    }
  }

  public static async updateCover(playListID: string, uri?: string) {
    await this.store.updateAsync(
      { id: playListID },
      {
        $set: {
          'cover.uri': uri,
          'flags.hasCover': !!uri,
        },
      },
      {},
    );
  }
}
