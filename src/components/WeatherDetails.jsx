import { Droplets, Wind, Gauge, Eye, Cloud, Compass } from "lucide-react";

function getWindDirection(degrees = 0) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
}

function WeatherDetails({ weather }) {
  const details = [
    { title: "Humidity", value: weather.main.humidity + "%", note: "Moisture in the air", Icon: Droplets, tone: "text-sky-300 bg-sky-300/10" },
    { title: "Wind speed", value: weather.wind.speed + " m/s", note: "From the " + getWindDirection(weather.wind.deg), Icon: Wind, tone: "text-cyan-300 bg-cyan-300/10" },
    { title: "Pressure", value: weather.main.pressure + " hPa", note: "Atmospheric pressure", Icon: Gauge, tone: "text-violet-300 bg-violet-300/10" },
    { title: "Visibility", value: (weather.visibility / 1000).toFixed(1) + " km", note: "How far you can see", Icon: Eye, tone: "text-amber-200 bg-amber-200/10" },
    { title: "Cloud cover", value: (weather.clouds?.all ?? 0) + "%", note: "Sky covered by clouds", Icon: Cloud, tone: "text-indigo-300 bg-indigo-300/10" },
    { title: "Wind direction", value: getWindDirection(weather.wind.deg), note: (weather.wind.deg ?? 0) + "° compass heading", Icon: Compass, tone: "text-emerald-300 bg-emerald-300/10" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {details.map((detail) => {
        const Icon = detail.Icon;
        return (
          <article key={detail.title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/20 hover:bg-white/[0.055] sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-400 sm:text-sm">{detail.title}</p>
              <div className={"rounded-xl p-2 " + detail.tone}><Icon size={17} /></div>
            </div>
            <p className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">{detail.value}</p>
            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{detail.note}</p>
          </article>
        );
      })}
    </div>
  );
}

export default WeatherDetails;
