import type { Obstacle } from '@/types';
import {
  OBSTACLE_PATTERN_WEIGHTS,
  SPAWN_GAP_MIN,
  SPAWN_GAP_VARIANCE,
  SPAWN_DIFFICULTY_DIVISOR,
  SPAWN_DIFFICULTY_FLOOR,
} from '@/config/spawn';
import {
  createSingleSpike,
  createTripleSpike,
  createTallBlock,
  createBlockWithSpike,
} from '@/game/entities/Obstacle';

/**
 * SpawnSystem — décide quoi spawner et quand.
 *
 * Le RNG est INJECTÉ (paramètre `random`) pour permettre des tests
 * déterministes. En prod : `Math.random`. En test : un mock qui retourne
 * une suite de valeurs choisies.
 */

export type RandomFn = () => number;

export type ObstaclePattern = 'single' | 'triple' | 'tallBlock' | 'blockWithSpike';

/**
 * Sélectionne un pattern selon les poids définis dans config/spawn.ts.
 * Retourne le pattern correspondant à la valeur aléatoire passée [0..1).
 */
export function pickObstaclePattern(random: RandomFn): ObstaclePattern {
  const r = random();
  const w = OBSTACLE_PATTERN_WEIGHTS;
  if (r < w.single) return 'single';
  if (r < w.triple) return 'triple';
  if (r < w.tallBlock) return 'tallBlock';
  return 'blockWithSpike';
}

/**
 * Crée la liste d'obstacles pour un pattern donné, à la position baseX.
 */
export function createObstaclesForPattern(pattern: ObstaclePattern, baseX: number): Obstacle[] {
  switch (pattern) {
    case 'single':
      return createSingleSpike(baseX);
    case 'triple':
      return createTripleSpike(baseX);
    case 'tallBlock':
      return createTallBlock(baseX);
    case 'blockWithSpike':
      return createBlockWithSpike(baseX);
  }
}

/**
 * Calcule la distance avant le prochain spawn (en pixels), avec ramp de difficulté
 * basé sur le score actuel.
 *
 * Formule portée du proto : baseGap = MIN + random * VARIANCE, puis ×diffScale.
 */
export function computeNextSpawnDistance(score: number, random: RandomFn): number {
  const baseGap = SPAWN_GAP_MIN + random() * SPAWN_GAP_VARIANCE;
  const diffScale = Math.max(SPAWN_DIFFICULTY_FLOOR, 1 - score / SPAWN_DIFFICULTY_DIVISOR);
  return baseGap * diffScale;
}
