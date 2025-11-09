import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Musicly } from '../../types';

export default class ApiService {
  static remote = 'https://api-musicly.onrender.com';

  static readonly axios = axios.create({
    baseURL: ApiService.remote,
    timeout: 20000,
  });

  static async changeRemote(url: string) {
    if (url.endsWith('/')) url = url.slice(0, url.length - 1);

    ApiService.axios.defaults.baseURL = url;
    ApiService.remote = url;

    await AsyncStorage.setItem('@config--remote', url);
  }

  static async loadRemote() {
    const remote = await AsyncStorage.getItem('@config--remote');
    if (remote) await ApiService.changeRemote(remote);
  }

  static async searchSongs(query: string) {
    const response = await ApiService.axios<Musicly.Api.MediaInfo[]>({
      method: 'get',
      responseType: 'json',
      url: '/v2/search/youtube?query=' + encodeURI(query),
    });

    if (response.status !== 200) throw new Error(`response status: ${response.status.toString()}`);

    return response.data;
  }
}
