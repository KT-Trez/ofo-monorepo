import type { PartialDeep } from 'type-fest';
import { vi } from 'vitest';
import type Innertube from 'youtubei.js';
import type { InnerTubeCreator } from '../../src/youtube/inner-tube.factory.js';

export const createInnertubeMock = () => {
  return {
    session: { player: {} },
  } satisfies PartialDeep<Innertube> as Innertube;
};

export const createInnerTubeFactory = () => {
  const instances: Innertube[] = [];

  const factory = vi.fn<InnerTubeCreator>(async () => {
    const instance = createInnertubeMock();
    instances.push(instance);

    return instance;
  });

  return { factory, instances };
};
