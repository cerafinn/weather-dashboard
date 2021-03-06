var apiKey = "e8e23b4a156b56df078fbb140bab8322";

var userSearch = document.querySelector("#city-name");
var searchForm = document.querySelector("#search-form");
var prevCities = document.querySelector("#previous-cities");
var prevCity = document.querySelector(".prev-city");
var weatherContainer = document.querySelector("#currentCity");

var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

var searchHistory = function() {
  if(cityArray !== null) {
    prevCities.innerHTML = "";
    for(var i = 0; i< cityArray.length; i++) {
      var searchHistory = document.createElement("li");
      searchHistory.classList = "list-group-item prev-city";
      searchHistory.textContent = cityArray[i];
      prevCities.appendChild(searchHistory);
    }
  }
}

var getWeather = function(city) {
  // format the weather api url
  var weatherToday = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
  var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

  // get today's forecast
  fetch(weatherToday)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
      displayWeather(data);
      });
    } else {
      alert("Error");
    }
  })
  .catch(function(error) {
    alert("Unable to connect to openWeather");
  })

  // get 5 day forecast
  fetch(fiveDay)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
      displayFiveDay(data)
      });
    } else {
      alert("Error");
    }
  })
  .catch(function(error) {
    alert("Unable to connect to openWeather");
  })
};

var displayWeather = function(weather) {
  if (weather.length === 0) {
    weatherContainer.textContent = "No weather information found.";
    return;
  }

  var city = weather.name;
  var date = moment().format('L');
  var icon = 'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '.png';
  var tempF = ((weather.main.temp - 273.15) * 1.8 + 32).toFixed(2);
  var humidity = weather.main.humidity;
  var windSpeed = weather.wind.speed;

  $("#name-date-icon").html(`${city} (${date}) <img src=${icon} />`);
  $("#today-temp").text(tempF);
  $("#today-humidity").text(humidity);
  $("#today-wind-speed").text(windSpeed);

  var uvApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + weather.coord.lat + '&lon=' + weather.coord.lon + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey;
  fetch(uvApi)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        var uvIndex = (data.current.uvi).toFixed(2);
        $("#today-uv-index").text(uvIndex);

        if (uvIndex < 2) {
          $("#today-uv-index").attr("style", "background-color: #198754")
        } else if (uvIndex > 5) {
          $("#today-uv-index").attr("style", "background-color: #dc3545")
        } else {
          $("#today-uv-index").attr("style", "background-color: #ffbf00")
        }
      });
    } else {
      alert("Error");
    }
  })
  .catch(function(error) {
    alert("Unable to connect to openWeather");
  })}

var displayFiveDay = function(forecast) {
  if (forecast.length === 0) {
    weatherContainer.textContent = "No weather information found.";
    return;
  }

  $("#five-day").empty();

  for(var i = 0; i < forecast.list.length; i+=8 ) {
    var date = moment(forecast.list[i].dt_txt).format('L');
    var tempF = ((forecast.list[i].main.temp - 273.15) * 1.8 + 32).toFixed(2);
    var icon = 'https://openweathermap.org/img/wn/' + forecast.list[i].weather[0].icon + '.png';
    var humidity = forecast.list[i].main.humidity;

    $("#five-day").append(`
    <div class="col-sm-2 weather-card">
    <div class="card future-weather">
    <h5>${date}<h5>
    <img src="${icon}" />
    <p>Temp: ${tempF}</p>
    <p>Humidity: ${humidity}</p>
    </div>
    `)
  }
}

var previousSearch = function(event) {
  event.preventDefault();

  var cityName = prevCity.text();
  getWeather(cityName);
}

var formSubmitHandler = function(event) {
  event.preventDefault();

  var cityName = userSearch.value.trim().toUpperCase();
  
  if (cityName) {

    getWeather(cityName);
    userSearch.value = "";

    if (!cityArray.includes(cityName)) {
      cityArray.push(cityName);
      localStorage.setItem("cityArray", JSON.stringify(cityArray));
      searchHistory()
    }
  } else {
    alert("Please enter a city name");
  }
};

searchHistory();

searchForm.addEventListener("submit", formSubmitHandler);

prevCities.addEventListener("click", function() {
  if (event.target.matches("li")) {
    getWeather(event.target.textContent)
  }
})

getWeather("toronto");