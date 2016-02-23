angular.module('weatherApp', ['ionic', 'weatherApp.controllers', 'weatherApp.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      //org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.today', {
    url: '/today',
    views: {
      'tab-today': {
        templateUrl: 'templates/tab-today.html',
        controller: 'todayCtrl'
      }
    }
  })

  .state('tab.fiveDays', {
      url: '/fiveDays',
      views: {
        'tab-fiveDays': {
          templateUrl: 'templates/tab-fiveDays.html',
          controller: 'fiveDaysCtrl'
        }
      }
    })

  .state('tab.search', { 
    url: '/search',
    views: { 
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'searchCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/today');

});

