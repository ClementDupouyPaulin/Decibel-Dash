/**
 * Constantes de spawn des obstacles.
 *
 * Valeurs portées du prototype HTML, fonction `spawnObstacle()` et `update()`.
 */

/** Distance minimum entre deux spawns (px). */
export const SPAWN_GAP_MIN = 280;

/** Variation aléatoire ajoutée au gap (px). Total = MIN + random(0..VAR). */
export const SPAWN_GAP_VARIANCE = 180;

/**
 * Facteur de difficulté : score à partir duquel les gaps se resserrent.
 * Plus le score est haut, plus le gap effectif est réduit.
 * Formule : diffScale = max(0.7, 1 - score / SPAWN_DIFFICULTY_DIVISOR)
 */
export const SPAWN_DIFFICULTY_DIVISOR = 3000;

/** Plancher du diffScale : on ne resserre jamais au-delà de 70% du gap nominal. */
export const SPAWN_DIFFICULTY_FLOOR = 0.7;

/** X de spawn : on génère les obstacles juste hors écran à droite. */
export const SPAWN_X_OFFSET = 40;

/** Probabilités cumulées des patterns d'obstacles. Doivent finir à 1.0. */
export const OBSTACLE_PATTERN_WEIGHTS = {
  /** Spike unique au sol. */
  single: 0.45,
  /** 3 spikes alignés. */
  triple: 0.7,
  /** Bloc haut à sauter. */
  tallBlock: 0.88,
  /** Bloc + spike au-dessus (timing serré). */
  blockWithSpike: 1.0,
} as const;

/** Dimensions des obstacles (px). */
export const SPIKE_WIDTH = 30;
export const SPIKE_HEIGHT = 40;
export const SPIKE_HITBOX_X_PADDING = 6;
export const SPIKE_HITBOX_Y_PADDING = 4;

export const TALL_BLOCK_WIDTH = 50;
export const TALL_BLOCK_HEIGHT = 50;

export const COMPOUND_BLOCK_WIDTH = 60;
export const COMPOUND_BLOCK_HEIGHT = 40;
export const COMPOUND_SPIKE_WIDTH = 30;
export const COMPOUND_SPIKE_HEIGHT = 30;
export const COMPOUND_SPIKE_X_OFFSET = 15;
