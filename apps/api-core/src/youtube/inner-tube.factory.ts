import Innertube from 'youtubei.js';

export type InnerTubeCreator = (options: InnerTubeOptions) => Promise<Innertube>;

export type InnerTubeOptions = NonNullable<Parameters<typeof Innertube.create>[0]>;

// oxlint-disable-next-line typescript/no-extraneous-class
export class InnerTubeFactory {
  public static readonly INNER_TUBE_SYMBOL = Symbol('INNER_TUBE');

  public static createInnerTube(options: InnerTubeOptions) {
    return Innertube.create(options);
  }
}
