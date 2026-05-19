import type { PlayerState } from '@/types';
import { GRAVITY } from '@/config/physics';

/**
 * PhysicsSystem — simule un tick de physique sur un PlayerState.
 *
 * Comportement porté du prototype HTML (`update()` du proto) :
 * 1. Applique la gravité à la vélocité verticale
 * 2. Déplace le joueur selon sa vélocité
 * 3. Si le joueur passe sous le sol : il y atterrit (y clamp, vy = 0)
 * 4. Met à jour le flag `onGround` et la rotation visuelle
 *
 * Retourne `true` si le joueur vient d'atterrir cette frame (utile pour effets/particules).
 */
export function applyPhysics(player: PlayerState, groundY: number): PhysicsTickResult {
  const wasInAir = !player.onGround;

  // 1. Gravité
  player.velocityY += GRAVITY;

  // 2. Mouvement
  player.position.y += player.velocityY;

  // 3. Test de sol
  const groundLineForPlayer = groundY - player.size;
  let justLanded = false;

  if (player.position.y >= groundLineForPlayer) {
    player.position.y = groundLineForPlayer;
    player.velocityY = 0;
    if (wasInAir) {
      justLanded = true;
    }
    player.onGround = true;
    player.rotation = 0;
  } else {
    player.onGround = false;
    // Rotation visuelle pendant le saut (radians/frame, valeur portée du proto)
    player.rotation += 0.18;
  }

  return { justLanded };
}

export interface PhysicsTickResult {
  /** True si le joueur vient juste d'atterrir lors de ce tick. */
  justLanded: boolean;
}
