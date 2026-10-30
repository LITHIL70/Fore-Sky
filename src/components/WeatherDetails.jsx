import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Compass,
  Thermometer,
  CloudSun,
} from "lucide-react";

function getWindDirection(degrees = 0) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(degrees / 45) % 8;
  return directions[directionIndex];
}

function calculateDewPoint(temperature, humidity) {
  // Magnus formula: an estimate based on temperature and relative humidity.
  const a = 17.27;
  const b = 237.7;
  const humidityRatio = Math.max(humidity, 1) / 100;
  const gamma = (a * temperature) / (b + temperature) + Math.log(humidityRatio);
  return (b * gamma) / (a - gamma);
}

function getHumidityMessage(humidity) {
  if (humidity < 30) return "Dry air";
  if (humidity <= 60) return "Comfortable";
  if (humidity <= 75) return "A little humid";
  return "Very humid";
}

function WeatherDetails({ weather }) {
  const windSpeedInKmh = (weather.wind.speed * 3.6).toFixed(1);
  const windDirection = getWindDirection(weather.wind.deg);
  const dewPoint = calculateDewPoint(weather.main.temp, weather.main.humidity);

  const details = [
    {
      title: "Humidity",
      value: weather.main.humidity + "%",
      note: getHumidityMessage(weather.main.humidity),
      Icon: Droplets,
      iconColor: "text-cyan-300",
    },
    {
      title: "Wind speed",
      value: windSpeedInKmh + " km/h",
      note: "Current wind speed",
      Icon: Wind,
      iconColor: "text-sky-300",
    },
    {
      title: "Pressure",
      value: weather.main.pressure + " hPa",
      note: "Atmospheric pressure",
      Icon: Gauge,
      iconColor: "text-violet-200",
    },
    {
      title: "Visibility",
      value: ((weather.visibility || 0) / 1000).toFixed(1) + " km",
      note: "Viewing distance",
      Icon: Eye,
      iconColor: "text-blue-200",
    },
    {
      title: "Cloud cover",
      value: (weather.clouds?.all ?? 0) + "%",
      note: "Clouds in the sky",
      Icon: Cloud,
      iconColor: "text-sky-200",
    },
    {
      title: "Dew point",
      value: Math.round(dewPoint) + "°C",
      note: "Moisture in the air",
      Icon: Thermometer,
      iconColor: "text-emerald-200",
    },
    {
      title: "Wind direction",
      value: windDirection,
      note: (weather.wind.deg ?? 0) + "° compass direction",
      Icon: Compass,
      iconColor: "text-cyan-200",
    },
    {
      title: "Feels like",
      value: Math.round(weather.main.feels_like) + "°C",
      note: "How warm it feels",
      Icon: CloudSun,
      iconColor: "text-amber-200",
    },
  ];

  return (
    <section className="glass-panel overflow-hidden rounded-[24px]">
      <div className="grid grid-cols-2 divide-x divide-y divide-white/15 sm:grid-cols-4 sm:divide-y-0">
        {details.map((detail) => {
          const Icon = detail.Icon;

          return (
            <article
              key={detail.title}
              className="min-w-0 px-4 py-4 transition hover:bg-white/[0.06] sm:px-5 sm:py-5"
            >
              <div className="flex items-center gap-2">
                <Icon size={22} className={"shrink-0 " + detail.iconColor} />
                <p className="truncate text-xs font-medium text-white/75 sm:text-sm">
                  {detail.title}
                </p>
              </div>
              <p className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">
                {detail.value}
              </p>
              <p className="mt-1 truncate text-[11px] text-white/60 sm:text-xs">
                {detail.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherDetails;
