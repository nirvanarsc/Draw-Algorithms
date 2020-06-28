import axios from 'axios';

export default class AlgorithmsClient {
  private static client = axios.create({
    baseURL: '/api',
  });

  static async hello(): Promise<string> {
    return (await this.client.get('/test')).data;
  }
}
