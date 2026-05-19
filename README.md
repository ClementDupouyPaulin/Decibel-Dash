# Decibel Dash

> Geometry Dash piloté à la voix. Crie, claque, fais "ha!" pour sauter. Aucun clavier, aucune souris.

Projet portfolio dans le cadre des candidatures Master IA Sophia-Antipolis.
Démonstration : audio temps réel, classification embarquée (TensorFlow.js), rendu WebGL 60fps.

## Stack

- **Vite** + **React 19** + **TypeScript strict**
- **PixiJS v8** (WebGL) pour le rendu jeu
- **Tailwind CSS v4** pour l'overlay UI
- **Zustand** pour le state global
- **Web Audio API** + **Meyda** pour l'extraction features
- **TensorFlow.js** pour la classification (à venir Sprint 3)

## Démarrer

```bash
pnpm install
pnpm dev
```

Ouvre http://localhost:5173

## Scripts

| Commande | Effet |
|----------|-------|
| `pnpm dev` | Serveur de dev Vite |
| `pnpm build` | Build prod typecheck + Vite |
| `pnpm preview` | Sert le build prod en local |
| `pnpm lint` | ESLint strict |
| `pnpm typecheck` | TS sans émission |
| `pnpm test` | Vitest une passe |
| `pnpm test:watch` | Vitest watch |
| `pnpm format` | Prettier write |

## Architecture (cible)

```
src/
├── audio/       Capture, features Meyda, classifier TF.js, trigger
├── game/        Engine Pixi, scènes, entités, systèmes
├── ml/          Scripts training (séparé du runtime)
├── ui/          Overlays React (menus, HUD)
├── store/       Zustand
├── config/      Constantes physique, biomes, audio
└── types/
```

Détails dans [`docs/architecture.md`](./docs/architecture.md) (à venir).

## Roadmap

- [x] **Sprint 0** — Setup repo, stack opérationnelle, Hello Pixi
- [ ] **Sprint 1** — Migration prototype HTML → archi Pixi+TS modulaire
- [ ] **Sprint 2** — Pipeline audio Meyda + détection robuste
- [ ] **Sprint 3** — Classifier ML (PyTorch → TF.js)
- [ ] **Sprint 4** — Système de niveaux JSON + biomes complets
- [ ] **Sprint 5** — Polish, déploiement Vercel, démo vidéo

## Licence

Code MIT, projet personnel.
