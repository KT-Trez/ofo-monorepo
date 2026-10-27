import { asc, desc, eq } from 'drizzle-orm';
import { keysAfter } from '../core/sort-key.ts';
import { artist } from '../schema/artist.entity.ts';
import { PlaylistSortMode, type PlaylistSortModes } from '../schema/playlist-local.constants.ts';
import { playlistLocal } from '../schema/playlist-local.entity.ts';
import { playlist, playlistTrack } from '../schema/playlist.entity.ts';
import { track } from '../schema/track.entity.ts';
import type { AtomicQuery } from '../types.ts';
import { Repository } from './base.repository.ts';

export interface PlaylistTracksDiff {
  readonly added: string[];
  readonly removed: string[];
}

export class PlaylistRepository extends Repository {
  async addTrack(uid: string, trackUid: string) {
    await this.client.runAtomic(await this.appendTracks(uid, [trackUid]));
  }

  async create(title: string) {
    const uid = this.client.genRandomUid();

    await this.client.runAtomic([
      this.client.db.insert(playlist).values({ title: title.trim(), uid }),
      this.client.db.insert(playlistLocal).values({ playlistUid: uid }),
    ]);

    return uid;
  }

  async delete(uid: string) {
    await this.client.runAtomic([this.client.db.delete(playlist).where(eq(playlist.uid, uid))]);
  }

  async markOpened(uid: string) {
    const lastOpenedAt = new Date();

    await this.client.runAtomic([
      this.client.db
        .insert(playlistLocal)
        .values({ lastOpenedAt, playlistUid: uid })
        .onConflictDoUpdate({ set: { lastOpenedAt }, target: playlistLocal.playlistUid }),
    ]);
  }

  async rename(uid: string, title: string) {
    await this.client.runAtomic([
      this.client.db.update(playlist).set({ title: title.trim() }).where(eq(playlist.uid, uid)),
    ]);
  }

  selectTracks(uid: string, sortMode: PlaylistSortModes) {
    const direction =
      sortMode === PlaylistSortMode.CustomDesc || sortMode === PlaylistSortMode.NameDesc
        ? desc
        : asc;

    const orderBy =
      sortMode === PlaylistSortMode.CustomAsc || sortMode === PlaylistSortMode.CustomDesc
        ? [direction(playlistTrack.sortKey), direction(playlistTrack.trackUid)]
        : [direction(track.title), asc(track.uid)];

    return this.client.db
      .select({
        artistName: artist.name,
        durationMs: track.durationMs,
        title: track.title,
        uid: track.uid,
      })
      .from(playlistTrack)
      .innerJoin(track, eq(track.uid, playlistTrack.trackUid))
      .leftJoin(artist, eq(artist.uid, track.artistUid))
      .where(eq(playlistTrack.playlistUid, uid))
      .orderBy(...orderBy);
  }

  async setSortMode(uid: string, sortMode: PlaylistSortModes) {
    await this.client.runAtomic([
      this.client.db
        .insert(playlistLocal)
        .values({ playlistUid: uid, sortMode })
        .onConflictDoUpdate({ set: { sortMode }, target: playlistLocal.playlistUid }),
    ]);
  }

  private async appendTracks(uid: string, trackUids: string[]): Promise<AtomicQuery[]> {
    const lastTrack = await this.client.db
      .select({ sortKey: playlistTrack.sortKey })
      .from(playlistTrack)
      .where(eq(playlistTrack.playlistUid, uid))
      .orderBy(desc(playlistTrack.sortKey), desc(playlistTrack.trackUid))
      .limit(1)
      .get();
    const keys = keysAfter(lastTrack?.sortKey ?? null, trackUids.length);

    return trackUids.map((trackUid, index) =>
      this.client.db
        .insert(playlistTrack)
        .values({ playlistUid: uid, sortKey: keys[index]!, trackUid })
        .onConflictDoNothing(),
    );
  }
}
