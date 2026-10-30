import { useEffect, useState } from "react";
import { Cloud, RefreshCw } from "lucide-react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import { getWeatherByCity } from "./services/weatherService";

function App() {
  const [city, setCity] = useState("Hyderabad");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(cityToSearch) {
    if (!cityToSearch.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getWeatherByCity(cityToSearch.trim());
      setWeatherData(data);
      setCity(data.cityName);
    } catch (requestError) {
      setWeatherData(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchWeather("Hyderabad");
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Your weather, at a glance</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Weather dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Find current conditions and the forecast for any city.</p>
          </div>
          {weatherData && !loading && (
            <button type="button" onClick={() => searchWeather(city)} className="flex items-center gap-2 self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 sm:self-auto">
              <RefreshCw size={15} /> Refresh
            </button>
          )}
        </div>
        <div className="mb-6">
          <SearchBar city={city} setCity={setCity} onSearch={() => searchWeather(city)} loading={loading} />
        </div>
        {error && <div role="alert" className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/50">
            <div className="rounded-full bg-sky-400/10 p-4 text-sky-300"><Cloud size={30} className="animate-pulse" /></div>
            <p className="text-sm text-slate-300">Getting the latest weather...</p>
          </div>
        )}
        {!loading && weatherData && (
          <div className="space-y-7">
            <CurrentWeather weather={weatherData.currentWeather} city={weatherData.cityName} country={weatherData.country} />
            <section>
              <h2 className="mb-4 text-lg font-semibold text-white">Weather details</h2>
              <WeatherDetails weather={weatherData.currentWeather} />
            </section>
            <Forecast forecast={weatherData.forecast} />
          </div>
        )}
        {!loading && !weatherData && !error && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-10 text-center">
            <Cloud size={34} className="mx-auto text-sky-300" />
            <p className="mt-3 text-slate-300">Search for a city to see its weather.</p>
          </div>
        )}
        <footer className="mt-10 border-t border-white/10 py-5 text-center text-xs text-slate-500">
          Weather data provided by OpenWeather. Forecast readings are available in 3-hour intervals.
        </footer>
      </main>
    </div>
  );
}

export default App;