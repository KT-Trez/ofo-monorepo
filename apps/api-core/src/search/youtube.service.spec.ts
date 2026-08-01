import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type Innertube from 'youtubei.js';
import { INNER_TUBE_TOKEN } from '../inner-tube/inner-tube.module.js';
import { YoutubeService } from './youtube.service.js';

describe('YoutubeService', () => {
  let service: YoutubeService;
  const innerTubeMock: Partial<Innertube> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: INNER_TUBE_TOKEN, useValue: innerTubeMock }, YoutubeService],
    }).compile();

    service = module.get<YoutubeService>(YoutubeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
