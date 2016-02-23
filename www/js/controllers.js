angular.module('weatherApp.controllers', ['chart.js'])//, 'geolocation'

.controller('todayCtrl', function($scope, $http, $ionicTabsDelegate, $cordovaDeviceOrientation,$cordovaGeolocation, Weather) {

  $scope.goForward = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) $ionicTabsDelegate.select(selected+1)
  };
  $scope.magneticHeading = 0;
  
  var options = {
        frequency: 3000,
        filter: true     // if frequency is set, filter is ignored
      }

  var watch = $cordovaDeviceOrientation.watchHeading(options).then(
    null,
    function(error) {
      // An error occurred
    },
    function(result) {   // updates constantly (depending on frequency value)
      $scope.magneticHeading = result.magneticHeading;
      console.log('magnetic: %s', $scope.magneticHeading);
    });
  
  var pos = {};
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
    var lat  = position.coords.latitude
    var long = position.coords.longitude
    pos = position.coords;

    var city = 'lat=' + pos.latitude + '&lon=' + pos.longitude;

    Weather.getWeatherToday($scope, city);
    Weather.getWeatherFive($scope);
  }, function(err) {
    // error
  });
  $scope.Refresh = function(){
    $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
    var lat  = position.coords.latitude
    var long = position.coords.longitude
    pos = position.coords;

    var city = 'lat=' + pos.latitude + '&lon=' + pos.longitude;
    console.log('Rer');
    Weather.getWeatherToday($scope, city, function(){$scope.$broadcast('scroll.refreshComplete')});
    Weather.getWeatherFive($scope);
    }, function(err) {
    // error
    });
  }
})

//    FIVE DAYS
.controller('fiveDaysCtrl', function($scope, $http, $ionicTabsDelegate, Weather) {
  Weather.getWeatherFive($scope);


  $scope.goForward = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) $ionicTabsDelegate.select(selected+1)
  };

  $scope.goBack = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected !== -1 && selected !== 0) $ionicTabsDelegate.select(selected-1)
  };


  $scope.dayShow = function(index){
    console.log(index);
    $scope.activeDay = index;
  };

  $scope.data = {indexHour: 0, indexGraphTab: 'temp'};
  $scope.getWeatherFive = Weather.getWeatherFive;
  $scope.Refresh = function () {
    Weather.getWeatherFive($scope, '', function(){$scope.$broadcast('scroll.refreshComplete')});
  }
})


//    SEARCH
.controller('searchCtrl', function($scope, $http, $ionicTabsDelegate, Weather) {
    $scope.goForward = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) $ionicTabsDelegate.select(selected+1)
  };

  $scope.goBack = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected !== -1 && selected !== 0) $ionicTabsDelegate.select(selected-1)
  };

  // $scope.query = '';

  var doSearch = ionic.debounce(function(query) {
    Weather.getWeatherFive($scope, query)
  }, 500);


  $scope.search = function() { 
    doSearch($scope.data.query)
  }


  $scope.dayShow = function(index){
    console.log(index);
    $scope.activeDay = index;
  };

  $scope.data = {indexHour: 0, query: '', indexGraphTab: 'temp'};
  $scope.Refresh = function () {
    Weather.getWeatherFive($scope, $scope.data.searchText)
    $scope.$broadcast('scroll.refreshComplete');
  }
});
