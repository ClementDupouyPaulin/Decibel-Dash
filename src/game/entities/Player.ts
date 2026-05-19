import type { PlayerState } from '@/types';
import { PLAYER_SIZE, PLAYER_X, GROUND_Y } from '@/config/world';
import { JUMP_VELOCITY } from '@/config/physics';

/**
 * Player — opérations pures sur l'état du joueur.
 *
 * Pas de classe, pas de this, pas de dépendance Pixi/DOM. Toutes les fonctions
 * prennent un `PlayerState` et le mutent en place (perf 60fps) ou retournent
 * un nouvel état (factories).
 *
 * Cette séparation permet de tester la physique en quelques millisecondes
 * dans Vitest, sans aucun setup graphique.
 */

/**
 * Crée un joueur à sa position initiale, posé sur le sol.
 *
 * @param overrides Permet de surcharger n'importe quel champ pour les tests.
 */
export function createPlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    position: { x: PLAYER_X, y: GROUND_Y - PLAYER_SIZE },
    velocityY: 0,
    size: PLAYER_SIZE,
    onGround: true,
    rotation: 0,
    jumpCooldown: 0,
    ...overrides,
  };
}

/**
 * Tente de faire sauter le joueur. Sans effet si :
 * - le joueur n'est pas au sol
 * - le cooldown n'est pas écoulé
 *
 * @returns true si le saut a effectivement été déclenché.
 */
export function tryJump(player: PlayerState): boolean {
  if (!player.onGround) return false;
  if (player.jumpCooldown > 0) return false;

  player.velocityY = JUMP_VELOCITY;
  player.onGround = false;
  return true;
}

/**
 * Décrémente le cooldown de saut d'une frame. Plancher à 0.
 * À appeler une fois par tick de la game loop.
 */
export function tickCooldown(player: PlayerState): void {
  if (player.jumpCooldown > 0) {
    player.jumpCooldown -= 1;
  }
}

/**
 * Force un cooldown (utilisé après un respawn pour ignorer le cri de death-restart).
 */
export function setCooldown(player: PlayerState, frames: number): void {
  player.jumpCooldown = Math.max(0, frames);
}
