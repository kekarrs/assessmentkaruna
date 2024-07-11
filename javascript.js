
document.addEventListener('DOMContentLoaded', () =>{
     
    const API_KEY = 'ebf5802a1a6ccc297475de3ac6b96289';
    const city = 'Kuching';
    const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastAPIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    // Fetch weather data
    fetch(weatherAPIURL)
        .then(response => response.json())
        .then(data => {
            updateWeather(data);
        })

        .catch(error =>{
            console.error('Error fetching weather data:', error);
            displayError('Failed to fetch weather data. Please try again later.');
        });

    // Fetch forecast data
    fetch(forecastAPIURL)
        .then(response => response.json())
        .then(data => {
            updateForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            displayError('Failed to fetch forecast data. Please try again later.');
        });

    function updateWeather(data){
        const cityElement = document.getElementById('city');
        const dateElement = document.getElementById('date');
        const tempElement = document.getElementById('temp');
        const conditionElement = document.getElementById('condition');
        const iconElement = document.getElementById('icon');

        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        cityElement.textContent = data.name;
        dateElement.textContent = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        tempElement.textContent = `${data.main.temp}°C`;
        conditionElement.textContent = data.weather[0].description;
        iconElement.src = weatherIcon;
        iconElement.alt = data.weather[0].description;
    }

    function updateForecast(forecastData) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); 

        const tomorrowForecast = forecastData.find(forecast => {
            const forecastDate = new Date(forecast.dt_txt);
            return forecastDate.getDate() === tomorrow.getDate();
        });

        if (tomorrowForecast) {
            const forecastContainer = document.querySelector('.forecast-container');
            forecastContainer.innerHTML = ''; 

            const forecastDate = new Date(tomorrowForecast.dt_txt);

            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = `
                <p>${forecastDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <img src="http://openweathermap.org/img/wn/${tomorrowForecast.weather[0].icon}.png" alt="${tomorrowForecast.weather[0].description}">
                <p>${tomorrowForecast.weather[0].description}</p>
                <p>${Math.round(tomorrowForecast.main.temp)}°C</p>
            `;
            forecastContainer.appendChild(forecastCard);
        } else {
            displayError('Forecast data for tomorrow not available.');
        }
    }

    function displayError(message){
        const container = document.querySelector('.container');
        container.innerHTML = `<p class="error">${message}</p>`;
    }
});