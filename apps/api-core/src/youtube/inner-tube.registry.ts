import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdirSync } from 'node:fs';
import Innertube, { UniversalCache } from 'youtubei.js';
import type { ApiCoreConfig } from '../../config/configuration.js';
import { type InnerTubeCreator, InnerTubeFactory } from './inner-tube.factory.js';
import { installJsEvaluator } from './js-evaluator.js';

type InnertubeInstance = {
  createdAt: number;
  instance: Innertube;
};

@Injectable()
export class InnerTubeRegistry implements OnModuleInit {
  private static readonly MAIN_INSTANCE_LANG = 'en';
  private static readonly MAIN_INSTANCE_LOCATION = 'US';

  private readonly logger = new Logger(InnerTubeRegistry.name);
  private readonly instancePerLocale = new Map<string, Promise<Innertube>>();
  private isMainInstanceStale = false;
  private mainInstance: InnertubeInstance | undefined;
  private mainInstancePromise: Promise<InnertubeInstance> | undefined;

  constructor(
    private readonly config: ConfigService<ApiCoreConfig>,
    @Inject(InnerTubeFactory.INNER_TUBE_SYMBOL) private readonly factory: InnerTubeCreator,
  ) {}

  onModuleInit() {
    const youtube = this.config.getOrThrow('youtube', { infer: true });

    installJsEvaluator();
    mkdirSync(youtube.cacheDir, { recursive: true });
  }

  public getInstanceForLocale(localeArg: string): Promise<Innertube> {
    const locale = this.parseLangFromString(localeArg);
    const instance = this.instancePerLocale.get(locale);

    if (instance) {
      return instance;
    }

    const newInstance = this.factory({
      cache: new UniversalCache(false),
      generate_session_locally: true,
      lang: locale,
      location: this.parseLocationFromLocale(locale),
      retrieve_player: false,
    });

    this.instancePerLocale.set(locale, newInstance);

    newInstance.catch(() => {
      if (this.instancePerLocale.get(locale) === newInstance) {
        this.instancePerLocale.delete(locale);
      }
    });

    return newInstance;
  }

  public async getMainInstance(): Promise<Innertube> {
    const instance = this.mainInstance;

    if (!instance) {
      return (await this.createMainInstanceOnce()).instance;
    }

    if (this.isMainInstanceStale || this.isExpired(instance)) {
      // refresh in the background, the old instance still serves incoming requests
      this.createMainInstanceOnce().catch((error: unknown) =>
        this.logger.warn(`Main InnerTube instance rotation failed: ${error}`),
      );
    }

    return instance.instance;
  }

  public invalidateMainInstance() {
    this.isMainInstanceStale = true;
  }

  public parseLangFromString(text: string): string {
    const supported = this.config.getOrThrow('app', { infer: true }).languages;

    if (supported.includes(text)) {
      return text;
    }

    return InnerTubeRegistry.MAIN_INSTANCE_LANG;
  }

  private async createMainInstance(): Promise<InnertubeInstance> {
    const youtube = this.config.getOrThrow('youtube', { infer: true });

    const instance = await this.factory({
      cache: new UniversalCache(true, youtube.cacheDir),
      generate_session_locally: true,
      lang: InnerTubeRegistry.MAIN_INSTANCE_LANG,
      location: InnerTubeRegistry.MAIN_INSTANCE_LOCATION,
      retrieve_player: true,
      ...(youtube.playerId ? { player_id: youtube.playerId } : {}),
      ...(youtube.poToken ? { po_token: youtube.poToken } : {}),
    });

    return { createdAt: Date.now(), instance };
  }

  private createMainInstanceOnce(): Promise<InnertubeInstance> {
    if (this.mainInstancePromise) {
      return this.mainInstancePromise;
    }

    this.mainInstancePromise = this.createMainInstance()
      .then(instance => {
        this.isMainInstanceStale = false;
        this.mainInstance = instance;
        this.mainInstancePromise = undefined;

        return instance;
      })
      .catch((error: unknown) => {
        this.mainInstancePromise = undefined;

        throw error;
      });

    return this.mainInstancePromise;
  }

  private isExpired(instance: InnertubeInstance): boolean {
    const ttlMs = this.config.getOrThrow('youtube', { infer: true }).sessionTtlMin * 60_000;

    return Date.now() - instance.createdAt >= ttlMs;
  }

  private parseLocationFromLocale(locale: string): string {
    try {
      const parsed = new Intl.Locale(locale);

      return parsed.region ?? InnerTubeRegistry.MAIN_INSTANCE_LOCATION;
    } catch {
      return InnerTubeRegistry.MAIN_INSTANCE_LOCATION;
    }
  }
}
