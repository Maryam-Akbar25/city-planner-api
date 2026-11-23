//(Provides weather information for a given city using Open-Meteo API)
const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm'
};

export const getCityWeather = async (city) => {
  // 1. Convert city name to coordinates
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);

  if (!geoRes.ok) {
    throw new Error('Failed to reach geocoding service.');
  }

  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    const error = new Error(`City "${city}" not found.`);
    error.statusCode = 404;
    throw error;
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // 2. Fetch live weather using coordinates
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const weatherRes = await fetch(weatherUrl);

  if (!weatherRes.ok) {
    throw new Error('Failed to reach weather forecast service.');
  }

  const weatherData = await weatherRes.json();
  const current = weatherData.current_weather;

  return {
    resolvedCity: `${name}, ${country}`,
    temperatureC: current.temperature,
    windspeedKmh: current.windspeed,
    weatherSummary: WEATHER_CODES[current.weathercode] || `Code ${current.weathercode}`
  };
};