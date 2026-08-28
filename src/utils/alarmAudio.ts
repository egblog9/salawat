// High-Decibel Loud Alarm & Anti-Snooze Sound Manager with Hardware Boost & Extreme Volume Enforcer

class LoudAlarmAudioService {
  private alarmAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private synthInterval: number | null = null;
  private volumeEnforcerInterval: number | null = null;
  private vibrationInterval: number | null = null;
  private isAlarmActive: boolean = false;
  private soundType: "adhan" | "intense_alarm" | "adhan_and_siren" = "adhan_and_siren";
  private wakeLockSentinel: any = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Request screen wake lock to keep screen illuminated
  private async acquireWakeLock() {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
      } catch (err) {
        console.warn("Alarm WakeLock error:", err);
      }
    }
  }

  private releaseWakeLock() {
    if (this.wakeLockSentinel) {
      this.wakeLockSentinel.release().catch(() => {});
      this.wakeLockSentinel = null;
    }
  }

  // Play High-Decibel Piercing Siren Pulses via Web Audio API with boosted gain
  private playPiercingSynthPulse() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Oscillators for dual high-low frequencies
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const pulseGain = ctx.createGain();

      // Compressor to maximize perceived loudness without clipping
      if (!this.compressorNode) {
        this.compressorNode = ctx.createDynamicsCompressor();
        this.compressorNode.threshold.setValueAtTime(-20, now);
        this.compressorNode.knee.setValueAtTime(40, now);
        this.compressorNode.ratio.setValueAtTime(12, now);
        this.compressorNode.attack.setValueAtTime(0, now);
        this.compressorNode.release.setValueAtTime(0.25, now);
        this.compressorNode.connect(ctx.destination);
      }

      osc1.type = "sawtooth";
      osc2.type = "square";
      osc3.type = "triangle";

      // Frequencies sweeping rapidly between 950Hz and 1750Hz (Alarm emergency tones)
      osc1.frequency.setValueAtTime(950, now);
      osc1.frequency.linearRampToValueAtTime(1750, now + 0.25);
      osc1.frequency.linearRampToValueAtTime(950, now + 0.5);

      osc2.frequency.setValueAtTime(480, now);
      osc2.frequency.linearRampToValueAtTime(880, now + 0.25);
      osc2.frequency.linearRampToValueAtTime(480, now + 0.5);

      osc3.frequency.setValueAtTime(1400, now);
      osc3.frequency.linearRampToValueAtTime(700, now + 0.25);
      osc3.frequency.linearRampToValueAtTime(1400, now + 0.5);

      // Volume Gain boosted
      pulseGain.gain.setValueAtTime(0.85, now);
      pulseGain.gain.linearRampToValueAtTime(1.0, now + 0.25);
      pulseGain.gain.linearRampToValueAtTime(0.01, now + 0.6);

      osc1.connect(pulseGain);
      osc2.connect(pulseGain);
      osc3.connect(pulseGain);
      pulseGain.connect(this.compressorNode);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
      osc3.stop(now + 0.65);
    } catch (e) {
      console.warn("Piercing synth pulse error:", e);
    }
  }

  // Start the Loud Wake-Up Alarm Loop
  public startLoudAlarm(soundType: "adhan" | "intense_alarm" | "adhan_and_siren" = "adhan_and_siren") {
    this.stopLoudAlarm();
    this.isAlarmActive = true;
    this.soundType = soundType;

    this.acquireWakeLock();

    // 1. Setup Audio Element with Max Volume and Listeners
    if (!this.alarmAudio) {
      this.alarmAudio = new Audio();
      this.alarmAudio.loop = true;
      this.alarmAudio.preload = "auto";

      // Instantly detect if user or device tries to lower volume or mute
      this.alarmAudio.addEventListener("volumechange", () => {
        if (this.isAlarmActive && this.alarmAudio) {
          if (this.alarmAudio.volume < 1.0 || this.alarmAudio.muted) {
            this.alarmAudio.volume = 1.0;
            this.alarmAudio.muted = false;
          }
        }
      });

      this.alarmAudio.addEventListener("pause", () => {
        if (this.isAlarmActive && this.alarmAudio) {
          this.alarmAudio.play().catch(() => {});
        }
      });
    }

    this.alarmAudio.src = "/audio/salawat-formula-2.mp3";
    this.alarmAudio.volume = 1.0;
    this.alarmAudio.muted = false;
    
    this.alarmAudio.play().catch(() => {
      // Audio autoplay fallback on first interaction
    });

    // 2. Setup Lockscreen / Notification Media Session
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "🚨 أذان ومنبه الفجر يصدح الآن!",
        artist: "الصلاة خير من النوم - اضغط لحل التحدي",
        album: "تطبيق صلوات",
        artwork: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      });

      // Prevent lockscreen pause button from silencing the alarm
      navigator.mediaSession.setActionHandler("pause", () => {
        if (this.isAlarmActive) {
          this.enforceMaxVolume();
        }
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        if (this.isAlarmActive) {
          this.enforceMaxVolume();
        }
      });
    }

    // 3. Start Piercing Multi-Tone Siren Loop (runs every 650ms for urgent sound)
    this.playPiercingSynthPulse();
    this.synthInterval = window.setInterval(() => {
      if (this.isAlarmActive) {
        this.playPiercingSynthPulse();
      }
    }, 650);

    // 4. Strict Volume Enforcer Loop (Aggressively snaps volume to 100% every 50ms)
    this.volumeEnforcerInterval = window.setInterval(() => {
      if (this.isAlarmActive) {
        this.enforceMaxVolume();
      }
    }, 50);

    // 5. Continuous Urgent Vibration Pattern on Mobile Devices
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([1000, 300, 1000, 300, 1500, 300]);
        this.vibrationInterval = window.setInterval(() => {
          if (this.isAlarmActive) {
            navigator.vibrate([1000, 300, 1000, 300, 1500, 300]);
          }
        }, 3500);
      } catch (e) {
        // ignore
      }
    }
  }

  // Enforce Max Volume: Called constantly to prevent lowering volume
  public enforceMaxVolume() {
    if (this.alarmAudio) {
      this.alarmAudio.volume = 1.0;
      this.alarmAudio.muted = false;
      if (this.alarmAudio.paused && this.isAlarmActive) {
        this.alarmAudio.play().catch(() => {});
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Stop the Alarm (ONLY called when challenge is verified!)
  public stopLoudAlarm() {
    this.isAlarmActive = false;
    this.releaseWakeLock();

    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }

    if (this.volumeEnforcerInterval) {
      clearInterval(this.volumeEnforcerInterval);
      this.volumeEnforcerInterval = null;
    }

    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }

    if (this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio.currentTime = 0;
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  }

  public isActive(): boolean {
    return this.isAlarmActive;
  }
}

export const loudAlarmAudioService = new LoudAlarmAudioService();
