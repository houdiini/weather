angular.module('weatherApp.services', [])

.factory('Weather', function($http, $cordovaGeolocation) {
  var apiLink = 'http://api.openweathermap.org/data/2.5/weather?';

  var getWeatherIcon = function(str){
    switch (str.toLowerCase()) {
      case 'scattered clouds' : return 'ion-ios-cloudy-outline';
      case 'few clouds': return 'ion-ios-cloudy-outline';
      case 'broken clouds': return 'ion-ios-partlysunny-outline';
      case 'light rain': return'ion-ios-rainy-outline';
      case 'moderate rain': return'ion-ios-rainy';
      case 'sky is clear': return'ion-ios-sunny-outline';
      case 'clear sky': return'ion-ios-sunny-outline';
      case 'light snow': return'ion-ios-snowy';
      case 'overcast clouds': return 'ion-ios-cloudy';
      };
  };

  var getDay = function (vDate) {
      switch (vDate.getDay()) {
        case 1: return 'Пн';
        case 2: return 'Вт';
        case 3: return 'Ср';
        case 4: return 'Чт';
        case 5: return 'Пт';
        case 6: return 'Сб';
        case 0: return 'Нд';
       }
  }
  var getFullDay = function (vDate) {
    switch (vDate.getDay()) {
      case 1: return 'Понеділок';
      case 2: return 'Вівторок';
      case 3: return 'Середа';
      case 4: return 'Четвер';
      case 5: return 'П’ятниця';
      case 6: return 'Субота';
      case 0: return 'Неділя';
    }
  }

  var getStyle = function(w){
    switch (w) {
      case 'Clear': return {background: '#FAF382', color: '#232323'};
      case 'Clouds': return {background: '#B3E5F3', color: '#232323'};
      case 'Rain': return {background: '#333AA3', color: '#fff'};
      case 'Snow': return {background: '#9FA2CF', color: '#232323'};
    }
  }

  var getWeather = function (data, el) {
    var weather = {
      date: new Date(data.list[el].dt_txt),
      maxC: Math.round(data.list[el].main.temp_max - 273.15),
      minC: Math.round(data.list[el].main.temp_min - 273.15),
      w:    data.list[el].weather[0].main,
      humidity: data.list[el].main.humidity,
      pressure: data.list[el].main.pressure,
      wd:   data.list[el].weather[0].description,
      icon: getWeatherIcon(data.list[el].weather[0].description),
      style: getStyle(data.list[el].weather[0].main),
      wind: data.list[el].wind
    };
    return weather;
  };

  getWeatherToday = function($scope, city, callback){
    console.log('Refreshing!');

    console.log(apiLink + city + '&appid=d80580034848df88e85439db1e48c25f');

    $http.get(apiLink + city + '&appid=d80580034848df88e85439db1e48c25f')
    .then(function(res){
      console.info('Success', res.data);
      $scope.now = { weather: res.data,
                     maxC: Math.round(res.data.main.temp_max - 273.15),
                     minC: Math.round(res.data.main.temp_min - 273.15),
                     icon: getWeatherIcon(res.data.weather[0].description)

                   }
      $scope.style = getStyle(res.data.weather[0].main);
    })
    callback && callback();
  }

  var getWeatherFive = function($scope, city, callback){
    console.log(city);
    city = city?city:'Cherkasy';
    $http.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=d80580034848df88e85439db1e48c25f')
    .then(function(res){
      var weather = {};
      var day = [];
      var graph =[];
      var hours = [];
      console.info('Success! ', res.data);

      var currentDay;
      console.log(day.length);
      for (el in res.data.list) {
          currentDay = new Date(res.data.list[el].dt_txt);
        if ((day[day.length-1]) && (day[day.length-1].date.getDate() === currentDay.getDate())) {
          weather = getWeather(res.data, el);
          hours.push(weather);
          day[day.length-1].maxC = day[day.length-1].maxC < weather.maxC? weather.maxC: day[day.length-1].maxC;
          day[day.length-1].minC = day[day.length-1].minC > weather.minC? weather.minC: day[day.length-1].minC;
          day[day.length-1].items.push(weather);
        } else {
            weather = getWeather(res.data, el);
            hours.push(weather);
            day.push({
              maxC: weather.maxC,
              minC: weather.minC,
              date: weather.date,
              day: getDay(weather.date),
              fullDay: getFullDay(weather.date),
              items: [weather]
            })
          }
      }

      for (item in day) {
        graph.push({temp: [[]], bar: [[]], wet: [[]], labels:[]})
        for (el in day[item].items) {
          graph[graph.length-1].temp[0].push(day[item].items[el].maxC);
          graph[graph.length-1].bar[0].push(day[item].items[el].pressure);
          graph[graph.length-1].wet[0].push(day[item].items[el].humidity);
          graph[graph.length-1].labels.push(day[item].items[el].date.getHours() + ': 00');
        }
      }
      $scope.hours = hours;
      $scope.graph = graph;
      $scope.activeDay = 0;
      $scope.city = res.data.city.name;
      $scope.weather = weather;
      $scope.day = day;
      callback && callback();
    })
  }

  return {
   getWeatherIcon: getWeatherIcon,
   getDay: getDay,
   getFullDay: getFullDay,
   getWeather: getWeather,
   getWeatherFive: getWeatherFive, 
   getStyle: getStyle,
   getWeatherToday: getWeatherToday
  }
});
