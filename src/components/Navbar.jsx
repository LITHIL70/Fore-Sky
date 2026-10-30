import { CloudSun } from "lucide-react";

function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/15 p-2.5 text-sky-300"><CloudSun size={27} /></div>
          <div>
            <p className="text-xl font-bold tracking-wide text-white">Fore-Sky</p>
            <p className="text-xs text-slate-400">Weather, made clearer</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live weather dashboard
        </div>
      </div>
    </header>
  );
}
export default Navbar;