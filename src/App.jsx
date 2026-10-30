import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";
import AirQuality from "./components/AirQuality";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import WeatherSkeleton from "./components/WeatherSkeleton";
import WeatherAdvice from "./components/WeatherAdvice";
import {
  getWeatherByCity,
  getWeatherByCoordinates,
} from "./services/weatherService";

const SEARCH_HISTORY_STORAGE_KEY = "fore-sky-search-history";
const THEME_STORAGE_KEY = "fore-sky-theme";

// Choose a background theme by checking the weather condition and icon.
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

// Format a timestamp using the UTC offset returned for the searched city.
function formatCityTime(timestamp, cityTimeZone) {
  const cityDate = new Date((timestamp + cityTimeZone) * 1000);

  return cityDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function App() {
  const [city, setCity] = useState("Hyderabad");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Remember recent searches and the selected appearance in this browser.
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    } catch {
      return "dark";
    }
  });

  // Keep countdowns and the daylight arc fresh while the page stays open.
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const clockInterval = window.setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 30000);

    return () => window.clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The dashboard still works if browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
    } catch {
      // Search history is a convenience, so storage errors should not stop weather loading.
    }
  }, [searchHistory]);

  function rememberCity(cityName) {
    const cleanedCityName = cityName.trim();

    setSearchHistory((previousHistory) => {
      const matchingCityRemoved = previousHistory.filter(
        (historyCity) => historyCity.toLowerCase() !== cleanedCityName.toLowerCase()
      );

      return [cleanedCityName, ...matchingCityRemoved].slice(0, 6);
    });
  }

  // Search for a city and load its current weather, AQI and forecast.
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
      rememberCity(latestWeatherData.cityName);
    } catch (requestError) {
      setError(requestError.message || "Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load the default city when the dashboard opens for the first time.
  useEffect(() => {
    loadWeather("Hyderabad");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ask the browser for permission to use the device's current location.
  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location sharing. Please search for a city instead.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const nearbyWeather = await getWeatherByCoordinates(latitude, longitude);

          setWeatherData(nearbyWeather);
          setCity(nearbyWeather.cityName);
          rememberCity(nearbyWeather.cityName);
        } catch (locationError) {
          setError(locationError.message || "We could not load weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      (locationError) => {
        if (locationError.code === 1) {
          setError("Location permission was denied. Allow location access in your browser or search for a city.");
        } else {
          setError("We could not get your location. Please try again or search for a city.");
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  function handleRefresh() {
    if (weatherData) {
      loadWeather(weatherData.cityName);
    } else {
      loadWeather(city);
    }
  }

  function handleSelectHistory(historyCity) {
    setCity(historyCity);
    loadWeather(historyCity);
  }

  function handleClearHistory() {
    setSearchHistory([]);
  }

  function handleToggleTheme() {
    setTheme((previousTheme) => previousTheme === "dark" ? "light" : "dark");
  }

  const currentWeather = weatherData?.currentWeather;
  const pageTheme = getWeatherTheme(currentWeather);
  const lastUpdatedText = currentWeather
    ? formatCityTime(currentWeather.dt, currentWeather.timezone)
    : "";

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
          onUseLocation={handleUseLocation}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          searchHistory={searchHistory}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
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

            {currentWeather && !loading && (
              <p className="text-xs text-white/70">
                Last updated at {lastUpdatedText} local city time
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

          {loading && <WeatherSkeleton />}

          {!loading && weatherData && (
            <>
              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.78fr_1.15fr]">
                <CurrentWeather
                  weather={weatherData.currentWeather}
                  city={weatherData.cityName}
                  country={weatherData.country}
                />

                <AirQuality airQuality={weatherData.airQuality} />

                <SunCycle
                  weather={weatherData.currentWeather}
                  currentTime={currentTime}
                />
              </section>

              <WeatherAdvice
                weather={weatherData.currentWeather}
                forecast={weatherData.forecast}
              />

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

// This panel shows the daylight journey and the next sunrise or sunset countdown.
function SunCycle({ weather, currentTime }) {
  const sunriseTimestamp = weather.sys.sunrise;
  const sunsetTimestamp = weather.sys.sunset;
  const daylightSeconds = Math.max(sunsetTimestamp - sunriseTimestamp, 0);
  const daylightHours = Math.floor(daylightSeconds / 3600);
  const daylightMinutes = Math.floor((daylightSeconds % 3600) / 60);
  const daylightText = daylightHours + "h " + daylightMinutes + "m";

  const sunriseText = formatCityTime(sunriseTimestamp, weather.timezone);
  const sunsetText = formatCityTime(sunsetTimestamp, weather.timezone);

  const daylightProgress = daylightSeconds > 0
    ? Math.min(Math.max((currentTime - sunriseTimestamp) / daylightSeconds, 0), 1)
    : 0;

  const sunPositionX = 20 + 280 * daylightProgress;
  const sunPositionY = 105 - 100 * Math.sin(Math.PI * daylightProgress);

  const isBeforeSunrise = currentTime < sunriseTimestamp;
  const isAfterSunset = currentTime >= sunsetTimestamp;
  const nextSunEventTimestamp = isBeforeSunrise
    ? sunriseTimestamp
    : isAfterSunset
      ? sunriseTimestamp + 86400
      : sunsetTimestamp;
  const countdownSeconds = Math.max(nextSunEventTimestamp - currentTime, 0);
  const countdownHours = Math.floor(countdownSeconds / 3600);
  const countdownMinutes = Math.floor((countdownSeconds % 3600) / 60);
  const countdownLabel = isBeforeSunrise || isAfterSunset ? "Sunrise in" : "Sunset in";

  return (
    <section className="glass-panel flex min-h-[300px] flex-col justify-between rounded-[26px] p-5 sm:p-7">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl text-amber-300">☀</span>
          <h2 className="text-lg font-semibold text-white">Sunrise & Sunset</h2>
        </div>

        <div className="relative mt-5 px-3">
          <svg
            viewBox="0 0 320 125"
            className="w-full"
            role="img"
            aria-label="Daylight progress from sunrise to sunset"
          >
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
              cx={sunPositionX}
              cy={sunPositionY}
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

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
        <div>
          <p className="text-xs text-white/55">Total daylight</p>
          <p className="mt-1 text-lg font-semibold text-white">{daylightText}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/55">{countdownLabel}</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {countdownHours}h {countdownMinutes}m
          </p>
        </div>
      </div>
    </section>
  );
}

export default App;
