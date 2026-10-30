import { Droplets, Wind, Gauge, Eye, Cloud, Compass, Thermometer } from "lucide-react";

function getWindDirection(degrees = 0) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
}

function WeatherDetails({ weather }) {
  const details = [
    { title: "Humidity", value: weather.main.humidity + "%", note: "Moisture in the air", Icon: Droplets, tone: "text-sky-200" },
    { title: "Wind speed", value: weather.wind.speed + " m/s", note: "From the " + getWindDirection(weather.wind.deg), Icon: Wind, tone: "text-cyan-200" },
    { title: "Pressure", value: weather.main.pressure + " hPa", note: "Atmospheric pressure", Icon: Gauge, tone: "text-violet-200" },
    { title: "Visibility", value: (weather.visibility / 1000).toFixed(1) + " km", note: "Viewing distance", Icon: Eye, tone: "text-amber-100" },
    { title: "Cloud cover", value: (weather.clouds?.all ?? 0) + "%", note: "Clouds in the sky", Icon: Cloud, tone: "text-indigo-200" },
    { title: "Wind direction", value: getWindDirection(weather.wind.deg), note: (weather.wind.deg ?? 0) + "° compass heading", Icon: Compass, tone: "text-emerald-200" },
    { title: "Feels like", value: Math.round(weather.main.feels_like) + "°C", note: "Perceived temperature", Icon: Thermometer, tone: "text-orange-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {details.map((detail) => {
        const Icon = detail.Icon;
        return <article key={detail.title} className="glass-panel rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-cyan-100/20 sm:p-5">
          <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-white/60 sm:text-sm">{detail.title}</p><Icon size={17} className={detail.tone} /></div>
          <p className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">{detail.value}</p>
          <p className="mt-1 text-[11px] text-white/45 sm:text-xs">{detail.note}</p>
        </article>;
      })}
    </div>
  );
}

export default WeatherDetails;
