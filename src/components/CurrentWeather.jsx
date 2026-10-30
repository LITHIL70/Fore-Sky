import { MapPin, Sunrise, Sunset, ThermometerSun } from "lucide-react";

function CurrentWeather({ weather, city, country }) {
  const iconUrl = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@4x.png";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  function formatSunTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-cyan-100/15 bg-gradient-to-br from-[#164e63] via-[#123451] to-[#172554] p-6 shadow-2xl shadow-cyan-950/25 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-100/75">{today}</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {city}, {country}<MapPin size={17} className="text-cyan-200" />
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-sm capitalize text-cyan-50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
            {weather.weather[0].description}
          </div>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-7xl font-semibold leading-none tracking-[-0.07em] text-white sm:text-8xl">{Math.round(weather.main.temp)}°</span>
            <span className="mb-2 text-xl text-cyan-100/80">C</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cyan-50/75">
            <span className="inline-flex items-center gap-1.5"><ThermometerSun size={15} /> Feels like {Math.round(weather.main.feels_like)}°C</span>
            <span>High {Math.round(weather.main.temp_max)}°</span>
            <span>Low {Math.round(weather.main.temp_min)}°</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:flex-col md:justify-center md:pr-5">
          <img src={iconUrl} alt={weather.weather[0].description} className="h-36 w-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] sm:h-44 sm:w-44" />
          <div className="grid min-w-[180px] grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-slate-950/15 p-3 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2"><Sunrise size={18} className="text-amber-200" /><div><p className="text-[10px] uppercase tracking-wider text-cyan-100/60">Sunrise</p><p className="mt-0.5 font-semibold text-white">{formatSunTime(weather.sys.sunrise)}</p></div></div>
            <div className="flex items-center gap-2"><Sunset size={18} className="text-orange-200" /><div><p className="text-[10px] uppercase tracking-wider text-cyan-100/60">Sunset</p><p className="mt-0.5 font-semibold text-white">{formatSunTime(weather.sys.sunset)}</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
