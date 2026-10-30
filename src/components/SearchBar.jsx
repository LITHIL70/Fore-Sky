import { Search } from "lucide-react";

function SearchBar({ city, setCity, onSearch, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-12 w-full items-center gap-3 rounded-full border border-white/25 bg-white/[0.09] px-4 shadow-inner shadow-white/[0.04] backdrop-blur-xl transition focus-within:border-cyan-200/60 focus-within:bg-white/[0.13]"
    >
      <Search size={20} className="shrink-0 text-white/85" />
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Search for a city..."
        aria-label="Search for a city"
        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/60"
      />
      <button
        type="submit"
        disabled={loading || !city.trim()}
        aria-label="Search weather"
        className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Search size={18} />
      </button>
    </form>
  );
}

export default SearchBar;
