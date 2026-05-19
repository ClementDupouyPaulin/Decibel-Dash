import type { AABB, Obstacle } from '@/types';
import { GROUND_Y } from '@/config/world';
import {
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  SPIKE_HITBOX_X_PADDING,
  SPIKE_HITBOX_Y_PADDING,
  TALL_BLOCK_WIDTH,
  TALL_BLOCK_HEIGHT,
  COMPOUND_BLOCK_WIDTH,
  COMPOUND_BLOCK_HEIGHT,
  COMPOUND_SPIKE_WIDTH,
  COMPOUND_SPIKE_HEIGHT,
  COMPOUND_SPIKE_X_OFFSET,
} from '@/config/spawn';

/**
 * Obstacle — factories et helpers purs (pas de Pixi).
 *
 * Convention de coordonnées :
 * - block : (x, y) est le coin haut-gauche du rectangle
 * - spike : (x, y) est la base GAUCHE du triangle, la pointe est à (x + w/2, y - h)
 *
 * Cette convention est portée du prototype HTML pour faciliter la migration.
 */

// ---------------------------------------------------------------------------
// Factories de patterns (retournent un tableau d'obstacles)
// ---------------------------------------------------------------------------

/**
 * Pattern "single" : un seul spike au sol.
 */
export function createSingleSpike(baseX: number): Obstacle[] {
  return [
    {
      type: 'spike',
      x: baseX,
      y: GROUND_Y,
      width: SPIKE_WIDTH,
      height: SPIKE_HEIGHT,
    },
  ];
}

/**
 * Pattern "triple" : 3 spikes côte à côte.
 */
export function createTripleSpike(baseX: number): Obstacle[] {
  const spikes: Obstacle[] = [];
  for (let i = 0; i < 3; i++) {
    spikes.push({
      type: 'spike',
      x: baseX + i * SPIKE_WIDTH,
      y: GROUND_Y,
      width: SPIKE_WIDTH,
      height: SPIKE_HEIGHT,
    });
  }
  return spikes;
}

/**
 * Pattern "tallBlock" : un bloc haut à sauter.
 */
export function createTallBlock(baseX: number): Obstacle[] {
  return [
    {
      type: 'block',
      x: baseX,
      y: GROUND_Y - TALL_BLOCK_HEIGHT,
      width: TALL_BLOCK_WIDTH,
      height: TALL_BLOCK_HEIGHT,
    },
  ];
}

/**
 * Pattern "blockWithSpike" : un bloc bas avec un spike sur le dessus.
 * Timing serré : le joueur doit sauter par-dessus le tout sans toucher la pointe.
 */
export function createBlockWithSpike(baseX: number): Obstacle[] {
  return [
    {
      type: 'block',
      x: baseX,
      y: GROUND_Y - COMPOUND_BLOCK_HEIGHT,
      width: COMPOUND_BLOCK_WIDTH,
      height: COMPOUND_BLOCK_HEIGHT,
    },
    {
      type: 'spike',
      x: baseX + COMPOUND_SPIKE_X_OFFSET,
      y: GROUND_Y - COMPOUND_BLOCK_HEIGHT,
      width: COMPOUND_SPIKE_WIDTH,
      height: COMPOUND_SPIKE_HEIGHT,
    },
  ];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Calcule l'AABB de collision (hitbox) d'un obstacle.
 *
 * Pour un block : c'est le rectangle entier.
 * Pour un spike : c'est un rectangle SHRUNK pour pardonner — le triangle réel
 * est plus petit que sa bounding box visuelle, donc on rétrécit la hitbox.
 *
 * Valeurs portées du prototype HTML (`collides()` du proto).
 */
export function getObstacleHitbox(o: Obstacle): AABB {
  if (o.type === 'block') {
    return { x: o.x, y: o.y, width: o.width, height: o.height };
  }
  // spike : base au sol = (x, y), pointe vers le haut
  return {
    x: o.x + SPIKE_HITBOX_X_PADDING,
    y: o.y - o.height,
    width: o.width - SPIKE_HITBOX_X_PADDING * 2,
    height: o.height - SPIKE_HITBOX_Y_PADDING,
  };
}

/**
 * Décale un obstacle vers la gauche (scrolling du monde).
 * Mute en place pour les performances.
 */
export function moveObstacle(o: Obstacle, dx: number): void {
  o.x -= dx;
}

/**
 * True si l'obstacle est entièrement sorti à gauche de l'écran.
 * Utilisé pour le garbage-collect des obstacles passés.
 */
export function isOffscreenLeft(o: Obstacle, margin = 20): boolean {
  return o.x + o.width < -margin;
}
