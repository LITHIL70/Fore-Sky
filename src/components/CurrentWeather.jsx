import { MapPin, Sunrise, Sunset, ThermometerSun } from "lucide-react";

function CurrentWeather({ weather, city, country }) {
  const weatherIcon = weather.weather[0].icon;
  const weatherDescription = weather.weather[0].description;
  const iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@4x.png";

  // OpenWeather gives the city time offset in seconds.
  // Add that offset before formatting so the clock matches the searched city.
  const cityTimestamp = (weather.dt + weather.timezone) * 1000;
  const cityDate = new Date(cityTimestamp);

  const dateText = cityDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  const timeText = cityDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

  const sunriseText = new Date((weather.sys.sunrise + weather.timezone) * 1000)
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  const sunsetText = new Date((weather.sys.sunset + weather.timezone) * 1000)
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  return (
    <section className="glass-panel current-weather-card relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[26px] p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-16 -z-10 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

      <div>
        <div className="flex items-center gap-2 text-white">
          <MapPin size={19} className="shrink-0" />
          <h2 className="text-xl font-semibold sm:text-2xl">{city}, {country}</h2>
        </div>
        <p className="mt-1 pl-7 text-sm text-white/65">{dateText} · {timeText}</p>
        <p className="mt-4 text-sm capitalize text-white/80">{weatherDescription}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-start">
            <span className="text-7xl font-semibold leading-none tracking-[-0.07em] text-white sm:text-8xl">
              {Math.round(weather.main.temp)}
            </span>
            <span className="mt-1 text-4xl font-medium text-white">°C</span>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
            <ThermometerSun size={17} />
            Feels like {Math.round(weather.main.feels_like)}°C
          </p>
          <div className="mt-3 flex gap-4 text-sm text-white/85">
            <span>↑ {Math.round(weather.main.temp_max)}°</span>
            <span>↓ {Math.round(weather.main.temp_min)}°</span>
          </div>
        </div>

        <img
          src={iconUrl}
          alt={weatherDescription}
          className="h-32 w-32 drop-shadow-[0_12px_25px_rgba(0,0,0,0.3)] sm:h-40 sm:w-40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
        <div className="flex items-center gap-2.5">
          <Sunrise size={22} className="text-amber-300" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/55">Sunrise</p>
            <p className="mt-1 text-sm font-semibold text-white">{sunriseText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Sunset size={22} className="text-pink-200" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/55">Sunset</p>
            <p className="mt-1 text-sm font-semibold text-white">{sunsetText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
