import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import { getWeatherByCity } from "./services/weatherService";

function App() {
  const [city, setCity] = useState("Hyderabad");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWeather(cityToSearch = city) {
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
    } catch (err) {
      setError(err.message || "Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather("Hyderabad");
    // Load the default city once when the app starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Your weather at a glance</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Weather dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Search a city to see current conditions and the forecast.</p>
          </div>
          {weatherData && (
            <button
              type="button"
              onClick={() => loadWeather(weatherData.cityName)}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </section>

        <SearchBar city={city} setCity={setCity} onSearch={() => loadWeather(city)} loading={loading} />

        {error && (
          <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading && !weatherData && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center text-slate-300">
            Loading weather...
          </div>
        )}

        {weatherData && (
          <>
            <CurrentWeather
              weather={weatherData.currentWeather}
              city={weatherData.cityName}
              country={weatherData.country}
            />
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Weather details</h2>
                <p className="mt-1 text-sm text-slate-400">More about the conditions right now.</p>
              </div>
              <WeatherDetails weather={weatherData.currentWeather} />
            </section>
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Forecast</h2>
                <p className="mt-1 text-sm text-slate-400">Upcoming hours and the next five days.</p>
              </div>
              <Forecast forecast={weatherData.forecast} />
            </section>
          </>
        )}

        <footer className="border-t border-white/10 pt-5 text-center text-xs text-slate-500">
          Weather data provided by OpenWeather.
        </footer>
      </main>
    </div>
  );
}

export default App;
