import { Leaf, ShieldCheck } from "lucide-react";

const airQualityLevels = [
  {
    number: 1,
    label: "Good",
    description: "Air quality is good. It is a great day for outdoor activities.",
    color: "bg-emerald-400",
    textColor: "text-emerald-300",
  },
  {
    number: 2,
    label: "Fair",
    description: "Air quality is acceptable for most people.",
    color: "bg-lime-400",
    textColor: "text-lime-300",
  },
  {
    number: 3,
    label: "Moderate",
    description: "Sensitive people may want to limit prolonged outdoor activity.",
    color: "bg-yellow-400",
    textColor: "text-yellow-300",
  },
  {
    number: 4,
    label: "Poor",
    description: "Consider reducing long or strenuous outdoor activity.",
    color: "bg-orange-400",
    textColor: "text-orange-300",
  },
  {
    number: 5,
    label: "Very poor",
    description: "Avoid strenuous outdoor activity where possible.",
    color: "bg-rose-500",
    textColor: "text-rose-300",
  },
];

function AirQuality({ airQuality }) {
  if (!airQuality || !airQuality.main) {
    return (
      <section className="glass-panel flex min-h-[300px] flex-col justify-between rounded-[26px] p-5 sm:p-7">
        <div className="flex items-center gap-2 text-emerald-300">
          <Leaf size={21} />
          <h2 className="text-lg font-semibold text-white">Air Quality Index</h2>
        </div>
        <div>
          <p className="text-2xl font-semibold text-white">Not available</p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Air quality information could not be loaded. Your weather forecast is still available.
          </p>
        </div>
      </section>
    );
  }

  // OpenWeather's AQI scale runs from 1 to 5.
  // It is not the same scale as the US AQI score, which can run from 0 to 500.
  const airQualityNumber = airQuality.main.aqi;
  const selectedLevel = airQualityLevels[airQualityNumber - 1];
  const pollutants = airQuality.components || {};

  const pollutantDetails = [
    { name: "PM2.5", value: pollutants.pm2_5 },
    { name: "PM10", value: pollutants.pm10 },
    { name: "O₃", value: pollutants.o3 },
    { name: "NO₂", value: pollutants.no2 },
  ];

  return (
    <section className="glass-panel flex min-h-[300px] flex-col justify-between rounded-[26px] p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-300">
          <Leaf size={21} />
          <h2 className="text-lg font-semibold text-white">Air Quality Index</h2>
        </div>
        <ShieldCheck size={19} className="text-white/50" />
      </div>

      <div className="mt-5 flex items-end gap-3">
        <span className="text-6xl font-bold leading-none tracking-tight text-white">
          {airQualityNumber}
        </span>
        <span className={"mb-1 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold " + selectedLevel.textColor}>
          {selectedLevel.label}
        </span>
      </div>

      <div className="mt-5">
        <div className="relative flex h-3 overflow-hidden rounded-full">
          {airQualityLevels.map((level) => (
            <div key={level.number} className={"h-full flex-1 " + level.color} />
          ))}
          <div
            className="absolute -top-1 h-5 w-1.5 rounded-full border border-white bg-white shadow-lg"
            style={{ left: "calc(" + ((airQualityNumber - 0.5) / 5) * 100 + "% - 3px)" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-white/55">
          <span>Good</span>
          <span>Fair</span>
          <span>Moderate</span>
          <span>Poor</span>
          <span>Very poor</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/80">
        {selectedLevel.description}
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/15 pt-3">
        {pollutantDetails.map((pollutant) => (
          <div key={pollutant.name}>
            <p className="text-[10px] text-white/55">{pollutant.name}</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {Number.isFinite(pollutant.value) ? pollutant.value.toFixed(1) : "—"}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-white/40">OpenWeather AQI scale: 1 (best) to 5 (worst)</p>
    </section>
  );
}

export default AirQuality;
