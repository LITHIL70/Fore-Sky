import { Lightbulb, Umbrella, Sun, Wind, Shirt } from "lucide-react";

function WeatherAdvice({ weather, forecast }) {
  const currentCondition = weather.weather?.[0]?.main?.toLowerCase() || "";
  const currentTemperature = weather.main.temp;
  const currentWindSpeed = weather.wind.speed;
  const upcomingForecasts = forecast?.list?.slice(0, 8) || [];

  // Check the next forecast intervals for rain, rather than guessing from clouds.
  const rainExpectedSoon = upcomingForecasts.some((forecastItem) => {
    const forecastCondition = forecastItem.weather?.[0]?.main?.toLowerCase() || "";
    const forecastRainVolume = forecastItem.rain?.["3h"] || 0;
    return forecastCondition.includes("rain") || forecastRainVolume > 0;
  });

  let recommendation = {
    title: "Enjoy your day",
    message: "Conditions look fairly settled. Check the forecast again before heading out.",
    Icon: Lightbulb,
    color: "text-cyan-200",
  };

  if (rainExpectedSoon || currentCondition.includes("rain") || currentCondition.includes("drizzle")) {
    recommendation = {
      title: "Carry an umbrella",
      message: "Rain is showing in the current conditions or upcoming forecast. A small umbrella or raincoat could help.",
      Icon: Umbrella,
      color: "text-sky-200",
    };
  } else if (currentCondition.includes("thunder")) {
    recommendation = {
      title: "Be careful outdoors",
      message: "Thunderstorm conditions are reported. Avoid exposed areas and postpone outdoor activities if possible.",
      Icon: Wind,
      color: "text-violet-200",
    };
  } else if (currentTemperature >= 34) {
    recommendation = {
      title: "Stay cool and hydrated",
      message: "It is hot right now. Drink water, seek shade and avoid strenuous activity during the hottest hours.",
      Icon: Sun,
      color: "text-amber-200",
    };
  } else if (currentTemperature <= 12) {
    recommendation = {
      title: "Wear an extra layer",
      message: "It is quite cool. Consider a jacket or warm layer when going outside.",
      Icon: Shirt,
      color: "text-cyan-100",
    };
  } else if (currentWindSpeed >= 10) {
    recommendation = {
      title: "Expect breezy conditions",
      message: "Winds are relatively strong. Secure loose items and take care when cycling.",
      Icon: Wind,
      color: "text-sky-200",
    };
  } else if (currentCondition.includes("clear")) {
    recommendation = {
      title: "A bright day ahead",
      message: "Consider sunglasses and sunscreen if you will be outside for a while.",
      Icon: Sun,
      color: "text-amber-200",
    };
  }

  const RecommendationIcon = recommendation.Icon;

  return (
    <section className="glass-panel flex items-start gap-4 rounded-[24px] p-5 sm:p-6">
      <div className={"rounded-2xl bg-white/10 p-3 " + recommendation.color}>
        <RecommendationIcon size={25} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
          Weather tip
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">{recommendation.title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/75">
          {recommendation.message}
        </p>
      </div>
    </section>
  );
}

export default WeatherAdvice;
