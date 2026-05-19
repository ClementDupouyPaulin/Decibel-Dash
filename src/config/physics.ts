/**
 * Constantes physiques du jeu.
 *
 * Valeurs portées 1:1 depuis `voice_geometry_dash.html` (proto) pour garantir
 * un comportement identique avant/après migration. Toute modification ici
 * doit être justifiée et documentée dans `claude-brain/decibel-dash/decisions.md`.
 */

/** Accélération gravitationnelle appliquée à chaque frame (px/frame²). */
export const GRAVITY = 0.9;

/** Vélocité verticale initiale lors d'un saut (négatif = vers le haut, px/frame). */
export const JUMP_VELOCITY = -15;

/** Vitesse horizontale de défilement initiale (px/frame). */
export const INITIAL_SPEED = 6.5;

/** Vitesse maximale atteinte avec le ramping de difficulté. */
export const MAX_SPEED = 9.5;

/**
 * Facteur de ramping : score auquel on atteint approximativement MAX_SPEED.
 * Formule : speed = INITIAL_SPEED + min(MAX_SPEED - INITIAL_SPEED, score / SPEED_RAMP_DIVISOR)
 */
export const SPEED_RAMP_DIVISOR = 400;

/** Cooldown minimum (en frames) entre deux sauts, évite la triple-détection sur un seul cri. */
export const JUMP_COOLDOWN_FRAMES = 8;

/** Cooldown spécial appliqué juste après un respawn (le cri de death-restart ne re-saute pas). */
export const RESTART_COOLDOWN_FRAMES = 20;
