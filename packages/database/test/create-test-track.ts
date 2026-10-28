import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { TrackRepository } from '../src/repositories/track.repository.ts';
import { Source } from '../src/schema/common.constants.ts';
import { trackLocal, type TrackLocalInsert } from '../src/schema/track-local.entity.ts';
import type { TrackInsert } from '../src/schema/track.entity.ts';
import type { DatabaseClient } from '../src/types.ts';

type CreateTestTrackArgs = {
  insert?: Partial<TrackInsert>;
  localInsert?: Partial<TrackLocalInsert>;
};

export const testTrackFactory = (client: DatabaseClient, repository: TrackRepository) => {
  return async ({ insert, localInsert }: CreateTestTrackArgs = {}) => {
    const trackId = await repository.add({
      artist: null,
      download: true,
      source: Source.YouTube,
      sourceId: randomUUID(),
      title: randomUUID(),
      ...insert,
    });

    if (localInsert) {
      await client.db.update(trackLocal).set(localInsert).where(eq(trackLocal.trackUid, trackId));
    }

    return trackId;
  };
};
