// Halden coordinates
const LATITUDE = 59.1231;
const LONGITUDE = 11.3875;
const API_URL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LATITUDE}&lon=${LONGITUDE}`;

// Required by YR API - setting a proper user agent
const headers = {
    'User-Agent': 'HaldenWeatherApp/1.0 github.com/yourusername'
};

async function getWeatherData() {
    try {
        const response = await fetch(API_URL, { headers });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function formatTemperature(temp) {
    return `${Math.round(temp)}°C`;
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString('no-NO', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(timeString) {
    return new Date(timeString).toLocaleDateString('no-NO', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function updateCurrentWeather(data) {
    const currentData = data.properties.timeseries[0];
    const temp = currentData.data.instant.details.air_temperature;
    const symbol = currentData.data.next_1_hours?.summary?.symbol_code || 'unknown';
    
    document.getElementById('temperature').textContent = formatTemperature(temp);
    document.getElementById('description').textContent = symbol.replace('_', ' ');
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    // Show next 24 hours in 3-hour intervals
    for (let i = 1; i < 9; i++) {
        const forecast = data.properties.timeseries[i];
        const temp = forecast.data.instant.details.air_temperature;
        const time = forecast.time;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="time">${formatTime(time)}</div>
            <div class="date">${formatDate(time)}</div>
            <div class="temp">${formatTemperature(temp)}</div>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

async function updateWeather() {
    const data = await getWeatherData();
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
    }
}

// Update weather immediately and then every 30 minutes
updateWeather();
setInterval(updateWeather, 30 * 60 * 1000);