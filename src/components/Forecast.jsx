import { CalendarDays, Clock3 } from "lucide-react";

function Forecast({ forecast }) {
  const cityTimeZone = forecast.city.timezone;

  // Convert a forecast timestamp into the searched city's local time.
  function getCityDate(timestamp) {
    return new Date((timestamp + cityTimeZone) * 1000);
  }

  function formatTime(timestamp) {
    return getCityDate(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  }

  function getLocalDateKey(timestamp) {
    return getCityDate(timestamp).toISOString().slice(0, 10);
  }

  function formatDay(timestamp) {
    return getCityDate(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  // The forecast API gives data in three-hour intervals.
  // Eight entries give us roughly the next 24 hours.
  const upcomingItems = forecast.list.slice(0, 8);
  const forecastsByDay = {};

  forecast.list.forEach((forecastItem) => {
    const dateKey = getLocalDateKey(forecastItem.dt);

    if (!forecastsByDay[dateKey]) {
      forecastsByDay[dateKey] = [];
    }

    forecastsByDay[dateKey].push(forecastItem);
  });

  // Pick the entry closest to midday for each day.
  // Also calculate that day's lowest and highest forecast temperatures.
  const dailyItems = Object.values(forecastsByDay).map((items) => {
    let middayForecast = items[0];
    let smallestTimeDifference = Infinity;

    items.forEach((forecastItem) => {
      const forecastHour = getCityDate(forecastItem.dt).getUTCHours();
      const timeDifference = Math.abs(forecastHour - 12);

      if (timeDifference < smallestTimeDifference) {
        smallestTimeDifference = timeDifference;
        middayForecast = forecastItem;
      }
    });

    const temperatures = items.map((forecastItem) => forecastItem.main.temp);

    return {
      ...middayForecast,
      low: Math.min(...temperatures),
      high: Math.max(...temperatures),
    };
  }).slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <section className="glass-panel rounded-[24px] p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-xl bg-cyan-300/15 p-2 text-cyan-200">
            <Clock3 size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Hourly Forecast</h3>
            <p className="text-xs text-white/55">Weather for the next 24 hours</p>
          </div>
          <span className="ml-auto hidden text-xs text-white/45 sm:block">3-hour intervals</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {upcomingItems.map((forecastItem, index) => {
            const iconUrl = "https://openweathermap.org/img/wn/" + forecastItem.weather[0].icon + "@2x.png";
            const timeLabel = index === 0 ? "Next" : formatTime(forecastItem.dt);

            return (
              <article
                key={forecastItem.dt}
                className={
                  "min-w-[82px] flex-1 rounded-2xl border px-2 py-3 text-center sm:min-w-[88px] " +
                  (index === 0
                    ? "border-cyan-300/50 bg-cyan-300/[0.13] shadow-lg shadow-cyan-950/20"
                    : "border-white/10 bg-slate-950/[0.20]")
                }
              >
                <p className="text-xs text-white/70">{timeLabel}</p>
                <img
                  src={iconUrl}
                  alt={forecastItem.weather[0].description}
                  className="mx-auto my-2 h-12 w-12"
                />
                <p className="text-lg font-semibold text-white">
                  {Math.round(forecastItem.main.temp)}°
                </p>
                <p className="mt-1 truncate text-[10px] capitalize text-white/55">
                  {forecastItem.weather[0].main}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-[24px] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-xl bg-violet-300/15 p-2 text-violet-100">
            <CalendarDays size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Five-day Forecast</h3>
            <p className="text-xs text-white/55">Daily conditions and temperature range</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {dailyItems.map((forecastItem, index) => {
            const iconUrl = "https://openweathermap.org/img/wn/" + forecastItem.weather[0].icon + "@2x.png";
            const dayLabel = index === 0 ? "Today" : formatDay(forecastItem.dt);

            return (
              <article
                key={forecastItem.dt}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/[0.18] px-3 py-3 transition hover:border-white/25 hover:bg-white/[0.07] sm:flex-col sm:items-start sm:gap-2 sm:p-3"
              >
                <p className="w-20 shrink-0 text-xs font-medium text-white/75 sm:w-auto">
                  {dayLabel}
                </p>
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:w-full sm:flex-col sm:items-start">
                  <img
                    src={iconUrl}
                    alt={forecastItem.weather[0].description}
                    className="h-12 w-12 shrink-0"
                  />
                  <p className="truncate text-xs capitalize text-white/65 sm:whitespace-normal">
                    {forecastItem.weather[0].description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm tabular-nums sm:w-full sm:justify-between">
                  <span className="font-bold text-white">{Math.round(forecastItem.high)}°</span>
                  <span className="text-white/50">{Math.round(forecastItem.low)}°</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Forecast;
