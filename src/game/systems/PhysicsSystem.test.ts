import { describe, it, expect } from 'vitest';
import { applyPhysics } from './PhysicsSystem';
import { createPlayer, tryJump } from '@/game/entities/Player';
import { GRAVITY, JUMP_VELOCITY } from '@/config/physics';
import { GROUND_Y, PLAYER_SIZE } from '@/config/world';

const groundLineForPlayer = GROUND_Y - PLAYER_SIZE;

describe('applyPhysics — joueur au repos au sol', () => {
  it('reste collé au sol, vélocité reste à 0', () => {
    const p = createPlayer();
    const result = applyPhysics(p, GROUND_Y);
    // Gravité s'applique puis le clamp ramène au sol immédiatement.
    // velocityY est remis à 0 par le clamp.
    expect(p.position.y).toBe(groundLineForPlayer);
    expect(p.velocityY).toBe(0);
    expect(p.onGround).toBe(true);
    expect(result.justLanded).toBe(false); // était déjà au sol avant
  });
});

describe('applyPhysics — saut puis chute libre', () => {
  it('après un saut, vélocité = JUMP_VELOCITY + GRAVITY, position monte', () => {
    const p = createPlayer();
    tryJump(p);
    const yBefore = p.position.y;
    applyPhysics(p, GROUND_Y);

    // Après une frame : v = JUMP_VELOCITY + GRAVITY, y a bougé de v
    expect(p.velocityY).toBeCloseTo(JUMP_VELOCITY + GRAVITY, 5);
    expect(p.position.y).toBeLessThan(yBefore); // a monté
    expect(p.onGround).toBe(false);
  });

  it('la vélocité augmente de GRAVITY chaque frame en l\'air', () => {
    const p = createPlayer();
    tryJump(p);

    applyPhysics(p, GROUND_Y);
    const vAfter1 = p.velocityY;
    applyPhysics(p, GROUND_Y);
    const vAfter2 = p.velocityY;

    expect(vAfter2 - vAfter1).toBeCloseTo(GRAVITY, 5);
  });

  it('atteint un apex avant de redescendre', () => {
    const p = createPlayer();
    tryJump(p);

    let highestY = p.position.y;
    let frames = 0;
    // simuler jusqu'à atterrissage (max 200 frames pour éviter une boucle infinie)
    while (!p.onGround && frames < 200) {
      applyPhysics(p, GROUND_Y);
      if (p.position.y < highestY) highestY = p.position.y;
      frames++;
    }

    expect(p.onGround).toBe(true);
    expect(highestY).toBeLessThan(groundLineForPlayer); // a monté au-dessus du sol
    // Durée approximative d'un saut : 2 * |JUMP_VELOCITY| / GRAVITY ≈ 33 frames
    expect(frames).toBeGreaterThan(20);
    expect(frames).toBeLessThan(60);
  });

  it('atterrit pile sur le sol (pas en-dessous, pas au-dessus)', () => {
    const p = createPlayer();
    tryJump(p);
    while (!p.onGround) applyPhysics(p, GROUND_Y);
    expect(p.position.y).toBe(groundLineForPlayer);
    expect(p.velocityY).toBe(0);
  });

  it('signale justLanded = true à la frame d\'atterrissage', () => {
    const p = createPlayer();
    tryJump(p);

    let landedAt = -1;
    for (let i = 0; i < 100; i++) {
      const r = applyPhysics(p, GROUND_Y);
      if (r.justLanded) {
        landedAt = i;
        break;
      }
    }
    expect(landedAt).toBeGreaterThan(0);
    // À la frame suivante, justLanded redevient false
    const r2 = applyPhysics(p, GROUND_Y);
    expect(r2.justLanded).toBe(false);
  });

  it('rotation augmente uniquement en l\'air', () => {
    const p = createPlayer();
    tryJump(p);
    applyPhysics(p, GROUND_Y);
    const rotAir = p.rotation;
    expect(rotAir).toBeGreaterThan(0);

    // Forcer l'atterrissage
    while (!p.onGround) applyPhysics(p, GROUND_Y);
    expect(p.rotation).toBe(0); // reset au sol
  });
});

describe('applyPhysics — invariants', () => {
  it('ne mute pas la taille du joueur', () => {
    const p = createPlayer();
    const sizeBefore = p.size;
    tryJump(p);
    for (let i = 0; i < 50; i++) applyPhysics(p, GROUND_Y);
    expect(p.size).toBe(sizeBefore);
  });

  it('ne mute pas la position X du joueur (le sol défile, pas le joueur)', () => {
    const p = createPlayer();
    const xBefore = p.position.x;
    tryJump(p);
    for (let i = 0; i < 50; i++) applyPhysics(p, GROUND_Y);
    expect(p.position.x).toBe(xBefore);
  });

  it('un saut sans intervention atterrit en hauteur d\'apex prévisible', () => {
    // Formule analytique : h_max = JUMP_VELOCITY² / (2 * GRAVITY)
    // Avec JUMP_VELOCITY = -15, GRAVITY = 0.9 → h_max = 225 / 1.8 = 125 px
    const p = createPlayer();
    tryJump(p);
    let highestY = p.position.y;
    while (!p.onGround) {
      applyPhysics(p, GROUND_Y);
      if (p.position.y < highestY) highestY = p.position.y;
    }
    const apexHeight = groundLineForPlayer - highestY;
    const expectedApex = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY);
    // Tolérance : la simulation discrète peut surévaluer légèrement à cause
    // de l'ordre d'application (gravité avant mouvement).
    expect(apexHeight).toBeGreaterThan(expectedApex * 0.85);
    expect(apexHeight).toBeLessThan(expectedApex * 1.15);
  });
});
