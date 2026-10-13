import { describe, expect, it, vi } from 'vitest';
import { SingleFlight } from './single-flight.js';

describe('SingleFlight', () => {
  const flush = () => new Promise<void>(resolve => setImmediate(resolve));

  it('should share one execution per key', async () => {
    // given
    const flight = new SingleFlight<string, string>();
    const start = vi.fn<(signal: AbortSignal) => Promise<string>>().mockResolvedValue('abc');

    // when
    const first = flight.join('k', start);
    const second = flight.join('k', start);

    // then
    await expect(first.result).resolves.toBe('abc');
    await expect(second.result).resolves.toBe('abc');

    expect(first.shared).toBe(false);
    expect(second.shared).toBe(true);

    expect(start).toHaveBeenCalledTimes(1);
  });

  it('should keep different keys independent', async () => {
    // given
    const flight = new SingleFlight<string, string>();

    // when
    const a = flight.join('a', () => Promise.resolve('ABC'));
    const b = flight.join('b', () => Promise.resolve('DEF'));

    // then
    await expect(Promise.all([a.result, b.result])).resolves.toEqual(['ABC', 'DEF']);
  });

  it('should forget a failed job so that the next call runs it again', async () => {
    // given
    const flight = new SingleFlight<string, string>();
    const start = vi
      .fn<(signal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new Error('Something went wrong'))
      .mockResolvedValueOnce('abc');

    // when
    const first = flight.join('k', start);

    // then
    await expect(first.result).rejects.toThrow('Something went wrong');
    await flush();

    // when
    const second = flight.join('k', start);

    // then
    await expect(second.result).resolves.toBe('abc');
    expect(start).toHaveBeenCalledTimes(2);
  });

  it('should abort the job only when the last subscriber releases it', () => {
    // given
    const flight = new SingleFlight<string, string>();
    const { promise } = Promise.withResolvers<string>();

    let signalRef!: AbortSignal;

    const first = flight.join('k', signal => {
      signalRef = signal;
      return promise;
    });
    const second = flight.join('k', () => promise);

    // when
    first.release();

    // then
    expect(signalRef.aborted).toBe(false);

    // when
    second.release();

    // then
    expect(signalRef.aborted).toBe(true);
    expect(flight.has('k')).toBe(false);
  });

  it('should count a repeated release of the same subscription once', () => {
    // given
    const flight = new SingleFlight<string, string>();
    const { promise } = Promise.withResolvers<string>();

    let signalRef!: AbortSignal;

    const first = flight.join('k', signal => {
      signalRef = signal;
      return promise;
    });
    flight.join('k', () => promise);

    // when
    first.release();
    first.release();

    // then
    expect(signalRef.aborted).toBe(false);
  });

  it('should start a fresh job after an aborted one', async () => {
    // given
    const flight = new SingleFlight<string, string>();
    const { promise, reject } = Promise.withResolvers<string>();

    const first = flight.join('k', () => promise);
    first.release();

    const start = vi.fn<(signal: AbortSignal) => Promise<string>>().mockResolvedValue('abc');

    // when
    const second = flight.join('k', start);

    // then
    expect(second.shared).toBe(false);
    reject(new DOMException('Something went wrong', 'AbortError'));

    await expect(first.result).rejects.toThrow('Something went wrong');
    await expect(second.result).resolves.toBe('abc');
  });

  it('should dispose the value only after the last subscriber released it', async () => {
    // given
    const dispose = vi.fn<(value: string) => void>();
    const flight = new SingleFlight<string, string>(dispose);

    const first = flight.join('k', () => Promise.resolve('abc'));
    const second = flight.join('k', () => Promise.resolve('def'));

    await first.result;
    await flush();

    // when
    first.release();

    // then
    expect(dispose).not.toHaveBeenCalled();

    // when
    second.release();

    // then
    expect(dispose).toHaveBeenCalledExactlyOnceWith('abc');
  });

  it('should let a late caller join a finished value that is still held', async () => {
    // given
    const dispose = vi.fn<(value: string) => void>();
    const flight = new SingleFlight<string, string>(dispose);

    const first = flight.join('k', () => Promise.resolve('abc'));
    await first.result;
    await flush();

    const start = vi.fn<(signal: AbortSignal) => Promise<string>>();

    // when
    const late = flight.join('k', start);
    first.release();

    // then
    expect(late.shared).toBe(true);
    expect(start).not.toHaveBeenCalled();
    expect(dispose).not.toHaveBeenCalled();

    // when
    late.release();

    // then
    expect(dispose).toHaveBeenCalledExactlyOnceWith('abc');
  });

  it('should dispose a value that arrives after everybody left', async () => {
    // given
    const dispose = vi.fn<(value: string) => void>();
    const flight = new SingleFlight<string, string>(dispose);
    const { promise, resolve } = Promise.withResolvers<string>();

    const subscription = flight.join('k', () => promise);

    // when
    subscription.release();
    resolve('abc');
    await flush();

    // then
    expect(dispose).toHaveBeenCalledExactlyOnceWith('abc');
  });

  it('should not dispose when the job failed', async () => {
    // given
    const dispose = vi.fn<(value: string) => void>();
    const flight = new SingleFlight<string, string>(dispose);

    const subscription = flight.join('k', () => Promise.reject(new Error('Something went wrong')));
    await subscription.result.catch(() => undefined);

    // when
    subscription.release();
    await flush();

    // then
    expect(dispose).not.toHaveBeenCalled();
  });

  it('should swallow a failing dispose', async () => {
    // given
    const flight = new SingleFlight<string, string>(() => {
      throw new Error('Something went wrong');
    });

    const subscription = flight.join('k', () => Promise.resolve('abc'));
    await subscription.result;
    await flush();

    // when / then
    expect(() => subscription.release()).not.toThrow();
    await flush();
  });
});
