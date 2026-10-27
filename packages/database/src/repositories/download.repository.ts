import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { DownloadErrorCode, DownloadStatus } from '../schema/track-local.constants.ts';
import { trackLocal } from '../schema/track-local.entity.ts';
import { track } from '../schema/track.entity.ts';
import { Repository } from './base.repository.ts';

export class DownloadRepository extends Repository {
  async enqueue(trackUids: string[]) {
    await this.client.runAtomic([
      this.client.db
        .update(trackLocal)
        .set({ errorCode: null, queuedAt: new Date(), status: DownloadStatus.Queued })
        .where(
          and(
            inArray(trackLocal.trackUid, trackUids),
            inArray(trackLocal.status, [
              DownloadStatus.Cancelled,
              DownloadStatus.Failed,
              DownloadStatus.NotDownloaded,
            ]),
          ),
        ),
    ]);
  }

  /**
   * Run on startup.
   *
   * A download still marked `downloading` was cut off when the app closed, so it is marked
   * `failed` for the user to retry.
   */
  async failInterrupted() {
    await this.client.runAtomic([
      this.client.db
        .update(trackLocal)
        .set({ errorCode: DownloadErrorCode.Interrupted, status: DownloadStatus.Failed })
        .where(eq(trackLocal.status, DownloadStatus.Downloading)),
    ]);
  }

  selectFailed() {
    return this.selectDownloads()
      .where(inArray(trackLocal.status, [DownloadStatus.Failed, DownloadStatus.Cancelled]))
      .orderBy(desc(trackLocal.updatedAt), asc(trackLocal.trackUid));
  }

  selectQueue() {
    return this.selectDownloads()
      .where(eq(trackLocal.status, DownloadStatus.Queued))
      .orderBy(asc(trackLocal.queuedAt), asc(trackLocal.trackUid));
  }

  private selectDownloads() {
    return this.client.db
      .select({
        errorCode: trackLocal.errorCode,
        status: trackLocal.status,
        title: track.title,
        uid: track.uid,
      })
      .from(trackLocal)
      .innerJoin(track, eq(track.uid, trackLocal.trackUid))
      .$dynamic();
  }
}
