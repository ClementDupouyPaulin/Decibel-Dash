import type { AABB, Obstacle, PlayerState } from '@/types';
import { PLAYER_HITBOX_PADDING } from '@/config/world';
import { getObstacleHitbox } from '@/game/entities/Obstacle';

/**
 * CollisionSystem — détection AABB pure.
 *
 * Tout est testable sans Pixi. La hitbox du joueur est volontairement
 * "forgiving" (rétrécie de PLAYER_HITBOX_PADDING px de chaque côté) pour
 * pardonner les approximations du joueur, comportement porté du proto.
 */

/**
 * Hitbox du joueur (AABB rétrécie). Le visuel reste de taille PLAYER_SIZE.
 */
export function getPlayerHitbox(player: PlayerState): AABB {
  return {
    x: player.position.x + PLAYER_HITBOX_PADDING,
    y: player.position.y + PLAYER_HITBOX_PADDING,
    width: player.size - PLAYER_HITBOX_PADDING * 2,
    height: player.size - PLAYER_HITBOX_PADDING * 2,
  };
}

/**
 * Test d'intersection AABB classique. Strict : les frôlements pile sur le bord
 * (a.x + a.w === b.x) ne comptent PAS comme collision.
 */
export function aabbIntersect(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

/**
 * Test de collision joueur ↔ obstacle.
 */
export function checkCollision(player: PlayerState, obstacle: Obstacle): boolean {
  const playerBox = getPlayerHitbox(player);
  const obstacleBox = getObstacleHitbox(obstacle);
  return aabbIntersect(playerBox, obstacleBox);
}

/**
 * True si le joueur entre en collision avec au moins un obstacle de la liste.
 */
export function checkAnyCollision(player: PlayerState, obstacles: Obstacle[]): boolean {
  for (const o of obstacles) {
    if (checkCollision(player, o)) return true;
  }
  return false;
}
