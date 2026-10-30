import { Search, MapPin } from "lucide-react";

function SearchBar({ city, setCity, onSearch, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 shadow-lg shadow-black/10">
        <MapPin size={19} className="shrink-0 text-sky-300" />
        <input type="text" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Search for a city..." aria-label="City name" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
      </label>
      <button type="submit" disabled={loading || !city.trim()} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sky-400 px-7 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50">
        <Search size={18} /> {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
export default SearchBar;