// Ionic Drop App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'drop' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'drop.controllers' are found in controllers.js
angular.module('drop', ['ionic', 'drop.controllers', 'ngCordova'])

.constant('FirebaseUrl', "https://snap-ruby-db.firebaseio.com")

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'menuCtrl'
    })

    .state('app.love', {
      url: "/love",
      views: {
        'menuContent' :{
          templateUrl: "templates/love.html",
          controller: 'loveCtrl'
        }
      }
    })

    .state('app.userProfile', {
      url: "/userProfile",
      views: {
        'menuContent' :{
          templateUrl: "templates/user_profile.html",
          controller: 'profileCtrl'
        }
      }
    })

    .state('app.crewProfile', {
      url: "/crewProfile",
      views: {
        'menuContent' :{
          templateUrl: "templates/crew_profile.html",
          controller: 'profileCtrl'
        }
      }
    })

    .state('app.dropUpload', {
      url: "/dropUpload",
      views: {
        'menuContent' :{
          templateUrl: "templates/drop_upload.html",
          controller: 'dropUploadCtrl'
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/drop_upload.html",
          controller: 'settingsCtrl'
        }
      }
    })

    .state('app.dropFeed', {
      url: "/drop",
      views: {
        'menuContent' :{
          templateUrl: "templates/dropFeed.html",
          controller: 'dropsCtrl'
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/log.html",
          controller: 'loginCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'dropsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/drop');
});

