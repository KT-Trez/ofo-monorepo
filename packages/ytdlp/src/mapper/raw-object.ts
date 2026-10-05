export class RawObject {
  private readonly raw: Record<string, unknown>;

  private constructor(raw: Record<string, unknown>) {
    this.raw = raw;
  }

  static from(value: unknown): RawObject | null {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? new RawObject(value as Record<string, unknown>)
      : null;
  }

  list(key: string): unknown[] | null {
    const value = this.raw[key];

    return Array.isArray(value) ? (value as unknown[]) : null;
  }

  number(key: string): number | null {
    const value = this.raw[key];

    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  string(key: string): string | null {
    const value = this.raw[key];

    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  value(key: string): unknown {
    return this.raw[key];
  }
}
