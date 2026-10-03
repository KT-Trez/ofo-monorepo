import { Inject, Module, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService, TerminusModule } from '@nestjs/terminus';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { timeout } from 'es-toolkit';
import postgres from 'postgres';
import type { ApiCoreConfig } from '../../../config/configuration.js';
import { HealthRegistryService } from '../../health/health-registry.service.js';

type PostgresDatabase = PostgresJsDatabase;

type PostgresClient = postgres.Sql;

@Module({
  exports: [DatabaseModule.DATABASE],
  imports: [TerminusModule],
  providers: [
    {
      inject: [ConfigService],
      provide: DatabaseModule.POSTGRES_CLIENT,
      useFactory: (config: ConfigService<ApiCoreConfig>): PostgresClient => {
        const { url } = config.getOrThrow('database', { infer: true });

        return postgres(url, { max: 10, prepare: false });
      },
    },
    {
      inject: [DatabaseModule.POSTGRES_CLIENT],
      provide: DatabaseModule.DATABASE,
      useFactory: (client: PostgresClient): PostgresDatabase => drizzle(client),
    },
  ],
})
export class DatabaseModule implements OnApplicationShutdown, OnModuleInit {
  public static readonly DATABASE = Symbol('DATABASE');
  public static readonly POSTGRES_CLIENT = Symbol('POSTGRES_CLIENT');

  private static readonly READINESS_TIMEOUT_MS = 3000;

  constructor(
    @Inject(DatabaseModule.POSTGRES_CLIENT) private readonly client: PostgresClient,
    private readonly indicator: HealthIndicatorService,
    private readonly registry: HealthRegistryService,
  ) {}

  onModuleInit() {
    this.registry.register('database', async () => {
      const check = this.indicator.check('database');

      try {
        await Promise.race([this.client`select 1`, timeout(DatabaseModule.READINESS_TIMEOUT_MS)]);

        return check.up();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : `Unknown error: ${error}`;

        return check.down({ message });
      }
    });
  }

  async onApplicationShutdown() {
    await this.client.end({ timeout: 5 });
  }
}
