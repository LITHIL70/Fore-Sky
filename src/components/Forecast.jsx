import { CalendarDays, Clock3 } from "lucide-react";

function Forecast({ forecast }) {
  const cityTimeZone = forecast.city.timezone;

  function getCityDate(timestamp) {
    return new Date((timestamp + cityTimeZone) * 1000);
  }

  function formatTime(timestamp) {
    return getCityDate(timestamp).toLocaleTimeString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" });
  }

  function getLocalDateKey(timestamp) {
    return getCityDate(timestamp).toISOString().slice(0, 10);
  }

  function formatDay(timestamp) {
    return getCityDate(timestamp).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  }

  const upcomingItems = forecast.list.slice(0, 6);
  const forecastsByDay = {};

  forecast.list.forEach((item) => {
    const dateKey = getLocalDateKey(item.dt);
    if (!forecastsByDay[dateKey]) forecastsByDay[dateKey] = [];
    forecastsByDay[dateKey].push(item);
  });

  const dailyItems = Object.values(forecastsByDay).map((items) => {
    let middayItem = items[0];
    let smallestDifference = Infinity;
    items.forEach((item) => {
      const hour = getCityDate(item.dt).getUTCHours();
      const difference = Math.abs(hour - 12);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        middayItem = item;
      }
    });
    return middayItem;
  }).slice(0, 5);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200"><Clock3 size={17} /></div>
          <div><h3 className="text-sm font-semibold text-white">Coming up</h3><p className="text-[11px] text-slate-500">The next few hours</p></div>
          <span className="ml-auto text-[10px] text-slate-500">3-hour steps</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {upcomingItems.map((item, index) => (
            <div key={item.dt} className={"rounded-2xl px-2 py-3 text-center " + (index === 0 ? "border border-cyan-200/15 bg-cyan-300/[0.08]" : "bg-slate-950/30")}>
              <p className="text-[11px] text-slate-400">{formatTime(item.dt)}</p>
              <img src={"https://openweathermap.org/img/wn/" + item.weather[0].icon + "@2x.png"} alt={item.weather[0].description} className="mx-auto my-1 h-12 w-12" />
              <p className="text-base font-semibold text-white">{Math.round(item.main.temp)}°</p>
              <p className="mt-1 truncate text-[10px] capitalize text-slate-500">{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="rounded-xl bg-violet-300/10 p-2 text-violet-200"><CalendarDays size={17} /></div>
          <div><h3 className="text-sm font-semibold text-white">Five-day outlook</h3><p className="text-[11px] text-slate-500">A look at the days ahead</p></div>
        </div>
        <div className="space-y-1">
          {dailyItems.map((item) => (
            <div key={item.dt} className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]">
              <p className="w-16 text-xs font-medium text-slate-300">{formatDay(item.dt)}</p>
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <img src={"https://openweathermap.org/img/wn/" + item.weather[0].icon + ".png"} alt={item.weather[0].description} className="h-8 w-8" />
                <p className="truncate text-[11px] capitalize text-slate-400">{item.weather[0].description}</p>
              </div>
              <p className="text-sm font-semibold text-white">{Math.round(item.main.temp)}°</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Forecast;
