import { MapPin, Sunrise, Sunset } from "lucide-react";

function CurrentWeather({ weather, city, country }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  function formatSunTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-200/10 bg-gradient-to-br from-sky-500/25 via-blue-900/70 to-indigo-950 p-6 shadow-2xl shadow-sky-950/20 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-sky-200">{today}</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">{city}, {country}<MapPin size={19} className="text-sky-300" /></h2>
          <p className="mt-2 text-lg capitalize text-slate-300">{weather.weather[0].description}</p>
          <div className="mt-7 flex items-end gap-2">
            <span className="text-7xl font-semibold tracking-tighter text-white sm:text-8xl">{Math.round(weather.main.temp)}°</span>
            <span className="mb-3 text-2xl text-sky-200">C</span>
          </div>
          <p className="mt-2 text-sm text-slate-300">Feels like {Math.round(weather.main.feels_like)}°C</p>
        </div>
        <div className="flex flex-col items-center md:pr-8">
          <img src={iconUrl} alt={weather.weather[0].description} className="h-40 w-40 drop-shadow-xl" />
          <div className="mt-1 flex gap-5 text-sm text-slate-300">
            <span>H: {Math.round(weather.main.temp_max)}°</span>
            <span>L: {Math.round(weather.main.temp_min)}°</span>
          </div>
        </div>
      </div>
      <div className="relative mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm sm:max-w-md">
        <div className="flex items-center gap-3"><Sunrise size={20} className="text-amber-300" /><div><p className="text-xs text-slate-400">Sunrise</p><p className="mt-1 font-semibold text-white">{formatSunTime(weather.sys.sunrise)}</p></div></div>
        <div className="flex items-center gap-3"><Sunset size={20} className="text-orange-300" /><div><p className="text-xs text-slate-400">Sunset</p><p className="mt-1 font-semibold text-white">{formatSunTime(weather.sys.sunset)}</p></div></div>
      </div>
    </section>
  );
}
export default CurrentWeather;