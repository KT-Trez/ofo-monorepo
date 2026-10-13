type Flight<V> = {
  controller: AbortController;
  /** `true` once the job resolved with a value. */
  hasValue: boolean;
  refs: number;
  result: Promise<V>;
  value: V | undefined;
};

export type FlightSubscription<V> = {
  /**
   * Gives up the result. Idempotent. When the last subscriber of an unfinished job gives up, the job
   * is aborted; when the last subscriber of a finished job gives up, its value is disposed.
   */
  release: () => void;
  /** Settles with the shared job; rejects with the job's error (also with its abort error). */
  result: Promise<V>;
  /** `true` when this subscriber joined a job started by somebody else. */
  shared: boolean;
};

/**
 * Shares one job per key between all the callers asking for it at the same time.
 *
 * Every caller holds a subscription. The job gets an `AbortSignal` that fires when the last
 * subscriber releases before the job finished. A resolved value stays usable (and joinable) until
 * the last subscriber releases it, then `dispose` runs, so a produced file can be deleted only
 * after everybody is done with it. A failed job is forgotten at once, so the next call retries.
 */
export class SingleFlight<K, V> {
  private readonly flights = new Map<K, Flight<V>>();

  constructor(private readonly dispose?: (value: V) => Promise<void> | void) {}

  has(key: K): boolean {
    return this.flights.has(key);
  }

  join(key: K, start: (signal: AbortSignal) => Promise<V>): FlightSubscription<V> {
    const existing = this.flights.get(key);
    const flight = existing ?? this.start(key, start);
    flight.refs += 1;

    let released = false;
    const release = (): void => {
      if (released) {
        return;
      }
      released = true;
      flight.refs -= 1;
      this.onRelease(key, flight);
    };

    return { release, result: flight.result, shared: existing !== undefined };
  }

  private disposeValue(value: V): void {
    if (!this.dispose) {
      return;
    }

    void (async () => this.dispose?.(value))().catch(() => undefined);
  }

  private forget(key: K, flight: Flight<V>): void {
    if (this.flights.get(key) === flight) {
      this.flights.delete(key);
    }
  }

  private onRelease(key: K, flight: Flight<V>): void {
    if (flight.refs > 0) {
      return;
    }

    this.forget(key, flight);

    if (flight.hasValue) {
      this.disposeValue(flight.value as V);
    } else {
      flight.controller.abort();
    }
  }

  private async settle(key: K, flight: Flight<V>): Promise<void> {
    let value: V;

    try {
      value = await flight.result;
    } catch {
      return this.forget(key, flight);
    }

    flight.hasValue = true;
    flight.value = value;

    // everybody left while the job was finishing
    if (flight.refs === 0) {
      this.forget(key, flight);
      this.disposeValue(value);
    }
  }

  private start(key: K, start: (signal: AbortSignal) => Promise<V>): Flight<V> {
    const controller = new AbortController();
    const result = (async () => start(controller.signal))();
    const flight: Flight<V> = { controller, hasValue: false, refs: 0, result, value: undefined };

    void this.settle(key, flight);

    this.flights.set(key, flight);

    return flight;
  }
}
