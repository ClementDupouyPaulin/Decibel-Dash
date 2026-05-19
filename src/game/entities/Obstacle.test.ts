import { describe, it, expect } from 'vitest';
import {
  createSingleSpike,
  createTripleSpike,
  createTallBlock,
  createBlockWithSpike,
  getObstacleHitbox,
  moveObstacle,
  isOffscreenLeft,
} from './Obstacle';
import { GROUND_Y } from '@/config/world';
import {
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  SPIKE_HITBOX_X_PADDING,
  SPIKE_HITBOX_Y_PADDING,
  TALL_BLOCK_HEIGHT,
  COMPOUND_BLOCK_HEIGHT,
  COMPOUND_BLOCK_WIDTH,
  COMPOUND_SPIKE_X_OFFSET,
} from '@/config/spawn';

describe('createSingleSpike', () => {
  it('crée un seul spike posé au sol', () => {
    const obs = createSingleSpike(500);
    expect(obs).toHaveLength(1);
    expect(obs[0]).toMatchObject({
      type: 'spike',
      x: 500,
      y: GROUND_Y,
      width: SPIKE_WIDTH,
      height: SPIKE_HEIGHT,
    });
  });
});

describe('createTripleSpike', () => {
  it('crée 3 spikes alignés', () => {
    const obs = createTripleSpike(100);
    expect(obs).toHaveLength(3);
    expect(obs[0]?.x).toBe(100);
    expect(obs[1]?.x).toBe(100 + SPIKE_WIDTH);
    expect(obs[2]?.x).toBe(100 + SPIKE_WIDTH * 2);
    expect(obs.every((o) => o.type === 'spike')).toBe(true);
  });
});

describe('createTallBlock', () => {
  it('crée un bloc qui touche le sol par sa base', () => {
    const obs = createTallBlock(200);
    expect(obs).toHaveLength(1);
    const block = obs[0]!;
    expect(block.type).toBe('block');
    expect(block.y + block.height).toBe(GROUND_Y);
    expect(block.height).toBe(TALL_BLOCK_HEIGHT);
  });
});

describe('createBlockWithSpike', () => {
  it('crée un bloc + un spike posé sur le dessus', () => {
    const obs = createBlockWithSpike(300);
    expect(obs).toHaveLength(2);
    const block = obs[0]!;
    const spike = obs[1]!;
    expect(block.type).toBe('block');
    expect(spike.type).toBe('spike');
    // Le spike a sa base au sommet du bloc
    expect(spike.y).toBe(GROUND_Y - COMPOUND_BLOCK_HEIGHT);
    // Le spike est décalé vers la droite (pas collé au bord gauche du bloc)
    expect(spike.x).toBe(300 + COMPOUND_SPIKE_X_OFFSET);
    // Le spike est bien sur le bloc (pas en dehors)
    expect(spike.x).toBeGreaterThanOrEqual(block.x);
    expect(spike.x + spike.width).toBeLessThanOrEqual(block.x + COMPOUND_BLOCK_WIDTH);
  });
});

describe('getObstacleHitbox', () => {
  it('pour un block : retourne le rectangle entier', () => {
    const block = createTallBlock(100)[0]!;
    const hitbox = getObstacleHitbox(block);
    expect(hitbox).toEqual({
      x: block.x,
      y: block.y,
      width: block.width,
      height: block.height,
    });
  });

  it('pour un spike : retourne une AABB rétrécie (forgiving)', () => {
    const spike = createSingleSpike(100)[0]!;
    const hitbox = getObstacleHitbox(spike);
    expect(hitbox.x).toBe(spike.x + SPIKE_HITBOX_X_PADDING);
    expect(hitbox.width).toBe(spike.width - SPIKE_HITBOX_X_PADDING * 2);
    expect(hitbox.height).toBe(spike.height - SPIKE_HITBOX_Y_PADDING);
    // La pointe du spike est en haut : hitbox.y = base - height
    expect(hitbox.y).toBe(spike.y - spike.height);
  });
});

describe('moveObstacle', () => {
  it('décale x vers la gauche', () => {
    const obs = createSingleSpike(500)[0]!;
    moveObstacle(obs, 10);
    expect(obs.x).toBe(490);
  });
});

describe('isOffscreenLeft', () => {
  it('false si l\'obstacle est encore visible', () => {
    const obs = createSingleSpike(50)[0]!;
    expect(isOffscreenLeft(obs)).toBe(false);
  });

  it('true si l\'obstacle est complètement sorti à gauche', () => {
    const obs = createSingleSpike(-100)[0]!;
    expect(isOffscreenLeft(obs)).toBe(true);
  });

  it('respecte la marge configurable', () => {
    const obs = createSingleSpike(-25)[0]!;
    // width=30, donc x+w = 5, qui est > -20 (marge par défaut) → pas offscreen
    expect(isOffscreenLeft(obs, 20)).toBe(false);
    // Avec marge à 0, x+w=5 > 0, pas offscreen non plus
    expect(isOffscreenLeft(obs, 0)).toBe(false);
    // Avec marge à 100, x+w=5 > -100 → pas offscreen
    expect(isOffscreenLeft(obs, 100)).toBe(false);
  });
});
