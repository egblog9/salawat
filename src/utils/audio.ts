// Sheikh Audio Player & Dhikr Sound Synthesis Manager

class SheikhAudioManager {
  private audioElement: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeTrackId: string | null = null;
  private volume: number = 1.0;
  private playbackRate: number = 1.0;
  private currentRepeat: number = 1;
  private totalRepeats: number = 1;

  private onProgressCb: ((progress: number, currentTime: number, duration: number) => void) | null = null;
  private onTrackEndedCb: (() => void) | null = null;
  private onRepeatChangeCb: ((current: number, total: number) => void) | null = null;
  private onErrorCb: ((err: string) => void) | null = null;

  constructor() {
    // Initialized on client side
  }

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTrack(
    trackId: string,
    url: string,
    repeats: number = 1,
    callbacks?: {
      onProgress?: (progress: number, currentTime: number, duration: number) => void;
      onEnded?: () => void;
      onRepeatChange?: (current: number, total: number) => void;
      onError?: (err: string) => void;
    }
  ) {
    this.stop();

    this.activeTrackId = trackId;
    this.totalRepeats = repeats;
    this.currentRepeat = 1;

    this.onProgressCb = callbacks?.onProgress || null;
    this.onTrackEndedCb = callbacks?.onEnded || null;
    this.onRepeatChangeCb = callbacks?.onRepeatChange || null;
    this.onErrorCb = callbacks?.onError || null;

    this.onRepeatChangeCb?.(this.currentRepeat, this.totalRepeats);

    if (!this.audioElement) {
      this.audioElement = new Audio();
    }

    const audio = this.audioElement;
    audio.pause();
    audio.src = url;
    audio.volume = this.volume;
    audio.playbackRate = this.playbackRate;
    audio.preload = "auto";

    audio.ontimeupdate = () => {
      if (!audio.duration || isNaN(audio.duration)) return;
      const progress = Math.min(100, (audio.currentTime / audio.duration) * 100);
      this.onProgressCb?.(progress, audio.currentTime, audio.duration);
    };

    audio.onended = () => {
      if (this.currentRepeat < this.totalRepeats) {
        this.currentRepeat += 1;
        this.onRepeatChangeCb?.(this.currentRepeat, this.totalRepeats);
        setTimeout(() => {
          if (this.isPlaying && this.audioElement) {
            audio.currentTime = 0;
            audio.play().catch((e) => console.warn("Repeat playback error:", e));
          }
        }, 500);
      } else {
        this.isPlaying = false;
        this.activeTrackId = null;
        this.onTrackEndedCb?.();
      }
    };

    audio.onerror = (e) => {
      console.warn("Audio element load error, attempting fallback playback:", e);
      this.playFallbackRecitation(trackId, () => {
        this.isPlaying = false;
        this.activeTrackId = null;
        this.onTrackEndedCb?.();
      });
    };

    this.isPlaying = true;
    audio.load();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio autoplay blocked or failed, using fallback:", err);
        this.playFallbackRecitation(trackId, () => {
          this.isPlaying = false;
          this.activeTrackId = null;
          this.onTrackEndedCb?.();
        });
      });
    }
  }

  // Play synthetic reverent harmonic recitation tone if remote MP3 is unreachable
  private playFallbackRecitation(trackId: string, onDone: () => void) {
    try {
      const ctx = this.initContext();
      const baseFreq = 220; // A3
      const duration = 6.0; // 6 seconds simulation
      
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.875];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        
        g.gain.setValueAtTime(0.01, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.15 * this.volume, ctx.currentTime + 0.8 + idx * 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      });

      let elapsed = 0;
      const interval = window.setInterval(() => {
        elapsed += 0.1;
        const progress = Math.min(100, (elapsed / duration) * 100);
        this.onProgressCb?.(progress, elapsed, duration);
        if (elapsed >= duration) {
          clearInterval(interval);
          onDone();
        }
      }, 100);
    } catch (e) {
      onDone();
    }
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  public resume() {
    if (this.audioElement) {
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  public stop() {
    this.isPlaying = false;
    this.activeTrackId = null;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.ontimeupdate = null;
      this.audioElement.onended = null;
    }
    this.onProgressCb?.(0, 0, 0);
  }

  public seek(percent: number) {
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = (percent / 100) * this.audioElement.duration;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveTrackId(): string | null {
    return this.activeTrackId;
  }

  // Realistic prayer bead tick (Tasbeeh click sound)
  public playBeadClick() {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(460, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.35 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn("Could not play bead sound:", e);
    }
  }

  // Chime on completing Tasbeeh goal
  public playCompletionChime() {
    try {
      const ctx = this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.28 * this.volume, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.85);
      });
    } catch (e) {
      console.warn("Could not play chime:", e);
    }
  }
}

export const sheikhAudioManager = new SheikhAudioManager();
