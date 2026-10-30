import { CloudSun, Circle } from "lucide-react";

function Navbar() {
  return (
    <header className="border-b border-white/[0.07] bg-[#071321]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/15 bg-gradient-to-br from-cyan-300/20 to-blue-500/10 p-2.5 text-cyan-200 shadow-lg shadow-cyan-950/20">
            <CloudSun size={25} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Fore-Sky</p>
            <p className="text-[11px] tracking-wide text-slate-500">A clearer kind of forecast</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200">
          <Circle size={7} className="fill-emerald-300 text-emerald-300" />
          Weather station
        </div>
      </div>
    </header>
  );
}

export default Navbar;
