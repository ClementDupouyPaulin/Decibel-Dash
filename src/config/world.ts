/**
 * Constantes du monde de jeu : dimensions du canvas, position du sol, taille du joueur.
 *
 * Valeurs portées 1:1 depuis le prototype HTML.
 */

/** Largeur logique du canvas en pixels. */
export const WORLD_WIDTH = 960;

/** Hauteur logique du canvas en pixels. */
export const WORLD_HEIGHT = 540;

/** Distance en pixels entre le haut du canvas et le niveau du sol. */
export const GROUND_HEIGHT_FROM_TOP = WORLD_HEIGHT - 80;

/** Y du sol, où la base du joueur repose. */
export const GROUND_Y = GROUND_HEIGHT_FROM_TOP;

/** Taille (largeur = hauteur) du cube joueur en pixels. */
export const PLAYER_SIZE = 40;

/** Position X fixe du joueur (le monde défile, pas le joueur). */
export const PLAYER_X = 160;

/** Tolérance en pixels appliquée sur la hitbox du joueur pour collisions "forgiving". */
export const PLAYER_HITBOX_PADDING = 4;
