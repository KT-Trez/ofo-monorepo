import DataStore, { Query } from 'react-native-local-mongodb';

export default abstract class Controller {
  protected static store: DataStore;

  public static async countAsync(query: Query) {
    return new Promise<number>((resolve, reject) => {
      this.store.count(query, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  }
}
