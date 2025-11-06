import { useState, useEffect } from "react";
import "../css/apipage.css";
import { usePageMetadata } from "../hooks/usePageMetadata";
import favicon from "../assets/favicon.png";

export default function ApiPage() {
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevIndex, setSelectedDevIndex] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const developers = [
    { name: "Jose", city: "Rafaela", province: "Santa Fe", lat: -31.25, lon: -61.49 },
    { name: "Victoria", city: "Lanús", province: "Buenos Aires", lat: -34.7, lon: -58.39 },
    { name: "Estiven", city: "Tigre", province: "Buenos Aires", lat: -34.43, lon: -58.58 },
    { name: "Lucas", city: "Devoto", province: "Buenos Aires", lat: -34.63, lon: -58.52 },
    { name: "Sebastian", city: "Mendoza", province: "Mendoza", lat: -32.89, lon: -68.83 }
  ];

  const provinces = [
    { name: "Buenos Aires", city: "La Plata", lat: -34.921, lon: -57.954 },
    { name: "Córdoba", city: "Córdoba", lat: -31.420, lon: -64.188 },
    { name: "Santa Fe", city: "Santa Fe", lat: -31.652, lon: -60.700 },
    { name: "Mendoza", city: "Mendoza", lat: -32.890, lon: -68.833 },
    { name: "Tucumán", city: "San Miguel de Tucumán", lat: -26.824, lon: -65.222 },
    { name: "Salta", city: "Salta", lat: -24.787, lon: -65.412 },
    { name: "Jujuy", city: "San Salvador de Jujuy", lat: -24.185, lon: -65.299 },
    { name: "Chaco", city: "Resistencia", lat: -27.451, lon: -58.986 },
    { name: "Corrientes", city: "Corrientes", lat: -27.469, lon: -58.830 },
    { name: "Misiones", city: "Posadas", lat: -27.362, lon: -55.900 },
    { name: "Entre Ríos", city: "Paraná", lat: -31.731, lon: -60.523 },
    { name: "La Pampa", city: "Santa Rosa", lat: -36.620, lon: -64.290 },
    { name: "San Juan", city: "San Juan", lat: -31.533, lon: -68.521 },
    { name: "San Luis", city: "San Luis", lat: -33.297, lon: -66.336 },
    { name: "Catamarca", city: "San Fernando del Valle de Catamarca", lat: -28.469, lon: -65.779 },
    { name: "La Rioja", city: "La Rioja", lat: -29.413, lon: -66.855 },
    { name: "Santiago del Estero", city: "Santiago del Estero", lat: -27.783, lon: -64.267 },
    { name: "Neuquén", city: "Neuquén", lat: -38.951, lon: -68.059 },
    { name: "Río Negro", city: "Viedma", lat: -40.813, lon: -62.996 },
    { name: "Chubut", city: "Rawson", lat: -43.300, lon: -65.100 },
    { name: "Santa Cruz", city: "Río Gallegos", lat: -51.623, lon: -69.218 },
    { name: "Tierra del Fuego", city: "Ushuaia", lat: -54.801, lon: -68.303 },
    { name: "Formosa", city: "Formosa", lat: -26.185, lon: -58.175 }
  ];

  usePageMetadata("Equipo Innovador - Nuestros Climas", favicon);

  async function loadCurrentLocationWeather() {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const w = await fetchWeatherForCoords(latitude, longitude);
            setSelectedWeather({
              name: "Tu ubicación",
              city: "Ubicación actual",
              province: "",
              ...w,
            });
            setLoading(false);
          },
          async () => {
            const w = await fetchWeatherForCoords(-34.61, -58.38);
            setSelectedWeather({
              name: "Ubicación por defecto",
              city: "Buenos Aires",
              province: "Buenos Aires",
              ...w,
            });
            setLoading(false);
          }
        );
      } else {
        const w = await fetchWeatherForCoords(-34.61, -58.38);
        setSelectedWeather({
          name: "Ubicación por defecto",
          city: "Buenos Aires",
          province: "Buenos Aires",
          ...w,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener el clima de la ubicación:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  async function fetchWeatherForCoords(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current || {};
    const d = data.daily || {};
    const dailyItems = (d.time || []).slice(0, 7).map((t, i) => ({
      time: t,
      tempMax: Array.isArray(d.temperature_2m_max) ? d.temperature_2m_max[i] : undefined,
      tempMin: Array.isArray(d.temperature_2m_min) ? d.temperature_2m_min[i] : undefined,
      code: Array.isArray(d.weather_code) ? d.weather_code[i] : undefined,
    }));
    return {
      temp: c.temperature_2m,
      apparent: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      pressure: c.pressure_msl,
      cloudCover: c.cloud_cover,
      code: c.weather_code,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      sunrise: Array.isArray(d.sunrise) ? d.sunrise[0] : undefined,
      sunset: Array.isArray(d.sunset) ? d.sunset[0] : undefined,
      daily: dailyItems,
      lat,
      lon,
    };
  }

  async function handleDeveloperChange(e) {
    const idxStr = e.target.value;
    if (idxStr === "") return;
    const idx = Number(idxStr);
    const dev = developers[idx];
    setLoading(true);
    try {
      const w = await fetchWeatherForCoords(dev.lat, dev.lon);
      setSelectedWeather({ name: dev.name, city: dev.city, province: dev.province, ...w });
      setSelectedDevIndex(idxStr);
      // limpiar selección de provincia cuando se elige un developer
      setSelectedProvinceName("");
    } catch (error) {
      console.error("Error al obtener el clima del developer:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProvinceChange(e) {
    const name = e.target.value;
    if (name === "") return;
    const prov = provinces.find((p) => p.name === name);
    if (!prov) return;
    setLoading(true);
    try {
      const w = await fetchWeatherForCoords(prov.lat, prov.lon);
      setSelectedWeather({ name: prov.name, city: prov.city, province: prov.name, ...w });
      setSelectedProvinceName(name);
      // limpiar selección de developer cuando se elige una provincia
      setSelectedDevIndex("");
    } catch (error) {
      console.error("Error al obtener el clima de la provincia:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setLoading(true);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=es&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error en geocoding:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectPlace(place) {
    if (!place) return;
    setLoading(true);
    try {
      const w = await fetchWeatherForCoords(place.latitude, place.longitude);
      setSelectedWeather({
        name: place.name,
        city: place.name,
        province: place.admin1 || place.country || "",
        ...w,
      });
      // limpiar otros selects al elegir búsqueda personalizada
      setSelectedDevIndex("");
      setSelectedProvinceName("");
    } catch (error) {
      console.error("Error al obtener clima para el lugar:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearToCurrent() {
    // limpiar estados de búsqueda y selects
    setSearchQuery("");
    setSearchResults([]);
    setSelectedDevIndex("");
    setSelectedProvinceName("");
    setSelectedWeather(null);
    setLoading(true);
    await loadCurrentLocationWeather();
  }

  function getWeatherDescription(code) {
    const weatherCodes = {
      0: "Despejado",
      1: "Mayormente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Niebla",
      48: "Niebla helada",
      51: "Llovizna ligera",
      53: "Llovizna moderada",
      55: "Llovizna intensa",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      65: "Lluvia intensa",
      71: "Nieve ligera",
      73: "Nieve moderada",
      75: "Nieve intensa",
      95: "Tormenta eléctrica",
    };
    return weatherCodes[code] || "Condición desconocida";
  }

  function degToCompass(deg) {
    if (deg === undefined || deg === null) return "";
    const dirs = ["N", "N-NE", "NE", "E-NE", "E", "E-SE", "SE", "S-SE", "S", "S-SO", "SO", "O-SO", "O", "O-NO", "NO", "N-NO"];
    const ix = Math.round(deg / 22.5) % 16;
    return dirs[ix];
  }

  function formatHour(iso) {
    if (!iso) return "--:--";
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  function formatDay(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return days[d.getDay()];
  }

  function getWeatherIcon(code) {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 55) return "🌦️";
    if (code >= 61 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 75) return "❄️";
    if (code === 95) return "⛈️";
    return "☁️";
  }

  function getCardStyle(code) {
    if (code === 0 || code === 1) return { background: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)" };
    if (code === 2 || code === 3) return { background: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)" };
    if (code === 45 || code === 48) return { background: "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)" };
    if (code >= 51 && code <= 65) return { background: "linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)" };
    if (code >= 71 && code <= 75) return { background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" };
    if (code === 95) return { background: "linear-gradient(135deg, #E9D5FF 0%, #C4B5FD 100%)" };
    return { background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)" };
  }

  return (
    <div className="weather-dashboard">
      <section className="api-header">
        <div className="container">
          <h1>Nuestros climas</h1>
          <p>Acá vas a poder ver nuestros climas, el tuyo y el de donde vos quieras buscar.</p>
        </div>
      </section>

      <section className="selectors">
        <div className="container">
          <div className="search-wrapper">
            <form className="search-group" onSubmit={handleSearchSubmit}>
              <label htmlFor="search-input">Buscar dirección o ciudad</label>
              <div className="search-row">
                <input
                  id="search-input"
                  className="search-control"
                  type="text"
                  placeholder="Ej: Rosario, Santa Fe"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">Buscar</button>
                <button type="button" className="clear-btn" onClick={handleClearToCurrent}>Limpiar</button>
              </div>
            </form>
            {Array.isArray(searchResults) && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((r) => (
                  <button
                    key={`${r.latitude}-${r.longitude}-${r.name}`}
                    className="result-item"
                    type="button"
                    onClick={() => handleSelectPlace(r)}
                  >
                    {r.name}{r.admin1 ? `, ${r.admin1}` : ""}{r.country ? `, ${r.country}` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="selector-group">
            <label htmlFor="dev-select">Ver clima de developer</label>
            <select id="dev-select" className="select-control" value={selectedDevIndex} onChange={handleDeveloperChange}>
              <option value="" disabled>Selecciona un developer</option>
              {developers.map((d, idx) => (
                <option key={d.name} value={idx}>{d.name} - {d.city}</option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <label htmlFor="prov-select">Ver clima por provincia</label>
            <select id="prov-select" className="select-control" value={selectedProvinceName} onChange={handleProvinceChange}>
              <option value="" disabled>Selecciona una provincia</option>
              {provinces.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        selectedWeather && (
          <div className="cards-container">
            <div className="weather-card" style={getCardStyle(selectedWeather.code)}>
              <div className="card-header">
                <div className="left">
                  <h3 className="dev-name">{selectedWeather.name}</h3>
                  <p className="dev-location">
                    {selectedWeather.city}{selectedWeather.province ? `, ${selectedWeather.province}` : ""}
                  </p>
                </div>
                <div className="right">
                  <div className="weather-icon">
                    {getWeatherIcon(selectedWeather.code)}
                  </div>
                </div>
              </div>

              <div className="main-stats">
                <div className="temperature">
                  {Math.round(selectedWeather.temp)}°C
                </div>
                <div className="description">
                  <div className="cond">{getWeatherDescription(selectedWeather.code)}</div>
                  <div className="feels">Se siente como {Math.round(selectedWeather.apparent ?? selectedWeather.temp)}°</div>
                </div>
              </div>

              <div className="details">
                <div>🌅 Amanecer: {formatHour(selectedWeather.sunrise)}</div>
                <div>🌇 Atardecer: {formatHour(selectedWeather.sunset)}</div>
                <div>💧 Humedad: {selectedWeather.humidity ?? "-"}%</div>
                <div>💨 Viento: {selectedWeather.windSpeed ?? "-"} km/h</div>
                <div>🧭 Dirección: {degToCompass(selectedWeather.windDirection)}</div>
                <div>🧪 Presión: {selectedWeather.pressure ?? "-"} hPa</div>
              </div>

              {Array.isArray(selectedWeather.daily) && selectedWeather.daily.length > 0 && (
                <div className="weekly">
                  {selectedWeather.daily.map((d, i) => (
                    <div key={i} className="day">
                      <div className="dow">{formatDay(d.time)}</div>
                      <div className="ico">{getWeatherIcon(d.code)}</div>
                      <div className="temps"> {Math.round(d.tempMax ?? 0)}° / {Math.round(d.tempMin ?? 0)}°</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      <p className="footer-text">
        Datos provistos por Open-Meteo API • Actualizado en tiempo real
      </p>
    </div>
  );
}