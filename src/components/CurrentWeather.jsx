import { MapPin, Sunrise, Sunset, ThermometerSun } from "lucide-react";

function CurrentWeather({ weather, city, country }) {
  const iconUrl = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@4x.png";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  function formatSunTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return (
    <section className="glass-panel relative isolate overflow-hidden rounded-3xl p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-white/65">{today}</p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{city}, {country}<MapPin size={16} className="text-cyan-200" /></h2>
          <p className="mt-2 text-sm capitalize text-white/75">{weather.weather[0].description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-start gap-1"><span className="text-7xl font-semibold leading-none tracking-[-0.07em] text-white sm:text-8xl">{Math.round(weather.main.temp)}°</span><span className="mt-2 text-lg text-white/70">C</span></div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/75"><ThermometerSun size={15} /> Feels like {Math.round(weather.main.feels_like)}°C</p>
            <div className="mt-3 flex gap-4 text-xs text-white/70"><span>↑ {Math.round(weather.main.temp_max)}°</span><span>↓ {Math.round(weather.main.temp_min)}°</span></div>
          </div>
          <img src={iconUrl} alt={weather.weather[0].description} className="h-32 w-32 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] sm:h-40 sm:w-40" />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
          <div className="flex items-center gap-2.5"><Sunrise size={19} className="text-amber-200" /><div><p className="text-[10px] uppercase tracking-wider text-white/55">Sunrise</p><p className="mt-0.5 text-sm font-semibold text-white">{formatSunTime(weather.sys.sunrise)}</p></div></div>
          <div className="flex items-center gap-2.5"><Sunset size={19} className="text-pink-200" /><div><p className="text-[10px] uppercase tracking-wider text-white/55">Sunset</p><p className="mt-0.5 text-sm font-semibold text-white">{formatSunTime(weather.sys.sunset)}</p></div></div>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
