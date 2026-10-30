import { CalendarDays, Clock3 } from "lucide-react";

function Forecast({ forecast }) {
  const cityTimeZone = forecast.city.timezone;
  function getCityDate(timestamp) { return new Date((timestamp + cityTimeZone) * 1000); }
  function formatTime(timestamp) { return getCityDate(timestamp).toLocaleTimeString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" }); }
  function getLocalDateKey(timestamp) { return getCityDate(timestamp).toISOString().slice(0, 10); }
  function formatDay(timestamp) { return getCityDate(timestamp).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }); }

  const upcomingItems = forecast.list.slice(0, 8);
  const forecastsByDay = {};
  forecast.list.forEach((item) => {
    const key = getLocalDateKey(item.dt);
    if (!forecastsByDay[key]) forecastsByDay[key] = [];
    forecastsByDay[key].push(item);
  });

  const dailyItems = Object.values(forecastsByDay).map((items) => {
    let midday = items[0];
    let smallestDifference = Infinity;
    items.forEach((item) => {
      const difference = Math.abs(getCityDate(item.dt).getUTCHours() - 12);
      if (difference < smallestDifference) { smallestDifference = difference; midday = item; }
    });
    return { ...midday, low: Math.min(...items.map((item) => item.main.temp_min)), high: Math.max(...items.map((item) => item.main.temp_max)) };
  }).slice(0, 5);

  return (
    <div className="grid gap-4">
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2"><div className="rounded-xl bg-cyan-300/10 p-2 text-cyan-100"><Clock3 size={17} /></div><div><h3 className="text-sm font-semibold text-white">Hourly forecast</h3><p className="text-[11px] text-white/55">The next 24 hours</p></div></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {upcomingItems.map((item, index) => (
            <div key={item.dt} className={"min-w-[76px] flex-1 rounded-2xl px-2 py-3 text-center " + (index === 0 ? "border border-cyan-200/20 bg-cyan-300/[0.10]" : "bg-slate-950/20")}>
              <p className="text-[11px] text-white/65">{index === 0 ? "Now" : formatTime(item.dt)}</p>
              <img src={"https://openweathermap.org/img/wn/" + item.weather[0].icon + "@2x.png"} alt={item.weather[0].description} className="mx-auto my-1 h-11 w-11" />
              <p className="text-base font-semibold text-white">{Math.round(item.main.temp)}°</p><p className="mt-1 truncate text-[10px] capitalize text-white/50">{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2"><div className="rounded-xl bg-violet-300/10 p-2 text-violet-100"><CalendarDays size={17} /></div><div><h3 className="text-sm font-semibold text-white">Five-day forecast</h3><p className="text-[11px] text-white/55">A compact look at the days ahead</p></div></div>
        <div className="divide-y divide-white/10">
          {dailyItems.map((item, index) => (
            <div key={item.dt} className="grid grid-cols-[72px_40px_minmax(0,1fr)_auto] items-center gap-2 py-2 sm:grid-cols-[100px_44px_minmax(0,1fr)_100px] sm:gap-3">
              <p className="text-xs font-medium text-white/85 sm:text-sm">{index === 0 ? "Today" : formatDay(item.dt)}</p>
              <img src={"https://openweathermap.org/img/wn/" + item.weather[0].icon + ".png"} alt={item.weather[0].description} className="h-9 w-9" />
              <p className="truncate text-xs capitalize text-white/60 sm:text-sm">{item.weather[0].description}</p>
              <div className="flex items-center justify-end gap-2 text-xs tabular-nums sm:text-sm"><span className="font-semibold text-white">{Math.round(item.high)}°</span><span className="text-white/45">{Math.round(item.low)}°</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Forecast;
