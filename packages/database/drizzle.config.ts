import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  // also emits `drizzle/migrations.js`, which bundles the SQL files
  driver: 'expo',
  out: './drizzle',
  schema: [
    './src/schema/artist.entity.ts',
    './src/schema/playlist.entity.ts',
    './src/schema/playlist-local.entity.ts',
    './src/schema/track.entity.ts',
    './src/schema/track-local.entity.ts',
  ],
});
