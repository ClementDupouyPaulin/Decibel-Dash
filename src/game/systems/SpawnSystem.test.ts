import { describe, it, expect } from 'vitest';
import {
  pickObstaclePattern,
  createObstaclesForPattern,
  computeNextSpawnDistance,
} from './SpawnSystem';
import {
  OBSTACLE_PATTERN_WEIGHTS,
  SPAWN_GAP_MIN,
  SPAWN_GAP_VARIANCE,
  SPAWN_DIFFICULTY_FLOOR,
} from '@/config/spawn';

/** Petit helper : crée une fonction random qui retourne des valeurs prédéfinies. */
function mockRandom(...values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i % values.length] ?? 0;
    i++;
    return v;
  };
}

describe('pickObstaclePattern — distribution des patterns', () => {
  const { single, triple, tallBlock } = OBSTACLE_PATTERN_WEIGHTS;

  it('retourne "single" pour r < single', () => {
    expect(pickObstaclePattern(() => 0)).toBe('single');
    expect(pickObstaclePattern(() => single - 0.001)).toBe('single');
  });

  it('retourne "triple" pour single <= r < triple', () => {
    expect(pickObstaclePattern(() => single)).toBe('triple');
    expect(pickObstaclePattern(() => triple - 0.001)).toBe('triple');
  });

  it('retourne "tallBlock" pour triple <= r < tallBlock', () => {
    expect(pickObstaclePattern(() => triple)).toBe('tallBlock');
    expect(pickObstaclePattern(() => tallBlock - 0.001)).toBe('tallBlock');
  });

  it('retourne "blockWithSpike" pour r >= tallBlock', () => {
    expect(pickObstaclePattern(() => tallBlock)).toBe('blockWithSpike');
    expect(pickObstaclePattern(() => 0.999)).toBe('blockWithSpike');
  });

  it('respecte approximativement les probas sur un grand échantillon', () => {
    // RNG vraiment pseudo-aléatoire avec Math.random pour vérifier la stat
    const counts = { single: 0, triple: 0, tallBlock: 0, blockWithSpike: 0 };
    const N = 10_000;
    for (let i = 0; i < N; i++) {
      counts[pickObstaclePattern(Math.random)]++;
    }
    // Tolérance ±3% sur N=10000 c'est large
    expect(counts.single / N).toBeCloseTo(single, 1);
    expect((counts.single + counts.triple) / N).toBeCloseTo(triple, 1);
  });
});

describe('createObstaclesForPattern', () => {
  it('chaque pattern produit le bon nombre d\'obstacles', () => {
    expect(createObstaclesForPattern('single', 0)).toHaveLength(1);
    expect(createObstaclesForPattern('triple', 0)).toHaveLength(3);
    expect(createObstaclesForPattern('tallBlock', 0)).toHaveLength(1);
    expect(createObstaclesForPattern('blockWithSpike', 0)).toHaveLength(2);
  });

  it('tous les obstacles sont positionnés à partir de baseX', () => {
    const obs = createObstaclesForPattern('triple', 1000);
    expect(obs[0]?.x).toBe(1000);
    expect(obs.every((o) => o.x >= 1000)).toBe(true);
  });
});

describe('computeNextSpawnDistance', () => {
  it('avec random=0 et score=0 : gap minimum sans variance', () => {
    const d = computeNextSpawnDistance(0, mockRandom(0));
    expect(d).toBe(SPAWN_GAP_MIN);
  });

  it('avec random=1 et score=0 : gap max nominal', () => {
    const d = computeNextSpawnDistance(0, mockRandom(0.9999));
    expect(d).toBeCloseTo(SPAWN_GAP_MIN + SPAWN_GAP_VARIANCE, 0);
  });

  it('le gap diminue avec le score qui monte', () => {
    const dLow = computeNextSpawnDistance(0, mockRandom(0.5));
    const dHigh = computeNextSpawnDistance(1500, mockRandom(0.5));
    expect(dHigh).toBeLessThan(dLow);
  });

  it('le gap est planché à SPAWN_DIFFICULTY_FLOOR du gap nominal, même à score énorme', () => {
    const dNominal = computeNextSpawnDistance(0, mockRandom(0.5));
    const dCrazyScore = computeNextSpawnDistance(999_999, mockRandom(0.5));
    expect(dCrazyScore).toBeCloseTo(dNominal * SPAWN_DIFFICULTY_FLOOR, 0);
  });
});
