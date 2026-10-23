import { createDatabaseClient } from '@ofo/database/expo';
import { openDatabaseSync } from 'expo-sqlite';

const database = openDatabaseSync('ofo.db', { enableChangeListener: true });
export const databaseClient = createDatabaseClient(database);
