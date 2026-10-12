

import { useEffect, useState } from "react";
import "./App.css";

const CITY = {
  name: "Vijayawada",
  state: "Andhra Pradesh",
  country: "India",
  latitude: 16.5062,
  longitude: 80.648,
};

function getWeatherInfo(code) {
  if (code === 0) return { text: "Clear sky", icon: "☀️" };
  if (code === 1) return { text: "Mainly clear", icon: "🌤️" };
  if (code === 2) return { text: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { text: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { text: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code))
    return { text: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { text: "Rainy", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { text: "Snowy", icon: "❄️" };
  if ([95, 96, 99].includes(code))
    return { text: "Thunderstorm", icon: "⛈️" };

  return { text: "Variable conditions", icon: "🌡️" };
}

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const params = new URLSearchParams({
          latitude: CITY.latitude,
          longitude: CITY.longitude,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,is_day",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
          timezone: "auto",
          forecast_days: "5",
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`
        );

        if (!response.ok) {
          throw new Error("Weather service is unavailable.");
        }

        const data = await response.json();
        setWeather(data);
      } catch {
        setError("Unable to load weather. Check your internet and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  function temp(value) {
    const result =
      unit === "C" ? value : (value * 9) / 5 + 32;
    return `${Math.round(result)}°${unit}`;
  }

  if (loading) {
    return (
      <main className="app status-screen">
        <span className="status-icon">🌤️</span>
        <h2>Loading Vijayawada weather...</h2>
        <p>Please wait while we get the latest weather data.</p>
      </main>
    );
  }

  if (error || !weather) {
    return (
      <main className="app status-screen">
        <span className="status-icon">🌧️</span>
        <h2>Weather unavailable</h2>
        <p>{error || "Please refresh the page."}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </main>
    );
  }

  const current = weather.current;
  const daily = weather.daily;
  const info = getWeatherInfo(current.weather_code);

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">☀️</span>
          <span>
            Sky<span className="brand-accent">Cast</span>
          </span>
        </div>

        <div className="live-label">
          <span className="live-dot" />
          LIVE WEATHER
        </div>
      </header>

      <section className="intro">
        <p className="eyebrow">YOUR CITY WEATHER STATION</p>
        <h1>Weather in Vijayawada</h1>
        <p className="intro-text">
          Current weather and forecast for Andhra Pradesh, India.
        </p>
      </section>

      <section className="current-weather">
        <div className="weather-main">
          <p className="location-line">
            <span>📍</span> Vijayawada, India
          </p>

          <p className="region">
            Andhra Pradesh · {weather.timezone}
          </p>

          <p className="condition">{info.text}</p>

          <div className="temperature-row">
            <h2>{temp(current.temperature_2m)}</h2>

            <div className="unit-toggle">
              <button
                type="button"
                className={unit === "C" ? "active" : ""}
                onClick={() => setUnit("C")}
              >
                °C
              </button>

              <button
                type="button"
                className={unit === "F" ? "active" : ""}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
          </div>

          <p className="feels-like">
            Feels like {temp(current.apparent_temperature)}
          </p>
        </div>

        <div className="weather-illustration">
          <span>{info.icon}</span>
          <p>{current.is_day ? "Daytime" : "Nighttime"}</p>
        </div>

        <div className="hero-bottom">
          <div className="sun-time">
            <span className="small-icon">🌅</span>
            <span>Sunrise</span>
            <strong>
              {new Date(daily.sunrise[0]).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: weather.timezone,
              })}
            </strong>
          </div>

          <div className="sun-time">
            <span className="small-icon">🌇</span>
            <span>Sunset</span>
            <strong>
              {new Date(daily.sunset[0]).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: weather.timezone,
              })}
            </strong>
          </div>
        </div>
      </section>

      <section className="details-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WEATHER BREAKDOWN</p>
            <h2>Today's highlights</h2>
          </div>
          <span className="updated-label">Current conditions</span>
        </div>

        <div className="details-grid">
          <article className="detail-card">
            <div className="detail-top">
              <span>💧</span>
              <span className="detail-label">HUMIDITY</span>
            </div>
            <h3>{current.relative_humidity_2m}%</h3>
            <p>Relative humidity</p>
          </article>

          <article className="detail-card">
            <div className="detail-top">
              <span>💨</span>
              <span className="detail-label">WIND SPEED</span>
            </div>
            <h3>{current.wind_speed_10m} <small>km/h</small></h3>
            <p>Wind at this location</p>
          </article>

          <article className="detail-card">
            <div className="detail-top">
              <span>🌡️</span>
              <span className="detail-label">HIGH / LOW</span>
            </div>
            <h3>
              {temp(daily.temperature_2m_max[0])}
              <span className="low-temp">
                {" "}/ {temp(daily.temperature_2m_min[0])}
              </span>
            </h3>
            <p>Today's temperature range</p>
          </article>

          <article className="detail-card">
            <div className="detail-top">
              <span>🌧️</span>
              <span className="detail-label">RAINFALL</span>
            </div>
            <h3>{current.precipitation} <small>mm</small></h3>
            <p>Current precipitation</p>
          </article>
        </div>
      </section>

      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PLAN AHEAD</p>
            <h2>5-day forecast</h2>
          </div>
          <span className="updated-label">Daily outlook</span>
        </div>

        <div className="forecast-grid">
          {daily.time.map((date, index) => {
            const dayInfo = getWeatherInfo(daily.weather_code[index]);

            return (
              <article className="forecast-card" key={date}>
                <p className="forecast-day">
                  {index === 0
                    ? "Today"
                    : new Date(`${date}T12:00:00`).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          timeZone: weather.timezone,
                        }
                      )}
                </p>

                <span className="forecast-icon">{dayInfo.icon}</span>
                <p className="forecast-condition">{dayInfo.text}</p>
                <h3>{temp(daily.temperature_2m_max[index])}</h3>
                <p className="forecast-low">
                  Low {temp(daily.temperature_2m_min[index])}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="city-info">
        <h2>City details</h2>
        <p>
          <strong>{CITY.name}</strong>, {CITY.state}, {CITY.country}
        </p>

        <div className="coordinates">
          <span>
            Latitude <strong>{CITY.latitude}°</strong>
          </span>
          <span>
            Longitude <strong>{CITY.longitude}°</strong>
          </span>
          <span>
            Timezone <strong>{weather.timezone}</strong>
          </span>
        </div>
      </section>

      <footer className="footer">
        <span>☀️ SkyCast Weather Dashboard</span>
        <span>Weather data: Open-Meteo</span>
      </footer>
    </main>
  );
}

export default App;
