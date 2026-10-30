import { Droplets, Wind, Gauge, Eye } from "lucide-react";

function WeatherDetails({ weather }) {
  const details = [
    { title: "Humidity", value: `${weather.main.humidity}%`, note: "Air moisture", Icon: Droplets },
    { title: "Wind speed", value: `${weather.wind.speed} m/s`, note: "Current wind", Icon: Wind },
    { title: "Pressure", value: `${weather.main.pressure} hPa`, note: "Air pressure", Icon: Gauge },
    { title: "Visibility", value: `${(weather.visibility / 1000).toFixed(1)} km`, note: "Viewing distance", Icon: Eye },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {details.map((detail) => {
        const Icon = detail.Icon;
        return (
          <article key={detail.title} className="rounded-2xl border border-white/10 bg-slate-900/75 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{detail.title}</p>
              <div className="rounded-xl bg-sky-400/10 p-2.5 text-sky-300"><Icon size={20} /></div>
            </div>
            <p className="mt-5 text-2xl font-semibold text-white">{detail.value}</p>
            <p className="mt-1 text-xs text-slate-500">{detail.note}</p>
          </article>
        );
      })}
    </div>
  );
}
export default WeatherDetails;