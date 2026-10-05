'use client';

// Web Audio API synthesized sound effects
// Lightweight, zero-asset, instant response without network latency

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ruangkode_sound_enabled');
      this.soundEnabled = stored !== null ? stored === 'true' : true;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(val: boolean) {
    this.soundEnabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruangkode_sound_enabled', String(val));
    }
  }

  public toggle(): boolean {
    const next = !this.soundEnabled;
    this.setEnabled(next);
    if (next) {
      this.playRun();
    }
    return next;
  }

  // Click/Run sound: short, crisp high-tech tick
  public playRun() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  }

  // Success chime: uplifting 4-tone chord arpeggio (C5 -> E5 -> G5 -> C6)
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const start = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start + i * 0.08);

        gain.gain.setValueAtTime(0, start + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, start + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start + i * 0.08);
        osc.stop(start + i * 0.08 + 0.45);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Failure tone: subtle, warm 2-tone descending cue (not harsh or buzzing)
  public playFailure() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [392.0, 329.63]; // G4 -> E4
      const start = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start + i * 0.12);

        gain.gain.setValueAtTime(0.07, start + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.12 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start + i * 0.12);
        osc.stop(start + i * 0.12 + 0.2);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundFx = new SoundManager();
