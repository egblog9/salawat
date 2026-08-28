// High-Decibel Loud Alarm & Anti-Snooze Sound Manager

class LoudAlarmAudioService {
  private alarmAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private synthInterval: number | null = null;
  private volumeEnforcerInterval: number | null = null;
  private vibrationInterval: number | null = null;
  private isAlarmActive: boolean = false;
  private soundType: "adhan" | "intense_alarm" | "adhan_and_siren" = "adhan_and_siren";

  // Audio links for loud Fajr Adhan
  private adhanUrl = "https://everyayah.com/data/Alafasy_128kbps/001001.mp3"; // Or Adhan sound
  private backupAdhanUrl = "https://everyayah.com/data/MaherAlMuaiqly128kbps/033056.mp3";

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

  // Play Piercing Siren & Alarm Harmonic Pulses using Web Audio API
  private playPiercingSynthPulse() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1. High frequency alternating siren
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "square";

      // Piercing frequencies between 880Hz (A5) and 1320Hz (E6)
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.linearRampToValueAtTime(1320, now + 0.3);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.6);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.linearRampToValueAtTime(660, now + 0.3);
      osc2.frequency.linearRampToValueAtTime(440, now + 0.6);

      // Max gain with slight envelope
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.linearRampToValueAtTime(0.9, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.75);
      osc2.stop(now + 0.75);
    } catch (e) {
      console.warn("Piercing synth error:", e);
    }
  }

  // Start the Loud Wake-Up Alarm Loop
  public startLoudAlarm(soundType: "adhan" | "intense_alarm" | "adhan_and_siren" = "adhan_and_siren") {
    this.stopLoudAlarm();
    this.isAlarmActive = true;
    this.soundType = soundType;

    // 1. Play background alarm audio element
    if (!this.alarmAudio) {
      this.alarmAudio = new Audio();
    }
    
    this.alarmAudio.src = "/audio/salawat-formula-2.mp3"; // Or fallback
    this.alarmAudio.loop = true;
    this.alarmAudio.volume = 1.0;
    this.alarmAudio.preload = "auto";
    
    this.alarmAudio.play().catch(() => {
      // Audio autoplay might be handled on user touch
    });

    // 2. Start Piercing Multi-Tone Siren Loop
    this.playPiercingSynthPulse();
    this.synthInterval = window.setInterval(() => {
      if (this.isAlarmActive) {
        this.playPiercingSynthPulse();
      }
    }, 850);

    // 3. Strict Volume Enforcer Loop (Auto-boosts volume back to 100% every 250ms)
    this.volumeEnforcerInterval = window.setInterval(() => {
      if (this.isAlarmActive) {
        if (this.alarmAudio) {
          this.alarmAudio.volume = 1.0;
          this.alarmAudio.muted = false;
          if (this.alarmAudio.paused) {
            this.alarmAudio.play().catch(() => {});
          }
        }
        if (this.audioCtx && this.audioCtx.state === "suspended") {
          this.audioCtx.resume().catch(() => {});
        }
      }
    }, 250);

    // 4. Continuous Heavy Vibration Loop on Mobile Devices
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([500, 200, 500, 200, 800, 200]);
        this.vibrationInterval = window.setInterval(() => {
          if (this.isAlarmActive) {
            navigator.vibrate([500, 200, 500, 200, 800, 200]);
          }
        }, 2500);
      } catch (e) {
        // ignore
      }
    }
  }

  // Stop the Alarm (ONLY called when challenge is verified!)
  public stopLoudAlarm() {
    this.isAlarmActive = false;

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
