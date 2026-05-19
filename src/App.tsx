import { HelloPixi } from '@/game/HelloPixi';

function App() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="relative">
        <HelloPixi />

        {/* Overlay React par-dessus le canvas — preuve que l'archi marche */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <div className="rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md text-xs">
            <div className="font-bold tracking-wide text-cyan-300">DECIBEL DASH</div>
            <div className="text-slate-400">Sprint 0 — Hello Pixi</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
