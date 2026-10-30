import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";

// Find a city's latitude and longitude from the city name.
async function getCityCoordinates(cityName) {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing. Add it to your .env file and restart the development server.");
  }

  const response = await axios.get(GEOCODING_URL, {
    params: {
      q: cityName,
      limit: 1,
      appid: API_KEY,
    },
  });

  if (response.data.length === 0) {
    throw new Error("We couldn't find that city. Check the spelling and try again.");
  }

  return response.data[0];
}

// Load current weather, the five-day forecast and air quality for coordinates.
async function getWeatherDataFromCoordinates(latitude, longitude) {
  const requestParameters = {
    lat: latitude,
    lon: longitude,
    appid: API_KEY,
    units: "metric",
  };

  // Run the three requests together so the dashboard loads faster.
  const [currentResponse, forecastResponse, airQuality] = await Promise.all([
    axios.get(BASE_URL + "/weather", {
      params: requestParameters,
    }),
    axios.get(BASE_URL + "/forecast", {
      params: requestParameters,
    }),
    getAirQuality(latitude, longitude),
  ]);

  return {
    currentWeather: currentResponse.data,
    forecast: forecastResponse.data,
    airQuality: airQuality,
    cityName: currentResponse.data.name,
    country: currentResponse.data.sys.country,
  };
}

// The air pollution endpoint can fail independently.
// If that happens, the weather dashboard should still be usable.
async function getAirQuality(latitude, longitude) {
  try {
    const response = await axios.get(BASE_URL + "/air_pollution", {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
      },
    });

    return response.data.list?.[0] ?? null;
  } catch {
    return null;
  }
}

// Search for a city by name and then load all of its weather information.
export async function getWeatherByCity(cityName) {
  try {
    if (!API_KEY) {
      throw new Error("OpenWeather API key is missing. Add it to your .env file and restart the development server.");
    }

    const city = await getCityCoordinates(cityName);
    const weatherData = await getWeatherDataFromCoordinates(city.lat, city.lon);

    return {
      ...weatherData,
      cityName: city.name,
      country: city.country,
    };
  } catch (error) {
    handleWeatherError(error);
  }
}

// Use the browser's location coordinates to load nearby weather.
export async function getWeatherByCoordinates(latitude, longitude) {
  try {
    if (!API_KEY) {
      throw new Error("OpenWeather API key is missing. Add it to your .env file and restart the development server.");
    }

    return await getWeatherDataFromCoordinates(latitude, longitude);
  } catch (error) {
    handleWeatherError(error);
  }
}

// Convert API errors into messages that are easier to understand.
function handleWeatherError(error) {
  if (error.response) {
    if (error.response.status === 401) {
      throw new Error("The API key is invalid or not active yet. Check your OpenWeather API key.");
    }

    if (error.response.status === 429) {
      throw new Error("The API request limit has been reached. Please try again later.");
    }

    if (error.response.status === 404) {
      throw new Error("Weather information could not be found for this location.");
    }
  }

  throw new Error(error.message || "Something went wrong while getting the weather. Please try again.");
}
