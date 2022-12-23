const API_KEY = "0197c6051104f3988010cc8ea96f18e3";
const GOOGLEAPI = "AIzaSyBV3H6KrM3FmEwkWAcGBEuerUffJhvCQe0";

function renderWeather(city) {
    console.log(city);
    const markup = `
    <div class="left">
        <h2 class="city">${city.name}</h2>
        <h2 class="country">${convertCountryCode(city.sys.country)}</h2>
        <h1 class="temp">${Math.trunc(city.main.temp)}&#176;<sup class='degrees'>C</sup></h1>
        <img class="icon-image" src="http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png" alt="" class="weather-icon">
        <div class="description"><span class='key'>${capitalizeWeatherDescription(city.weather[0].description)}</span></div>
    </div>
    <div class="right">
        <div class="feels-like"><span class='key'>Feels Like:</span> ${Math.trunc(city.main.feels_like)}&#176;C</div>
        <div class='low-temp'><span class='key'>Low:</span> ${Math.trunc(city.main.temp_min)}&#176;C</div>
        <div class='high-temp'><span class='key'>High:</span> ${Math.trunc(city.main.temp_max)}&#176;C</div>
        <div class="humidity"><span class='key'>Humidity:</span> ${city.main.humidity}%</div>
        <div class="wind-speed"><span class='key'>Wind Speed:</span> ${city.wind.speed} km/h</div>

        <div class='flex-sun'>
            <div class="sunrise">
                <img class="sunrise-icon" src="./assets/sunrise.png" alt="sunrise icon">
                <div class="sunrise-time">
                <span class='key'>Sunrise: </span>${moment.utc(city.sys.sunrise, "X").add(city.timezone, "seconds").format("hh:mm a")} 
                </div>
            </div>
            <div class="sunset">
                <img class="sunset-icon" src="./assets/sunset.png" alt="sunset icon">
                <div class="sunset-time">
                <span class='key'> Sunset:</span> ${moment.utc(city.sys.sunset, "X").add(city.timezone, "seconds").format("hh:mm a")} 
                </div>
            </div>
        </div>
    </div>
    `;

    document.querySelector(".input-city").value = "";
    document.querySelector(".weather").insertAdjacentHTML("beforeend", markup);

    // Change the background to match the weather of city
    renderBackground(city.weather[0].main.toLowerCase());
}

function fetchWeather(city) {
    document.querySelector(".weather").innerHTML = "";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then((response) => {
            console.log(response)
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json()
        })
        .then((data) => renderWeather(data))
        .catch(err => {
            renderError(`Something went wrong. ${err.message}. Try again!`);
        });
}

// HELPERS
function convertCountryCode(country) {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(country);
}

// Match the background image to weather conditions
function renderBackground(condition) {
    document.body.style.backgroundImage = `url('./assets/weather/${condition}.jpeg')`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = 'center';
}

// If city not found, update this message to let user know no city found
function renderError(msg) {
    document.querySelector(".input-city").value = "";
    document.querySelector(".weather").insertAdjacentText('beforeend', msg);
}

function capitalizeWeatherDescription(description) {
    const arr = description.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
}

// CLICK OR ENTER SEARCH
document.querySelector(".search-btn").addEventListener("click", function() {
    fetchWeather(document.querySelector(".input-city").value);
});

document.querySelector(".input-city").addEventListener("keyup", function() {
    if (event.key === "Enter") {
        fetchWeather(document.querySelector(".input-city").value);
    }
});
