angular.module('drop', ['ngRoute', 'firebase'])
 
// .value('fbURL', 'https://angularjs-projects.firebaseio.com/')
 
// .factory('drops', function($firebase, fbURL) {
//   return $firebase(new Firebase(fbURL)).$asArray();
// })



/////////////////////////


    // APP ROUTES 


/////////////////////////


 
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'loginCtrl',
      templateUrl:'templates/welcome_to_drop.html'
    })
    .when('/userProfile', {
      controller:'login',
      templateUrl:'templates/user_profile.html'
    })
    .when('/drop', {
      controller:'dropsCtrl',
      templateUrl:'templates/menu.html'
    })
    .when('/drop_upload', {
      controller:'uploadCtrl',
      templateUrl:'templates/drop_upload.html'
    })
    .when('/crew', {
      controller:'uploadCtrl',
      templateUrl:'templates/crew_profile.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})



/////////////////////////


    // LOGIN - LOGOUT
    // Facebook + Twitter 


/////////////////////////



.controller('loginCtrl', function($scope, $rootScope, $location, $firebase, $firebaseSimpleLogin) {
  $scope.goToDrop = function() {
    $location.path('/drop');
  };

  //Firebase Reference 
  var myRef = new Firebase("https://drop.firebaseio.com");
  //Simple login
  $scope.auth = new $firebaseSimpleLogin(myRef);

  // Logs a user in with inputted provider
  $scope.login = function(provider) {
    $scope.auth.$login(provider);
  };

  //Email and Password login ->

      // $scope.auth.createUser($scope.loginData.email, $scope.loginData.password, function(error, user) {
      //   if (error === null) {
      //     console.log("User created successfully:", user);
      //   } else {
      //     console.log("Error creating user:", error);
      //   }
      // });
    
  // Logs a user out
  $scope.logout = function() {
    $scope.auth.$logout();
  };
     
  // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $scope.user = user;

    console.log($scope.user.displayName);
    // $location.path('/new');
    
    // firebaseRef.child('users').child($scope.user.uid).set({
    //       displayName: $scope.user.displayName,
    //       provider: $scope.user.provider,
    //       provider_id: $scope.user.id
    //     });
    //  $scope.closeLogin();

  });

  // Upon successful logout, reset the user object and clear cookies
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $scope.user = null;

    // window.cookies.clear(function() {
    //   console.log("Cookies cleared!");
    // });
  });

  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });
}) // loginCtrl end



/////////////////////////


    // DROP UPLOAD


/////////////////////////

 

.controller('uploadCtrl', function($scope, $location, $timeout, $http) {

  $scope.dropUploadData = {};
  var file = $scope.dropUploadData; 
  console.log(file);

  




  // $scope.save = function() {
  //     Projects.$add($scope.project).then(function(data) {
  //         $location.path('/');
  //     });
  // };
})
 
.controller('dropsCtrl',function($scope, $location, $rootScope) {
  console.log($scope.user);
});