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

  // Select the forecast reading closest to midday for each day.
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
    <div className="grid gap-5 xl:grid-cols-5">
      <section className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 xl:col-span-3">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 size={19} className="text-sky-300" />
          <h2 className="font-semibold text-white">Next hours</h2>
          <span className="ml-auto text-xs text-slate-500">3-hour intervals</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {upcomingItems.map((item) => (
            <div key={item.dt} className="rounded-xl bg-white/[0.04] px-2 py-4 text-center">
              <p className="text-xs text-slate-400">{formatTime(item.dt)}</p>
              <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} className="mx-auto h-14 w-14" />
              <p className="font-semibold text-white">{Math.round(item.main.temp)}°</p>
              <p className="mt-1 truncate text-xs capitalize text-slate-500">{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 xl:col-span-2">
        <div className="mb-5 flex items-center gap-2"><CalendarDays size={19} className="text-sky-300" /><h2 className="font-semibold text-white">5-day outlook</h2></div>
        <div className="space-y-3">
          {dailyItems.map((item) => (
            <div key={item.dt} className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
              <p className="w-20 text-sm text-slate-300">{formatDay(item.dt)}</p>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} className="h-9 w-9" />
                <p className="truncate text-xs capitalize text-slate-400">{item.weather[0].description}</p>
              </div>
              <p className="text-sm font-semibold text-white">{Math.round(item.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default Forecast;