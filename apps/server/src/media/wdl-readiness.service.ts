import { Injectable } from '@nestjs/common';
import { type HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { YT } from '@ofo/ytdlp/YT';

@Injectable()
export class WdlReadiness {
  constructor(
    private readonly indicator: HealthIndicatorService,
    private readonly wdl: YT,
  ) {}

  async check(): Promise<HealthIndicatorResult> {
    const session = this.indicator.check('ytdlp');

    try {
      const version = await this.wdl.version();

      return session.up({ version });
    } catch (error: unknown) {
      return session.down({ message: error instanceof Error ? error.message : String(error) });
    }
  }
}
