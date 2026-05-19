import { useEffect } from 'react';
import { Graphics, Text } from 'pixi.js';
import { usePixiApp } from './usePixiApp';

/**
 * Scène de validation Sprint 0 :
 * - cube cyan qui flotte avec une rotation
 * - texte "Hello Pixi v8 + React 19 + TS strict"
 * - background gradient simulé via deux rectangles
 *
 * Sert de smoke test : si ça s'affiche et bouge fluide, la chaîne
 * Vite → React → TS → Pixi → WebGL est opérationnelle.
 */
export function HelloPixi() {
  const { containerRef, app, ready } = usePixiApp({ logFps: true });

  useEffect(() => {
    if (!ready || !app) return;

    // Background sombre avec touche de couleur
    const bg = new Graphics();
    bg.rect(0, 0, app.screen.width, app.screen.height).fill(0x0a0a12);
    bg.rect(0, app.screen.height - 80, app.screen.width, 80).fill(0x1a0033);
    app.stage.addChild(bg);

    // Cube principal
    const cube = new Graphics();
    cube.roundRect(-30, -30, 60, 60, 6).fill(0x00ffff).stroke({ width: 2, color: 0x000000 });
    cube.x = app.screen.width / 2;
    cube.y = app.screen.height / 2;
    app.stage.addChild(cube);

    // Texte
    const label = new Text({
      text: 'Hello Pixi v8 + React 19 + TS strict',
      style: {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: 18,
        fill: 0xffffff,
        align: 'center',
      },
    });
    label.anchor.set(0.5);
    label.x = app.screen.width / 2;
    label.y = 40;
    app.stage.addChild(label);

    // Animation : rotation + flottement
    let t = 0;
    const tick = () => {
      t += 0.02;
      cube.rotation = t;
      cube.y = app.screen.height / 2 + Math.sin(t * 2) * 20;
    };
    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
      // Le destroy des nodes est géré par le cleanup de usePixiApp via destroy(children: true)
    };
  }, [ready, app]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.25)]"
    />
  );
}
