import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";
import AirQuality from "./components/AirQuality";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import { getWeatherByCity, getWeatherByCoordinates } from "./services/weatherService";

function getWeatherTheme(weather) {
  const weatherCondition = weather?.weather?.[0]?.main?.toLowerCase() || "clouds";
  const isNightTime = weather?.weather?.[0]?.icon?.endsWith("n");

  if (isNightTime) return "night";
  if (weatherCondition.includes("thunder")) return "stormy";
  if (weatherCondition.includes("rain") || weatherCondition.includes("drizzle")) return "rainy";
  if (weatherCondition.includes("snow")) return "snowy";
  if (weatherCondition.includes("clear")) return "sunny";

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
      const latestWeatherData = await getWeatherByCity(cityToSearch.trim());

      setWeatherData(latestWeatherData);
      setCity(latestWeatherData.cityName);
    } catch (requestError) {
      setError(requestError.message || "Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather("Hyderabad");
    // Load the default city once when the app starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWeather = weatherData?.currentWeather;
  const pageTheme = getWeatherTheme(currentWeather);

  function handleUseLocation() {\n    if (!navigator.geolocation) {\n      setError("Your browser does not support location sharing. Please search for a city instead.");\n      return;\n    }\n\n    setLoading(true);\n    setError("");\n\n    navigator.geolocation.getCurrentPosition(\n      async (position) => {\n        try {\n          const latitude = position.coords.latitude;\n          const longitude = position.coords.longitude;\n          const nearbyWeather = await getWeatherByCoordinates(latitude, longitude);\n\n          setWeatherData(nearbyWeather);\n          setCity(nearbyWeather.cityName);\n        } catch (locationError) {\n          setError(locationError.message || "We could not load weather for your location.");\n        } finally {\n          setLoading(false);\n        }\n      },\n      (locationError) => {\n        if (locationError.code === 1) {\n          setError("Location permission was denied. Allow location access in your browser or search for a city.");\n        } else {\n          setError("We could not get your location. Please try again or search for a city.");\n        }\n        setLoading(false);\n      },\n      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }\n    );\n  }\n\n  function handleRefresh() {
    if (weatherData) {
      loadWeather(weatherData.cityName);
    } else {
      loadWeather(city);
    }
  }

  return (
    <div className={"weather-scene " + pageTheme + " min-h-screen text-white"}>
      <div className="weather-background-overlay" />

      <div className="relative z-10">
        <Navbar
          city={city}
          setCity={setCity}
          onSearch={() => loadWeather(city)}
          loading={loading}
          onRefresh={handleRefresh}
        />

        <main className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-7 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/20 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-cyan-100 backdrop-blur">
                <Sparkles size={13} />
                YOUR PERSONAL WEATHER SPACE
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Weather at a glance
              </h1>
            </div>

            {currentWeather && (
              <p className="text-xs text-white/60">
                Last updated: {new Date(currentWeather.dt * 1000).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-300/25 bg-rose-950/50 px-5 py-4 text-sm text-rose-100 backdrop-blur-xl"
            >
              {error}
            </div>
          )}

          {loading && !weatherData && (
            <div className="glass-panel rounded-3xl p-12 text-center text-white/80">
              Getting the latest weather for you...
            </div>
          )}

          {weatherData && (
            <>
              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.78fr_1.15fr]">
                <CurrentWeather
                  weather={weatherData.currentWeather}
                  city={weatherData.cityName}
                  country={weatherData.country}
                />

                <AirQuality airQuality={weatherData.airQuality} />

                <SunCycle weather={weatherData.currentWeather} />
              </section>

              <WeatherDetails weather={weatherData.currentWeather} />

              <Forecast forecast={weatherData.forecast} />
            </>
          )}

          <footer className="mt-1 flex flex-col items-center justify-between gap-2 border-t border-white/20 py-4 text-xs text-white/60 sm:flex-row">
            <span>Made for curious skies · Fore-Sky</span>
            <span>Weather and air quality data by OpenWeather</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function SunCycle({ weather }) {
  const sunriseTimestamp = weather.sys.sunrise;
  const sunsetTimestamp = weather.sys.sunset;
  const currentTimestamp = weather.dt;

  const daylightSeconds = Math.max(sunsetTimestamp - sunriseTimestamp, 0);
  const daylightHours = Math.floor(daylightSeconds / 3600);
  const daylightMinutes = Math.floor((daylightSeconds % 3600) / 60);

  const daylightText = daylightHours + "h " + daylightMinutes + "m";

  const sunriseText = new Date((sunriseTimestamp + weather.timezone) * 1000)
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  const sunsetText = new Date((sunsetTimestamp + weather.timezone) * 1000)
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  let daylightProgress = (currentTimestamp - sunriseTimestamp) / daylightSeconds;
  daylightProgress = Math.min(Math.max(daylightProgress, 0), 1);

  return (
    <section className="glass-panel flex min-h-[300px] flex-col justify-between rounded-[26px] p-5 sm:p-7">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl text-amber-300">☀</span>
          <h2 className="text-lg font-semibold text-white">Sunrise & Sunset</h2>
        </div>

        <div className="relative mt-5 px-3">
          <svg viewBox="0 0 320 125" className="w-full" role="img" aria-label="Daylight progress from sunrise to sunset">
            <path
              d="M 20 105 A 140 100 0 0 1 300 105"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="3"
              strokeDasharray="5 6"
            />
            <path
              d="M 20 105 A 140 100 0 0 1 300 105"
              fill="none"
              stroke="#facc15"
              strokeWidth="3"
              pathLength="100"
              strokeDasharray={daylightProgress * 100 + " 100"}
            />
            <circle cx="20" cy="105" r="6" fill="#fbbf24" />
            <circle cx="300" cy="105" r="6" fill="#f0abfc" />
            <circle
              cx={20 + 280 * daylightProgress}
              cy={105 - 100 * Math.sin(Math.PI * daylightProgress)}
              r="9"
              fill="#fde047"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-amber-300">☀</span>
          <div>
            <p className="text-sm font-semibold text-white">{sunriseText}</p>
            <p className="text-xs text-white/55">Sunrise</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-2xl text-pink-200">☀</span>
          <div>
            <p className="text-sm font-semibold text-white">{sunsetText}</p>
            <p className="text-xs text-white/55">Sunset</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-white/15 pt-3">
        <p className="text-xs text-white/55">Total daylight</p>
        <p className="mt-1 text-xl font-semibold text-white">{daylightText}</p>
      </div>
    </section>
  );
}

export default App;
