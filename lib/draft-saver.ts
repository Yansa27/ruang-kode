export type SaveStatus = 'saved' | 'saving' | 'error';

/** Serializes writes so an older request cannot overwrite a newer draft. */
export class DraftSaver {
  private latest: string;
  private saved: string;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pending: Promise<void> | null = null;
  constructor(initial: string, private write: (code: string) => Promise<void>, private report: (status: SaveStatus) => void, private delay = 800) {
    this.latest = initial;
    this.saved = initial;
  }
  update(code: string) {
    this.latest = code;
    clearTimeout(this.timer);
    this.report(this.pending || code !== this.saved ? 'saving' : 'saved');
    this.timer = setTimeout(() => { void this.flush(); }, this.delay);
  }
  flush(): Promise<void> {
    clearTimeout(this.timer);
    if (this.pending) return this.pending;
    if (this.latest === this.saved) { this.report('saved'); return Promise.resolve(); }
    this.report('saving');
    this.pending = (async () => {
      try {
        while (this.latest !== this.saved) {
          const snapshot = this.latest;
          await this.write(snapshot);
          this.saved = snapshot;
        }
        this.report('saved');
      } catch {
        this.report('error');
      } finally {
        this.pending = null;
      }
    })();
    return this.pending;
  }
}
