var apiKey = "e8e23b4a156b56df078fbb140bab8322";

var userSearch = document.querySelector("#city-name");
var searchForm = document.querySelector("#search-form");
var prevCities = document.querySelector("#previous-cities");

var weatherContainer = document.querySelector("#currentCity");

var previousCities = JSON.parse(localStorage.getItem("previousCities"));

var searchHistory = function() {
  save search history and append to card list on left side
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
      console.log(data);
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
  var icon = 'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '.png';
  var tempF = ((weather.main.temp - 273.15) * 1.8 + 32).toFixed(2);
  var humidity = weather.main.humidity;
  var windSpeed = weather.wind.speed;

  $("#name-date-icon").html(`${city} (${date}) <img src=${icon} />`);
  $("#today-temp").text(tempF);
  $("#today-humidity").text(humidity);
  $("#today-wind-speed").text(windSpeed);

  var uvApi = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + weather.coord.lat + '&lon=' + weather.coord.lon + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey;
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
    var icon = 'http://openweathermap.org/img/wn/' + forecast.list[i].weather[0].icon + '.png';
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

var formSubmitHandler = function(event) {
  event.preventDefault();

  // get value from input element
  var cityName = userSearch.value.trim();
  console.log(cityName)
  
  if (cityName) {
    getWeather(cityName);
    userSearch.value = "";
  } else {
    alert("Please enter a city name");
  }
};

searchHistory();

searchForm.addEventListener("submit", formSubmitHandler);