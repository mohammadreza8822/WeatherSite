const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "6e3aeb91e34582c46a84690b4e7e621e";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.querySelector("#forecast");
const locationIcon = document.getElementById("location");

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

const getForecastWeatherByName = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

const getCurrentWeatherByCoordinates = async (lat, lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

const renderCurrentWether = (data) => {
  try {
    const weatherJSX = `
    <h1>${data.name}, ${data.sys.country}</h1>
    <div id="main">
      <img alt="weather icon" src="https://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png"/>
      <span>${data.weather[0].main}</span>
      <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
      <p>Humidity: <span>${data.main.humidity}</span></p>
      <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
    </div>
    `;
    weatherContainer.innerHTML = weatherJSX;
  } catch {
    console.error("Error in renderCurrentWether:", error);
  }
};

const renderForecastWeather = (data) => {
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
    <div>
      <img alt="weather icon" src="https://openweathermap.org/img/w/${
        i.weather[0].icon
      }.png"/>
      <h3>${DAYS[new Date(i.dt * 1000).getDay()]}</h3>
      <p>${Math.round(i.main.temp)} °C</p>
      <span>${i.weather[0].main}</span>
    </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("Please Enter city name!");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWether(currentData);
  const forecastData = await getForecastWeatherByName(cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getCurrentWeatherByCoordinates(latitude, longitude);
  return currentData;
};

const errorCallback = (error) => {
  console.log(error);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    alert("Your browser does not support geo location");
  }
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
