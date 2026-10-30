import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-[#071321] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-cyan-500/[0.09] blur-[120px]" />
        <div className="absolute -right-40 top-[28rem] h-96 w-96 rounded-full bg-blue-600/[0.10] blur-[130px]" />
      </div>
      <div className="relative">
        <Navbar />
        <main className="mx-auto flex max-w-5xl flex-col gap-7 px-4 py-8 sm:px-6 lg:py-10">
          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-200">
                <Sparkles size={13} /> YOUR PERSONAL WEATHER SPACE
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Weather, at a glance<span className="text-cyan-300">.</span></h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">A little clarity for whatever the day brings. Search a city to explore its skies.</p>
            </div>
            {weatherData && (
              <button type="button" onClick={() => loadWeather(weatherData.cityName)} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 disabled:opacity-50 sm:self-auto">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Update weather
              </button>
            )}
          </section>

          <div className="max-w-2xl">
            <SearchBar city={city} setCity={setCity} onSearch={() => loadWeather(city)} loading={loading} />
          </div>

          {error && <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">{error}</div>}
          {loading && !weatherData && <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-300">Gathering the latest weather...</div>}

          {weatherData && (
            <>
              <CurrentWeather weather={weatherData.currentWeather} city={weatherData.cityName} country={weatherData.country} />
              <section>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">The little details</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Around you</h2>
                  </div>
                  <p className="text-xs text-slate-500">Live conditions</p>
                </div>
                <WeatherDetails weather={weatherData.currentWeather} />
              </section>
              <section>
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">Plan a little ahead</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">The forecast</h2>
                </div>
                <Forecast forecast={weatherData.forecast} />
              </section>
            </>
          )}

          <footer className="mt-2 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] py-5 text-xs text-slate-500 sm:flex-row">
            <span>Made for curious skies · Fore-Sky</span>
            <span>Weather data by OpenWeather</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
