import { useRef, useState } from 'react'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

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



export default function WeatherPage(){
    const [weatherData,setWeatherData] = useState({});
    const inputRef = useRef()

    const search = async (city, setWeatherData)=> {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        setWeatherData({
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            temperature: Math.floor(data.main.temp),
            location: data.name,
            icon: icon
        })
    } catch (error) {
        
    }
}

    return (
        <>
            <label className="input">
                <input ref={inputRef} type="search" required placeholder="Search" />
                <svg onClick={()=>{search(inputRef.current.value, setWeatherData)}} className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
            </label>

            {weatherData.temperature && (
                <>
                <img src={weatherData.icon} alt="" className='weather-icon'/>
                <p>{weatherData.temperature}°C</p>
                <p>{weatherData.location}</p>
                <img src={humidity_icon} alt="" />
                <p>{weatherData.humidity}%</p>
                <img src={wind_icon} alt="" />
                <p>{weatherData.windSpeed} km/h</p>
                </>
            )}
        </>
    );
}