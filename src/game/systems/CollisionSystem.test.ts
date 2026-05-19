import { describe, it, expect } from 'vitest';
import {
  getPlayerHitbox,
  aabbIntersect,
  checkCollision,
  checkAnyCollision,
} from './CollisionSystem';
import { createPlayer } from '@/game/entities/Player';
import { createSingleSpike, createTallBlock } from '@/game/entities/Obstacle';
import { PLAYER_HITBOX_PADDING, PLAYER_SIZE } from '@/config/world';
import type { AABB } from '@/types';

describe('getPlayerHitbox', () => {
  it('retourne une hitbox shrunk de PLAYER_HITBOX_PADDING px de chaque côté', () => {
    const p = createPlayer();
    const hb = getPlayerHitbox(p);
    expect(hb.x).toBe(p.position.x + PLAYER_HITBOX_PADDING);
    expect(hb.y).toBe(p.position.y + PLAYER_HITBOX_PADDING);
    expect(hb.width).toBe(PLAYER_SIZE - PLAYER_HITBOX_PADDING * 2);
    expect(hb.height).toBe(PLAYER_SIZE - PLAYER_HITBOX_PADDING * 2);
  });
});

describe('aabbIntersect', () => {
  const a: AABB = { x: 0, y: 0, width: 10, height: 10 };

  it('détecte un overlap franc', () => {
    const b: AABB = { x: 5, y: 5, width: 10, height: 10 };
    expect(aabbIntersect(a, b)).toBe(true);
  });

  it('détecte qu\'un AABB est entièrement contenu dans l\'autre', () => {
    const inner: AABB = { x: 2, y: 2, width: 4, height: 4 };
    expect(aabbIntersect(a, inner)).toBe(true);
    expect(aabbIntersect(inner, a)).toBe(true);
  });

  it('false quand séparés horizontalement', () => {
    const right: AABB = { x: 100, y: 0, width: 10, height: 10 };
    expect(aabbIntersect(a, right)).toBe(false);
  });

  it('false quand séparés verticalement', () => {
    const above: AABB = { x: 0, y: -100, width: 10, height: 10 };
    expect(aabbIntersect(a, above)).toBe(false);
  });

  it('frôlement strict (bords pile collés) NE compte PAS comme collision', () => {
    // a se termine à x=10, b commence à x=10 → pas d'overlap strict
    const touching: AABB = { x: 10, y: 0, width: 10, height: 10 };
    expect(aabbIntersect(a, touching)).toBe(false);
  });

  it('1 pixel d\'overlap compte comme collision', () => {
    const oneOverlap: AABB = { x: 9, y: 0, width: 10, height: 10 };
    expect(aabbIntersect(a, oneOverlap)).toBe(true);
  });
});

describe('checkCollision — joueur ↔ block', () => {
  it('collision franche', () => {
    const p = createPlayer();
    // Spawn un bloc pile à la position du joueur
    const block = createTallBlock(p.position.x)[0]!;
    expect(checkCollision(p, block)).toBe(true);
  });

  it('pas de collision quand le bloc est loin', () => {
    const p = createPlayer();
    const block = createTallBlock(p.position.x + 500)[0]!;
    expect(checkCollision(p, block)).toBe(false);
  });
});

describe('checkCollision — hitbox forgiving sur spikes', () => {
  it('pas de collision quand le joueur effleure le bord visuel du spike', () => {
    const p = createPlayer();
    // On positionne un spike tel que son rectangle visuel touche pile le joueur
    // mais que la hitbox shrunk ne touche pas.
    // Joueur en x=160 (PLAYER_X), largeur 40 → bord droit visuel à 200.
    // Spike width 30, hitbox padding X = 6 de chaque côté → hitbox commence à spike.x + 6.
    // On veut que spike.x + 6 >= 200 → spike.x >= 194.
    // Si spike.x = 195, le rectangle visuel commence à 195 (overlap visuel 200-195=5px)
    // mais la hitbox commence à 201 (pas d'overlap avec la hitbox du joueur).
    // Hitbox joueur va de 164 à 196 (padding=4), spike hitbox de 201 à 219 → no collision.
    const spike = createSingleSpike(195)[0]!;
    expect(checkCollision(p, spike)).toBe(false);
  });

  it('collision quand le joueur est franchement dans le spike', () => {
    const p = createPlayer();
    // Spike pile sur le joueur (mêmes X), au sol → hitbox spike couvre la zone du joueur
    const spike = createSingleSpike(p.position.x)[0]!;
    expect(checkCollision(p, spike)).toBe(true);
  });

  it('pas de collision quand le joueur saute par-dessus le spike', () => {
    // Joueur très haut (en plein saut)
    const p = createPlayer({ position: { x: 160, y: 100 } });
    const spike = createSingleSpike(p.position.x)[0]!;
    // Hitbox joueur en y=104..136. Hitbox spike : y = GROUND_Y - 40 = 420, hauteur 36.
    // Pas d'overlap vertical.
    expect(checkCollision(p, spike)).toBe(false);
  });
});

describe('checkAnyCollision', () => {
  it('false sur liste vide', () => {
    const p = createPlayer();
    expect(checkAnyCollision(p, [])).toBe(false);
  });

  it('true dès qu\'un obstacle entre en collision', () => {
    const p = createPlayer();
    const safe = createTallBlock(1000)[0]!;
    const danger = createTallBlock(p.position.x)[0]!;
    expect(checkAnyCollision(p, [safe, danger])).toBe(true);
  });

  it('false si tous les obstacles sont loin', () => {
    const p = createPlayer();
    const obstacles = [
      createTallBlock(500)[0]!,
      createTallBlock(800)[0]!,
      createTallBlock(1200)[0]!,
    ];
    expect(checkAnyCollision(p, obstacles)).toBe(false);
  });
});
