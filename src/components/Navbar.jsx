import {
  CloudSun,
  RefreshCw,
  LocateFixed,
  Sun,
  Moon,
  Clock3,
  Trash2,
} from "lucide-react";
import SearchBar from "./SearchBar";

function Navbar({
  city,
  setCity,
  onSearch,
  loading,
  onRefresh,
  onUseLocation,
  theme,
  onToggleTheme,
  searchHistory,
  onSelectHistory,
  onClearHistory,
}) {
  return (
    <header className="relative z-20 border-b border-white/15 bg-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-7 lg:grid lg:grid-cols-[1fr_minmax(320px,560px)_1fr] lg:items-center lg:gap-4 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-200 to-blue-400 p-2.5 text-slate-950 shadow-lg shadow-cyan-950/30">
              <CloudSun size={30} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white">
                Fore-<span className="text-cyan-300">Sky</span>
              </p>
              <p className="text-xs text-white/65">Your Weather Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Light theme" : "Dark theme"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition hover:bg-white/[0.16]"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              aria-label="Refresh weather"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition hover:bg-white/[0.16] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <SearchBar
            city={city}
            setCity={setCity}
            onSearch={onSearch}
            loading={loading}
          />

          {searchHistory.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
              <span className="mr-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                <Clock3 size={12} /> Recent
              </span>
              {searchHistory.slice(0, 4).map((historyCity) => (
                <button
                  key={historyCity}
                  type="button"
                  onClick={() => onSelectHistory(historyCity)}
                  className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs text-white/80 transition hover:bg-white/15"
                >
                  {historyCity}
                </button>
              ))}
              <button
                type="button"
                onClick={onClearHistory}
                aria-label="Clear search history"
                title="Clear search history"
                className="rounded-full p-1.5 text-white/55 transition hover:bg-white/10 hover:text-white"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={onUseLocation}
            disabled={loading}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-3 text-xs font-medium text-white backdrop-blur transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-4 sm:text-sm"
          >
            <LocateFixed size={16} />
            Use my location
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition hover:bg-white/[0.14] lg:inline-flex"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh weather"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50 lg:inline-flex"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
