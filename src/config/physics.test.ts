import { describe, it, expect } from 'vitest';
import {
  GRAVITY,
  JUMP_VELOCITY,
  INITIAL_SPEED,
  MAX_SPEED,
  JUMP_COOLDOWN_FRAMES,
  RESTART_COOLDOWN_FRAMES,
} from './physics';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  GROUND_Y,
  PLAYER_SIZE,
  PLAYER_X,
  PLAYER_HITBOX_PADDING,
} from './world';
import { OBSTACLE_PATTERN_WEIGHTS, SPAWN_DIFFICULTY_FLOOR } from './spawn';
import { THRESHOLD_MIN, THRESHOLD_MAX, CALIBRATION_FRAMES } from './audio';

describe('config/physics', () => {
  it('valeurs portées exactement du prototype HTML', () => {
    expect(GRAVITY).toBe(0.9);
    expect(JUMP_VELOCITY).toBe(-15);
    expect(INITIAL_SPEED).toBe(6.5);
  });

  it('cohérence saut > gravité (sinon impossible de décoller)', () => {
    expect(Math.abs(JUMP_VELOCITY)).toBeGreaterThan(GRAVITY);
  });

  it('vitesse maximale supérieure à vitesse initiale', () => {
    expect(MAX_SPEED).toBeGreaterThan(INITIAL_SPEED);
  });

  it('cooldown restart >= cooldown normal (sinon le cri de restart re-saute)', () => {
    expect(RESTART_COOLDOWN_FRAMES).toBeGreaterThanOrEqual(JUMP_COOLDOWN_FRAMES);
  });
});

describe('config/world', () => {
  it('canvas 16:9 environ', () => {
    expect(WORLD_WIDTH).toBe(960);
    expect(WORLD_HEIGHT).toBe(540);
    // Pas exactement 16:9 mais proche : 960/540 = 1.777
    expect(WORLD_WIDTH / WORLD_HEIGHT).toBeCloseTo(16 / 9, 2);
  });

  it('sol situé dans le canvas, avec marge pour décor', () => {
    expect(GROUND_Y).toBeGreaterThan(0);
    expect(GROUND_Y).toBeLessThan(WORLD_HEIGHT);
    expect(WORLD_HEIGHT - GROUND_Y).toBeGreaterThanOrEqual(40);
  });

  it('joueur dans la moitié gauche du canvas', () => {
    expect(PLAYER_X).toBeGreaterThan(0);
    expect(PLAYER_X + PLAYER_SIZE).toBeLessThan(WORLD_WIDTH / 2);
  });

  it('hitbox padding positif et raisonnable', () => {
    expect(PLAYER_HITBOX_PADDING).toBeGreaterThan(0);
    expect(PLAYER_HITBOX_PADDING * 2).toBeLessThan(PLAYER_SIZE);
  });
});

describe('config/spawn', () => {
  it('probabilités d\'obstacles strictement croissantes et finissent à 1', () => {
    const { single, triple, tallBlock, blockWithSpike } = OBSTACLE_PATTERN_WEIGHTS;
    expect(single).toBeLessThan(triple);
    expect(triple).toBeLessThan(tallBlock);
    expect(tallBlock).toBeLessThan(blockWithSpike);
    expect(blockWithSpike).toBe(1.0);
  });

  it('plancher de difficulté entre 0 et 1', () => {
    expect(SPAWN_DIFFICULTY_FLOOR).toBeGreaterThan(0);
    expect(SPAWN_DIFFICULTY_FLOOR).toBeLessThanOrEqual(1);
  });
});

describe('config/audio', () => {
  it('seuils min/max cohérents', () => {
    expect(THRESHOLD_MIN).toBeLessThan(THRESHOLD_MAX);
    expect(THRESHOLD_MIN).toBeGreaterThan(0);
    expect(THRESHOLD_MAX).toBeLessThanOrEqual(100);
  });

  it('calibration sur durée raisonnable (~1 seconde à 60fps)', () => {
    expect(CALIBRATION_FRAMES).toBeGreaterThanOrEqual(30);
    expect(CALIBRATION_FRAMES).toBeLessThanOrEqual(120);
  });
});
