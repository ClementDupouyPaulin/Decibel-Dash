import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';

export interface UsePixiAppOptions {
  /** Largeur logique du canvas. Par défaut 960. */
  width?: number;
  /** Hauteur logique du canvas. Par défaut 540. */
  height?: number;
  /** Couleur de fond. Par défaut noir. */
  background?: string | number;
  /** Activé pour debug : log les FPS toutes les secondes. */
  logFps?: boolean;
}

export interface UsePixiAppResult {
  /** Ref à attacher sur une <div /> qui contiendra le canvas. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Application Pixi prête à l'emploi, ou null tant que init pas terminée. */
  app: Application | null;
  /** True quand Pixi a fini son init asynchrone. */
  ready: boolean;
}

/**
 * Initialise une application PixiJS v8 et l'attache au container DOM passé en ref.
 *
 * Design notes :
 * - Pixi v8 a une init asynchrone (`await app.init(...)`). On gère l'état `ready`
 *   pour que le caller sache quand commencer à manipuler la scène.
 * - Le cleanup est critique en StrictMode (double-mount en dev) : on destroy
 *   proprement l'app pour éviter les fuites de WebGL contexts.
 * - On NE met PAS l'app dans un state React, on garde une ref → pas de re-render
 *   du composant React quand Pixi fait son boulot.
 */
export function usePixiApp(options: UsePixiAppOptions = {}): UsePixiAppResult {
  const { width = 960, height = 540, background = 0x000000, logFps = false } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const app = new Application();

    void (async () => {
      await app.init({
        width,
        height,
        background,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });

      if (cancelled) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      container.appendChild(app.canvas);
      appRef.current = app;
      setReady(true);

      if (logFps) {
        let frames = 0;
        let lastLog = performance.now();
        app.ticker.add(() => {
          frames++;
          const now = performance.now();
          if (now - lastLog >= 1000) {
            // eslint-disable-next-line no-console
            console.info(`[Pixi] FPS: ${frames}`);
            frames = 0;
            lastLog = now;
          }
        });
      }
    })();

    return () => {
      cancelled = true;
      const current = appRef.current;
      if (current) {
        current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      setReady(false);
    };
  }, [width, height, background, logFps]);

  return { containerRef, app: appRef.current, ready };
}
