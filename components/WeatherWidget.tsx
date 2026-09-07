'use client';

import { useEffect, useState } from 'react';

export default function WeatherWidget() {
    const [temp, setTemp] = useState('--°C');
    const [aqi, setAqi] = useState('');
    const [aqiClass, setAqiClass] = useState('good');
    const [time, setTime] = useState('--:--');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            let hours = istTime.getHours();
            const minutes = istTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const strMinutes = minutes < 10 ? '0' + minutes : minutes;
            setTime(`${hours}:${strMinutes} ${ampm} IST`);
        };

        updateTime();
        const timeInterval = setInterval(updateTime, 60000);
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Approximate coordinates for Noida
                const lat = 28.5355;
                const lon = 77.3910;
                
                // Fetch Temp
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                if (weatherRes.ok) {
                    const data = await weatherRes.json();
                    setTemp(`${Math.round(data.current_weather.temperature)}°C`);
                }

                // Fetch AQI
                const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`);
                if (aqiRes.ok) {
                    const aqiData = await aqiRes.json();
                    const val = aqiData.current.us_aqi;
                    let aqiLabel = 'AQI Good';
                    let cls = 'good';
                    if (val > 50 && val <= 100) { aqiLabel = 'AQI Moderate'; cls = 'mod'; }
                    else if (val > 100 && val <= 150) { aqiLabel = 'AQI Unhealthy (Sensitive)'; cls = 'poor'; }
                    else if (val > 150) { aqiLabel = 'AQI Unhealthy'; cls = 'poor'; }
                    
                    setAqi(aqiLabel);
                    setAqiClass(cls);
                }
            } catch (error) {
                console.error("Failed to fetch weather", error);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="about-card about-weather reveal-right" id="weatherWidget">
            <div className="weather-header">
                <span className="weather-icon-big" id="weatherIcon"><i className="fa-solid fa-cloud-sun"></i></span>
                <span className="weather-temp-big" id="weatherTemp">{temp}</span>
            </div>
            <div className="weather-footer">
                <div>
                    <div className="weather-location">Noida</div>
                    <div className="weather-time-clock" id="localTime">{time}</div>
                </div>
                {aqi && <span className={`weather-aqi-badge ${aqiClass}`} id="weatherAqi">{aqi}</span>}
            </div>
        </div>
    );
}
