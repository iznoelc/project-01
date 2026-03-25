import { useRef, useState } from 'react'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'

//holds icons to be accessed later
const allIcons = {};

[
  ["01d", "01n", clear_icon],
  ["02d", "02n", cloud_icon],
  ["03d", "03n", cloud_icon],
  ["04d", "04n", drizzle_icon],
  ["09d", "09n", rain_icon],
  ["10d", "10n", rain_icon],
  ["13d", "13n", snow_icon],
].forEach(([day, night, icon]) => {
  allIcons[day] = icon;
  allIcons[night] = icon;
});

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [cards, setCards] = useState([]);
  const inputRef = useRef();

  //city suggestions for the search bar
  const cityList = ["London", "Paris", "Tokyo", "New York", "Berlin", "Sydney", "Toronto", "Rome", "Madrid"];

  //search, simple data retrieval and storing using api
  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      const result = {
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      };

      setWeatherData(result);
      return result;
    } catch (error) {
        //blank, add actual error later perhaps
    }
  };

  //as user searches suggest roptions for cities
  function handleInputChange(e) {
    const value = e.target.value;
    const matches = cityList.filter(city =>
      city.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(matches);
  }

  //if the user chooses a city change current card to new card info
  async function handleSelect(city) {
    const result = await search(city);
    setCards(prev => [...prev, result]);
    setSuggestions([]);
  }

  //webpage content here
  return (
    <div className="p-10 w-full max-w-5xl mx-auto h-[calc(100vh-160px)] overflow-y-auto">

    {/* Search bar wrapper */}
    <div className="relative w-full max-w-sm">
        <label className="input w-full">
        <input
            ref={inputRef}
            type="search"
            placeholder="Search"
            onChange={handleInputChange}
        />
        </label>

        {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
            {suggestions.map(city => (
            <li
                key={city}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(city)}
            >
                {city}
            </li>
            ))}
        </ul>
        )}
    </div>

    {/* Weather display */}
    {weatherData.temperature && (
        <>
        <img src={weatherData.icon} className="weather-icon" />
        <p>{weatherData.temperature}°C</p>
        <p>{weatherData.location}</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Wind: {weatherData.windSpeed} km/h</p>
        </>
    )}

    <h2 className="mt-10">Saved Locations</h2>

    {/* Scrollable card grid */}
    <div className="saved-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {cards.map((card, index) => (
        <div key={index} className="weather-card p-4 border rounded-lg shadow">
            <img src={card.icon} />
            <h3>{card.location}</h3>
            <p>{card.temperature}°C</p>
            <p>Humidity: {card.humidity}%</p>
            <p>Wind: {card.windSpeed} km/h</p>
        </div>
        ))}
    </div>

    </div>
  )
}
