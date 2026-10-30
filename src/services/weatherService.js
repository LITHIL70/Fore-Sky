import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";

async function getCityCoordinates(cityName) {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing. Add it to your .env file and restart the development server.");
  }

  const response = await axios.get(GEOCODING_URL, {
    params: { q: cityName, limit: 1, appid: API_KEY },
  });

  if (response.data.length === 0) {
    throw new Error("We couldn't find that city. Check the spelling and try again.");
  }

  return response.data[0];
}

async function getAirQuality(lat, lon) {
  try {
    const response = await axios.get(BASE_URL + "/air_pollution", {
      params: { lat, lon, appid: API_KEY },
    });
    return response.data.list?.[0] ?? null;
  } catch {
    // Keep the rest of the weather dashboard working if AQI is unavailable.
    return null;
  }
}

export async function getWeatherByCity(cityName) {
  try {
    const city = await getCityCoordinates(cityName);
    const parameters = { lat: city.lat, lon: city.lon, appid: API_KEY, units: "metric" };

    const [currentResponse, forecastResponse, airQuality] = await Promise.all([
      axios.get(BASE_URL + "/weather", { params: parameters }),
      axios.get(BASE_URL + "/forecast", { params: parameters }),
      getAirQuality(city.lat, city.lon),
    ]);

    return {
      currentWeather: currentResponse.data,
      forecast: forecastResponse.data,
      airQuality,
      cityName: city.name,
      country: city.country,
    };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) throw new Error("The API key is invalid or not active yet. Check your OpenWeather API key.");
      if (error.response.status === 429) throw new Error("The API request limit has been reached. Please try again later.");
      if (error.response.status === 404) throw new Error("Weather information could not be found for this location.");
    }
    throw new Error(error.message || "Something went wrong while getting the weather. Please try again.");
  }
}
