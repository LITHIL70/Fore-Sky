import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import AirQuality from "./components/AirQuality";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import { getWeatherByCity } from "./services/weatherService";

function getWeatherTheme(weather) {
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || "clouds";
  const isNight = weather?.weather?.[0]?.icon?.endsWith("n");
  if (isNight) return "night";
  if (condition.includes("thunder")) return "stormy";
  if (condition.includes("rain") || condition.includes("drizzle")) return "rainy";
  if (condition.includes("snow")) return "snowy";
  if (condition.includes("clear")) return "sunny";
  return "cloudy";
}

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

  const theme = getWeatherTheme(weatherData?.currentWeather);

  return (
    <div className={"weather-scene " + theme + " relative min-h-screen overflow-hidden text-slate-100"}>
      <div className="pointer-events-none fixed inset-0 bg-slate-950/20" />
      <div className="relative">
        <Navbar />
        <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:py-8">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-slate-950/20 px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-100 backdrop-blur">
                <Sparkles size={13} /> YOUR PERSONAL WEATHER SPACE
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Weather, at a glance<span className="text-cyan-300">.</span></h1>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-200/75">A little clarity for whatever the day brings. Search a city to explore its skies.</p>
            </div>
            {weatherData && (
              <button type="button" onClick={() => loadWeather(weatherData.cityName)} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-slate-950/20 px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 disabled:opacity-50 sm:self-auto">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Update weather
              </button>
            )}
          </section>

          <div className="max-w-2xl">
            <SearchBar city={city} setCity={setCity} onSearch={() => loadWeather(city)} loading={loading} />
          </div>

          {error && <div role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-950/40 px-5 py-4 text-sm text-rose-100 backdrop-blur">{error}</div>}
          {loading && !weatherData && <div className="glass-panel rounded-3xl p-10 text-center text-slate-200">Gathering the latest weather...</div>}

          {weatherData && (
            <>
              <section className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
                <CurrentWeather weather={weatherData.currentWeather} city={weatherData.cityName} country={weatherData.country} />
                <AirQuality airQuality={weatherData.airQuality} />
              </section>

              <WeatherDetails weather={weatherData.currentWeather} />

              <section>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/80">Plan a little ahead</p><h2 className="mt-1 text-xl font-semibold text-white">The forecast</h2></div>
                </div>
                <Forecast forecast={weatherData.forecast} />
              </section>
            </>
          )}

          <footer className="mt-1 flex flex-col items-center justify-between gap-2 border-t border-white/15 py-4 text-xs text-white/60 sm:flex-row">
            <span>Made for curious skies · Fore-Sky</span><span>Weather & air quality data by OpenWeather</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
