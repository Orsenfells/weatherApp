async function getWeatherData(locate) {  
    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${locate}&appid=b9138dfaee9c9537cf889f71d76b8645`);
    const weatherData = await weather.json();
    return processWeatherData(weatherData)
}
function processWeatherData(data)  {
    const weatherData = {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windspeed: data.wind.speed,
        cityName: data.name,
        country: data.sys.country
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
const safeWeather = handleError(getWeatherData)
const initialize = (() => {
    let form = document.querySelector('form');
    let search = document.querySelector('input')
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let thing = await safeWeather(search.value)
        console.log(thing)
    })
})()

