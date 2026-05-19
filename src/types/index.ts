/**
 * Types partagés du domaine de jeu.
 *
 * Convention : on garde des types simples (pas de classes lourdes) pour pouvoir
 * tester la logique sans dépendance à Pixi ou au DOM.
 */

/** Vecteur 2D simple. */
export interface Vec2 {
  x: number;
  y: number;
}

/** Bounding box rectangle alignée sur les axes (Axis-Aligned Bounding Box). */
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** État dynamique du joueur, sans aucune dépendance Pixi. */
export interface PlayerState {
  /** Position du coin haut-gauche du cube. */
  position: Vec2;
  /** Vélocité verticale (px/frame). Négatif = montée. */
  velocityY: number;
  /** Taille du cube (largeur = hauteur). */
  size: number;
  /** True si le joueur touche le sol. */
  onGround: boolean;
  /** Rotation en radians, purement visuelle. */
  rotation: number;
  /** Cooldown restant avant de pouvoir re-sauter (en frames). */
  jumpCooldown: number;
}

/** Type discriminant pour les obstacles. */
export type ObstacleType = 'spike' | 'block';

/** Obstacle générique (spike ou block). Position du coin haut-gauche pour les blocs ;
 *  pour les spikes, (x, y) représente la base, et la pointe est en (x + w/2, y - h). */
export interface Obstacle {
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** États possibles d'une partie. */
export type GamePhase = 'menu' | 'calibrating' | 'playing' | 'gameOver';

/** Événements émis par le détecteur de trigger audio. */
export interface TriggerEvent {
  /** Timestamp ms (performance.now()) du déclenchement. */
  timestamp: number;
  /** Niveau RMS [0..100] qui a déclenché. */
  level: number;
}
