import { describe, it, expect } from 'vitest';
import { createPlayer, tryJump, tickCooldown, setCooldown } from './Player';
import { JUMP_VELOCITY } from '@/config/physics';
import { PLAYER_SIZE, PLAYER_X, GROUND_Y } from '@/config/world';

describe('createPlayer', () => {
  it('crée un joueur posé au sol, sans vélocité', () => {
    const p = createPlayer();
    expect(p.position.x).toBe(PLAYER_X);
    expect(p.position.y).toBe(GROUND_Y - PLAYER_SIZE);
    expect(p.velocityY).toBe(0);
    expect(p.onGround).toBe(true);
    expect(p.rotation).toBe(0);
    expect(p.jumpCooldown).toBe(0);
    expect(p.size).toBe(PLAYER_SIZE);
  });

  it('accepte des overrides pour les tests', () => {
    const p = createPlayer({ jumpCooldown: 5, velocityY: -3 });
    expect(p.jumpCooldown).toBe(5);
    expect(p.velocityY).toBe(-3);
    // Le reste a ses valeurs par défaut
    expect(p.onGround).toBe(true);
  });
});

describe('tryJump', () => {
  it('saute quand au sol et cooldown à 0', () => {
    const p = createPlayer();
    const jumped = tryJump(p);
    expect(jumped).toBe(true);
    expect(p.velocityY).toBe(JUMP_VELOCITY);
    expect(p.onGround).toBe(false);
  });

  it('ne saute pas si déjà en l\'air', () => {
    const p = createPlayer({ onGround: false, velocityY: -5 });
    const jumped = tryJump(p);
    expect(jumped).toBe(false);
    expect(p.velocityY).toBe(-5); // inchangé
  });

  it('ne saute pas si cooldown > 0', () => {
    const p = createPlayer({ jumpCooldown: 3 });
    const jumped = tryJump(p);
    expect(jumped).toBe(false);
    expect(p.velocityY).toBe(0);
  });

  it('après un saut, le joueur n\'est plus au sol', () => {
    const p = createPlayer();
    tryJump(p);
    // Sans physique appliquée, il est juste marqué en l'air ; la position bouge à l'applyPhysics
    expect(p.onGround).toBe(false);
  });
});

describe('tickCooldown', () => {
  it('décrémente le cooldown d\'une frame', () => {
    const p = createPlayer({ jumpCooldown: 8 });
    tickCooldown(p);
    expect(p.jumpCooldown).toBe(7);
  });

  it('ne descend jamais sous 0', () => {
    const p = createPlayer({ jumpCooldown: 0 });
    tickCooldown(p);
    expect(p.jumpCooldown).toBe(0);
  });

  it('cooldown atteint 0 après N appels', () => {
    const p = createPlayer({ jumpCooldown: 5 });
    for (let i = 0; i < 5; i++) tickCooldown(p);
    expect(p.jumpCooldown).toBe(0);
  });
});

describe('setCooldown', () => {
  it('définit le cooldown au nombre passé', () => {
    const p = createPlayer();
    setCooldown(p, 20);
    expect(p.jumpCooldown).toBe(20);
  });

  it('clamp à 0 si valeur négative', () => {
    const p = createPlayer({ jumpCooldown: 5 });
    setCooldown(p, -3);
    expect(p.jumpCooldown).toBe(0);
  });
});
