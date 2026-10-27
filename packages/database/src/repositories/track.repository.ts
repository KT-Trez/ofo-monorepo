import { and, eq, type SQL, sql } from 'drizzle-orm';
import { artist } from '../schema/artist.entity.ts';
import type { Sources } from '../schema/common.constants.ts';
import { DownloadStatus } from '../schema/track-local.constants.ts';
import { trackLocal } from '../schema/track-local.entity.ts';
import { track } from '../schema/track.entity.ts';
import type { AtomicQuery } from '../types.ts';
import { Repository } from './base.repository.ts';

export type AddTrackInput = {
  artist: { sourceId: string; name: string } | null;
  /** Put the track in the download queue right away. */
  download: boolean;
  durationMs?: number | null;
  releasedAt?: Date | null;
  source: Sources;
  sourceId: string;
  title: string;
};

export class TrackRepository extends Repository {
  async add(input: AddTrackInput) {
    const sourceId = input.sourceId.trim();
    const trackUid = await this.findUidBySource(input.source, input.sourceId);

    if (trackUid !== undefined) {
      return trackUid;
    }

    const queries: AtomicQuery[] = [];
    let artistUid: SQL | null = null;

    if (input.artist !== null) {
      const artistSourceId = input.artist.sourceId.trim();
      const artistName = input.artist.name.trim();

      queries.push(this.insertArtist(input.source, artistSourceId, artistName));
      artistUid = this.selectArtistUid(input.source, artistSourceId);
    }

    queries.push(
      this.client.db
        .insert(track)
        .values({
          artistUid,
          durationMs: input.durationMs ?? null,
          releasedAt: input.releasedAt ?? null,
          source: input.source,
          sourceId,
          title: input.title.trim(),
          uid: this.client.genRandomUid(),
        })
        .onConflictDoNothing(),

      this.client.db
        .insert(trackLocal)
        .values({
          queuedAt: input.download ? new Date() : null,
          status: input.download ? DownloadStatus.Queued : DownloadStatus.NotDownloaded,
          trackUid: this.selectTrackUid(input.source, sourceId),
        })
        .onConflictDoNothing(),
    );

    await this.client.runAtomic(queries);

    const uid = this.findUidBySource(input.source, sourceId);

    if (!uid) {
      throw new Error(`Failed to add track (${sourceId})`);
    }

    return uid;
  }

  async delete(uid: string) {
    await this.client.db
      .select({ filePath: trackLocal.filePath })
      .from(trackLocal)
      .where(eq(trackLocal.trackUid, uid))
      .get();

    await this.client.runAtomic([this.client.db.delete(track).where(eq(track.uid, uid))]);
  }

  private async findUidBySource(source: Sources, sourceId: string) {
    const row = await this.client.db
      .select({ uid: track.uid })
      .from(track)
      .where(and(eq(track.source, source), eq(track.sourceId, sourceId)))
      .get();

    return row?.uid;
  }

  private insertArtist(source: Sources, sourceId: string, name: string) {
    return this.client.db
      .insert(artist)
      .values({ name, source, sourceId, uid: this.client.genRandomUid() })
      .onConflictDoNothing();
  }

  /**
   * Reference a row by its natural key, not by uid read beforehand,
   * Needed to use when row is being inserted.
   */
  private selectArtistUid(source: Sources, sourceId: string): SQL {
    return sql`(SELECT ${artist.uid} FROM ${artist} WHERE ${artist.source} = ${source} AND ${artist.sourceId} = ${sourceId})`;
  }

  /**
   * Reference a row by its natural key, not by uid read beforehand,
   * Needed to use when row is being inserted.
   */
  private selectTrackUid(source: Sources, sourceId: string): SQL {
    return sql`(SELECT ${track.uid} FROM ${track} WHERE ${track.source} = ${source} AND ${track.sourceId} = ${sourceId})`;
  }
}
