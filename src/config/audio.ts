/**
 * Constantes du pipeline audio.
 *
 * Sprint 1 : portage 1:1 du proto (RMS simple + calibration sur 60 frames).
 * Sprint 2 : enrichi avec Meyda features (ZCR, MFCC, etc.).
 */

/** Taille de la FFT pour l'analyser Web Audio (puissance de 2). */
export const FFT_SIZE = 1024;

/** Smoothing time constant de l'AnalyserNode (0..1, plus haut = plus lissé). */
export const ANALYSER_SMOOTHING = 0.2;

/** Facteur de scaling pour convertir RMS [0..1] en "level" [0..100]. */
export const RMS_TO_LEVEL_SCALE = 250;

/** Lissage exponentiel appliqué au niveau micro. smoothed = α·new + (1-α)·old. */
export const LEVEL_SMOOTHING_ALPHA = 0.4;

/** Nombre de frames de calibration ambiante au démarrage. */
export const CALIBRATION_FRAMES = 60;

/** Marge ajoutée au noise floor pour déterminer le seuil par défaut. */
export const CALIBRATION_MARGIN = 18;

/** Seuil minimum acceptable même si l'ambiance est très calme. */
export const THRESHOLD_MIN = 15;

/** Seuil maximum acceptable même si l'ambiance est très bruyante. */
export const THRESHOLD_MAX = 50;

/** Contraintes getUserMedia : on désactive les traitements navigateur pour ne pas masquer les cris. */
export const MIC_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
};
