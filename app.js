const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "6e3aeb91e34582c46a84690b4e7e621e";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.querySelector("#weather");
const locationIcon = document.getElementById("location");

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
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
  console.log(data);
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
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("Please Enter city name!");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWether(renderCurrentWether(currentData));
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getCurrentWeatherByCoordinates(latitude, longitude);
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
