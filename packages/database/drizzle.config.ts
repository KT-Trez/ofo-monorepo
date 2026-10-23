import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  // also emits `drizzle/migrations.js`, which bundles the SQL files
  driver: 'expo',
  out: './drizzle',
  schema: ['./src/schema/artist.ts', './src/schema/playlist.ts', './src/schema/track.ts'],
});
