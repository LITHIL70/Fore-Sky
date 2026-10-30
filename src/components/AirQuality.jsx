import { Leaf, ShieldCheck } from "lucide-react";

const levels = [
  { label: "Good", description: "Air quality is satisfactory.", color: "bg-emerald-400", text: "text-emerald-300" },
  { label: "Fair", description: "Air quality is acceptable.", color: "bg-lime-400", text: "text-lime-300" },
  { label: "Moderate", description: "Sensitive people may limit long outdoor activity.", color: "bg-yellow-400", text: "text-yellow-300" },
  { label: "Poor", description: "Consider reducing prolonged outdoor exertion.", color: "bg-orange-400", text: "text-orange-300" },
  { label: "Very poor", description: "Avoid strenuous outdoor activity.", color: "bg-rose-500", text: "text-rose-300" },
];

function AirQuality({ airQuality }) {
  if (!airQuality?.main) {
    return (
      <section className="glass-panel flex min-h-48 flex-col justify-between rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2 text-emerald-200"><Leaf size={18} /><h2 className="text-sm font-semibold text-white">Air quality index</h2></div>
        <div><p className="text-lg font-semibold text-white">Not available</p><p className="mt-1 text-xs leading-5 text-slate-400">Air quality data could not be loaded right now.</p></div>
      </section>
    );
  }

  const index = Math.min(Math.max(airQuality.main.aqi, 1), 5);
  const level = levels[index - 1];
  const components = airQuality.components || {};
  const pollutants = [
    { label: "PM2.5", value: components.pm2_5 },
    { label: "PM10", value: components.pm10 },
    { label: "O₃", value: components.o3 },
    { label: "NO₂", value: components.no2 },
  ];

  return (
    <section className="glass-panel flex flex-col justify-between rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-200"><Leaf size={18} /><h2 className="text-sm font-semibold text-white">Air quality index</h2></div>
        <ShieldCheck size={17} className="text-slate-500" />
      </div>
      <div className="mt-5 flex items-end gap-3">
        <span className="text-5xl font-semibold tracking-tight text-white">{index}</span>
        <span className={"mb-1 rounded-full bg-white/[0.07] px-3 py-1 text-xs font-medium " + level.text}>{level.label}</span>
      </div>
      <div className="mt-4">
        <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
          {levels.map((item) => <div key={item.label} className={"h-full flex-1 " + item.color} />)}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>Good</span><span>Very poor</span></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">{level.description}</p>
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/[0.08] pt-3">
        {pollutants.map((item) => <div key={item.label}><p className="text-[10px] text-slate-500">{item.label}</p><p className="mt-1 text-xs font-semibold text-slate-200">{Number.isFinite(item.value) ? item.value.toFixed(1) : "—"}</p></div>)}
      </div>
    </section>
  );
}

export default AirQuality;
