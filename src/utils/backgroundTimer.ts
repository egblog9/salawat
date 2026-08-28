// Background Timer Web Worker & Audio Pipeline Keep-Alive
// Solves background throttling in mobile browsers (Chrome, Safari, Firefox)

class BackgroundTimerService {
  private worker: Worker | null = null;
  private timerCallbacks: Set<() => void> = new Set();
  private isKeepAliveRunning: boolean = false;
  private silentAudio: HTMLAudioElement | null = null;
  private wakeLockSentinel: any = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.initWorker();
  }

  // 1. Web Worker for unthrottled background setInterval
  private initWorker() {
    if (typeof window === "undefined") return;

    try {
      // Inlined Web Worker script to avoid external file loading issues
      const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            if (!timer) {
              timer = setInterval(function() {
                self.postMessage('tick');
              }, 1000);
            }
          } else if (e.data === 'stop') {
            if (timer) {
              clearInterval(timer);
              timer = null;
            }
          }
        };
      `;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => {
        if (e.data === "tick") {
          this.timerCallbacks.forEach((cb) => {
            try {
              cb();
            } catch (err) {
              console.warn("Background timer callback error:", err);
            }
          });
        }
      };

      this.worker.postMessage("start");
    } catch (e) {
      console.warn("Web Worker background timer fallback to window.setInterval:", e);
      // Fallback
      window.setInterval(() => {
        this.timerCallbacks.forEach((cb) => cb());
      }, 1000);
    }
  }

  public subscribe(callback: () => void): () => void {
    this.timerCallbacks.add(callback);
    return () => {
      this.timerCallbacks.delete(callback);
    };
  }

  // 2. Request Screen WakeLock to prevent CPU from sleeping while reminders are active
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
        this.wakeLockSentinel.addEventListener("release", () => {
          this.wakeLockSentinel = null;
        });
        return true;
      } catch (err) {
        console.warn("Wake Lock request failed:", err);
        return false;
      }
    }
    return false;
  }

  public releaseWakeLock() {
    if (this.wakeLockSentinel) {
      this.wakeLockSentinel.release().catch(() => {});
      this.wakeLockSentinel = null;
    }
  }

  // 3. Audio Pipeline Keep-Alive (Continuous silent audio stream to keep audio session alive in background)
  public startAudioKeepAlive() {
    if (this.isKeepAliveRunning) return;
    this.isKeepAliveRunning = true;

    try {
      // Setup MediaSession for background audio status & lockscreen controls
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "صَلِّ عَلَى النَّبِيِّ ﷺ",
          artist: "التذكير الصوتي ومنبه الفجر نشط بالخلفية",
          album: "تطبيق صلوات",
          artwork: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
        });

        // Set action handlers so background audio session stays registered
        navigator.mediaSession.setActionHandler("play", () => {});
        navigator.mediaSession.setActionHandler("pause", () => {});
      }

      // Generate a tiny silent base64 audio loop
      if (!this.silentAudio) {
        // 1-second silent WAV base64
        const silentWavBase64 =
          "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A/w==";
        this.silentAudio = new Audio(silentWavBase64);
        this.silentAudio.loop = true;
        this.silentAudio.volume = 0.01;
      }

      this.silentAudio.play().catch(() => {
        // Autoplay may be restricted until user interacts with UI
      });

      this.requestWakeLock();
    } catch (e) {
      console.warn("Audio keep-alive error:", e);
    }
  }

  public stopAudioKeepAlive() {
    this.isKeepAliveRunning = false;
    if (this.silentAudio) {
      this.silentAudio.pause();
    }
    this.releaseWakeLock();
  }

  public isBackgroundActive(): boolean {
    return this.isKeepAliveRunning;
  }
}

export const backgroundTimerService = new BackgroundTimerService();
