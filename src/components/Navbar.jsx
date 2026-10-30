import { CloudSun, RefreshCw } from "lucide-react";
import SearchBar from "./SearchBar";

function Navbar({ city, setCity, onSearch, loading, onRefresh }) {
  return (
    <header className="relative z-10 border-b border-white/15 bg-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-7 lg:grid-cols-[1fr_minmax(320px,560px)_1fr] lg:px-10">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-200 to-blue-400 p-2.5 text-slate-950 shadow-lg shadow-cyan-950/30">
            <CloudSun size={30} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-white">Fore-<span className="text-cyan-300">Sky</span></p>
            <p className="text-xs text-white/65">Your Weather Companion</p>
          </div>
        </div>

        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={onSearch}
          loading={loading}
        />

        <div className="flex items-center justify-start lg:justify-end">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh weather
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
