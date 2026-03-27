import { useRef, useState, useEffect} from 'react'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import Cookies from 'universal-cookie';

const cookies = new Cookies();



//do react-select-async-paginate for troubleshooting if something is wrong

//resource list for this section
//https://youtu.be/Reny0cTTv24?si=hz7Lcf0o6MU9zsEm
//https://youtu.be/UjeXpct3p7M?si=yfStG2BNVAMpS_mi
//https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete?


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
  const firstMount = useRef(true);

  console.log("WeatherPage mounted");
  const [weatherData, setWeatherData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [cards, setCards] = useState([]);
  const inputRef = useRef();

  
  useEffect(() => {
    const saved = localStorage.getItem("savedLocations");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCards(parsed);
        }
      } catch (e) {
        console.error("Failed to parse savedLocations:", e);
      }
    }

  }, []);

 useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return; // skip saving on first mount
    }

    console.log("Saving cards:", cards);
    localStorage.setItem("savedLocations", JSON.stringify(cards));
  }, [cards]);




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
        icon: data.weather[0].icon
      };

      setWeatherData(result);
      return result;
    } catch (error) {
        console.error("Search failed:", error);
    return null;
    }
  };

  async function fetchCitySuggestions(query){
    //if empty return
    if(!query) return [];

    //else process and grab city suggestions from api
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();

    return data.map(city => ({
      name: `${city.name}, ${city.country}`
    }));
  }

  //as user types in the search bar suggest cities, if no typing is occuring wait
  async function handleInputChange(e) {
    const value = e.target.value;
    if (value.length <2){
      setSuggestions([])
      return;
    }
    const result = await fetchCitySuggestions(value);
    setSuggestions(result)
  }

  //if the user chooses a city add a card
  async function handleSelect(city) {
    const cleanName = city.name.split(",")[0].trim();
    const result = await search(cleanName);
    console.log("Result from search:", result);
    //safty check
    if (!result) return;
    setCards(prev => [...prev, result]);
    setSuggestions([]);
    inputRef.current.value = cleanName;
  }

  //if the user wants to remove a card
  function handleRemoval(city) {
    const filtered = cards.filter(card => card.location !== city);
    setCards(filtered);
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
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}

    </div>
    <h2 className="mt-10">Saved Locations</h2>

    {/* Scrollable card grid */}
    <div className="saved-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {cards.map((card, index) => (
        <div key={index} className="weather-card p-4 border rounded-lg shadow">
            <img src={allIcons[card.icon]} />
            <h3>{card.location}</h3>
            <p>{card.temperature}°C</p>
            <p>Humidity: {card.humidity}%</p>
            <p>Wind: {card.windSpeed} km/h</p>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl" onClick={() => handleRemoval(card.location)}>Remove Location</button>
            {console.log("Rendering card:", card)}
        </div>
        ))}
    </div>

    </div>
  )
}
