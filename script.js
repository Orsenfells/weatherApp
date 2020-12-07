async function getWeatherData(locate) {  
    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${locate}&appid=b9138dfaee9c9537cf889f71d76b8645`);
    const weatherData = await weather.json();
    return processWeatherData(weatherData)
}
function kelvinToFahrenheit(kelvin) {
    return Math.floor((kelvin - 273.15) * 1.8 + 32);
}
function processWeatherData(data)  {
    const weatherData = {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windspeed: data.wind.speed,
        cityName: data.name,
        country: data.sys.country,
        icon: data.weather[0].icon
    }
    return weatherData;
}
function handleError(fn) {
    return (...params) => {
        return fn(...params).catch((err) => {
            console.error(`Oops`, err)
        })
    }
}
function populateWeatherDisplay(data) {
    document.querySelector('.weather-information-container').style.display = 'flex';
    document.querySelector('.city').textContent = data.cityName;
    document.querySelector('.country').textContent = data.country;
    document.querySelector('.humidity').textContent = `Humidity: ${data.humidity}`;
    document.querySelector('.feels-like').textContent = `Feels Like: ${kelvinToFahrenheit(data.feelsLike)}`;
    document.querySelector('.windspeed').textContent = `Windspeed: ${data.windspeed}mph`;
    document.querySelector('.weather-description').textContent = data.description;
    document.querySelector('.current-temp').textContent = kelvinToFahrenheit(data.temp);
    document.querySelector('.icon').src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`
}

const safeWeather = handleError(getWeatherData)
const initialize = (() => {
    let form = document.querySelector('form');
    let search = document.querySelector('input');
    (async () => {
        let ping = await safeWeather('tokyo');
        populateWeatherDisplay(ping)
    })()

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let thing = await safeWeather(search.value)
        populateWeatherDisplay(thing)
    })
})()

