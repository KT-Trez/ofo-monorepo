import type { DatabaseClient } from '../types.ts';

export abstract class Repository {
  protected readonly client: DatabaseClient;

  constructor(client: DatabaseClient) {
    this.client = client;
  }
}
