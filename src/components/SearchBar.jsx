import { Search, MapPin } from "lucide-react";

function SearchBar({ city, setCity, onSearch, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 transition focus-within:border-cyan-300/40 focus-within:bg-white/[0.07]">
        <MapPin size={17} className="shrink-0 text-cyan-200" />
        <input type="text" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Find a city..." aria-label="City name" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
      </label>
      <button type="submit" disabled={loading || !city.trim()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
        <Search size={16} /> {loading ? "Searching..." : "Explore"}
      </button>
    </form>
  );
}

export default SearchBar;
