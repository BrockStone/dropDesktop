angular.module('drop.controllers', ['firebase', 'ngCordova'])

//  _  _  ____  __ _  _  _       
// ( \/ )(  __)(  ( \/ )( \      
// / \/ \ ) _) /    /) \/ (      
// \_)(_/(____)\_)__)\____/    

.controller('menuCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, $firebase, $firebaseSimpleLogin) {
  
  // FIREBASE REFERENCE
  var ref = new Firebase('https://drop.firebaseio.com');
  $scope.authClient = $firebaseSimpleLogin(ref);

  // Login modal 
  $ionicModal.fromTemplateUrl('templates/log.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Create profile modal 
  $ionicModal.fromTemplateUrl('templates/create_profile.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.profileModal = modal;
  });

  // Create profile modal 
  $ionicModal.fromTemplateUrl('templates/settings.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.settingsModal = modal;
  });

  

   // Open login
  $scope.openLogin = function() {
    $scope.loginModal.show();
  };

    // Close login
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

   // Open settings
  $scope.openSettings = function() {
    $scope.settingsModal.show();
  };

  // Open settings
  $scope.closeSettings = function() {
    $scope.settingsModal.hide();
  };

  // Form data for profile
  $scope.profileData = {};

  // Create user profile and send to Db
  $scope.doCreateProfile = function(){
    $scope.authClient.$getCurrentUser().then(function(user) {
      if (user) { // Now, user isn't null.

        if ($scope.profileData.displayName == null || $scope.profileData.bio == null || $scope.profileData.homeMtn == null || $scope.profileData.terrain == null || $scope.profileData.yearsRidden == null || $scope.profileData.board == null || $scope.profileData.bindings == null) {

          $ionicLoading.show({
            template: '<i class="ion-android-close"></i> FILL OUT ALL FIELDS'
            });
            $timeout(function() {
            $ionicLoading.hide();
          }, 1500);
          
        }else{
          
            $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> CREATING PROFILE'
            });
            $timeout(function() {
            $ionicLoading.hide();
          }, 1000);

          console.log(user.uid);
          console.log($scope.profileData);

          ref.child('profiles').child(user.uid).set({
            displayName: $scope.profileData.displayName,
            bio: $scope.profileData.bio,
            home_mountain: $scope.profileData.homeMtn,
            terrain: $scope.profileData.terrain,
            years_ridden: $scope.profileData.yearsRidden,
            board: $scope.profileData.board,
            bindings: $scope.profileData.bindings,
            provider: user.provider,
            provider_id: user.id
          });
        }
      } 
    });
  };
})


//  __     __    ___  __  __ _ 
// (  )   /  \  / __)(  )(  ( \
// / (_/\(  O )( (_ \ )( /    /
// \____/ \__/  \___/(__)\_)__)


.controller("loginCtrl", function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
    // Get a reference to the Drop Firebase
    var firebaseRef = new Firebase('https://drop.firebaseio.com');
    $scope.loginData = {};

    // Create a Firebase Simple Login object
    $scope.auth = $firebaseSimpleLogin(firebaseRef);

    // Initially set no user to be logged in
    $scope.user = null;

    // Logs a user in with inputted provider
    $scope.login = function(provider) {
      $scope.auth.$login(provider);
    };

     // Open login
  $scope.openLogin = function() {
    $scope.loginModal.show();
  };

    // Close login
    $scope.closeLogin = function() {
      $scope.loginModal.hide();
    };

    // Open the create profile modal and get session reference
  $scope.addProfile = function() {
    $scope.profileModal.show();
  };

    // Logs a user out
    $scope.logout = function() {
      $scope.auth.$logout();
    };

      // $scope.auth.createUser($scope.loginData.email, $scope.loginData.password, function(error, user) {
      //   if (error === null) {
      //     console.log("User created successfully:", user);
      //   } else {
      //     console.log("Error creating user:", error);
      //   }
      // });
     

    // Upon successful login, set the user object
    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
      $scope.user = user;

      console.log($scope.user);
      
      firebaseRef.child('users').child($scope.user.uid).set({
            displayName: $scope.user.displayName,
            provider: $scope.user.provider,
            provider_id: $scope.user.id
          });
       $scope.closeLogin();

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
})

//  ____  ____   __  ____  ____ 
// (    \(  _ \ /  \(  _ \/ ___)
//  ) D ( )   /(  O )) __/\___ \
// (____/(__\_) \__/(__)  (____/

.controller('dropsCtrl', function($scope, $http, $ionicModal, $timeout, $ionicActionSheet, $ionicLoading, $firebase, $cordovaCapture, $cordovaGeolocation, $cordovaCamera) {
  // $scope.drops = [
  //   // { username: 'Brock_Stone', id: 1 , trick_ex: '540, Method', park_feature: '25ft Booter', location: '7 Springs Resort - Champion, Pa', vid_url: 'vids/openingwkend.mp4'},
  //   // { username: 'JeffSmail', id: 1 , trick_ex: '540, Method', park_feature: '25ft Booter', location: '7 Springs Resort - Champion, Pa', vid_url: 'vids/openingwkend.mp4'},
  //   // { username: 'Skip', id: 1 , trick_ex: '540, Method', park_feature: '25ft Booter', location: '7 Springs Resort - Champion, Pa', vid_url: 'vids/openingwkend.mp4'},
  //   // { username: 'DJ_Rel', id: 1 , trick_ex: '540, Method', park_feature: '25ft Booter', location: '7 Springs Resort - Champion, Pa', vid_url: 'vids/openingwkend.mp4'}
  // ];

  // FIREBASE Drops folder Reference
  $scope.isLoading = true;
  var dropsRef = new Firebase('https://drop.firebaseio.com/drops');
  $scope.drops = $firebase(dropsRef);
  // var sync = $firebase(dropsRef);

   // Drops ARRAY
  // $scope.drops = sync.$asArray();

  // Form data for profile
  $scope.dropUploadData = {};
 
  // Drop Upload modal 
  $ionicModal.fromTemplateUrl('templates/drop_upload.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });t

  // Show Drop upload options (take viseo, take picture, choose existing)
  $scope.showUploadOptions = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Take Video' },
       { text: 'Take Picture' },
       { text: 'Choose Existing' }
     ],
     titleText: 'Upload a Drop',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
        if (index == 0) {
          $scope.captureVideo();
        }if(index == 1){
          $scope.captureImage();
        }else{
          $scope.getMedia();
        }
        return true;

     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 2000);

  };

  // Audio Capture

  // $scope.captureAudio = function() {
  //   var options = { limit: 3, duration: 10 };

  //   $cordovaCapture.captureAudio(options).then(function(audioData) {
  //     // Success! Audio data is here
  //   }, function(err) {
  //     // An error occured. Show a message to the user
  //   });
  // }


  // Image Capture

  $scope.captureImage = function() {
    var options = { limit: 3 };

    $cordovaCapture.captureImage(options).then(function(imageData) {
      // Success! Image data is here
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }


  // Video Capture

  $scope.captureVideo = function() {
    var options = { limit: 1, duration: 15 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      console.log(videoData[0].localURL);


      // Write permissions and create folder 

      function download(URL, Folder_Name, File_Name) {
        //step to request a file system 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

        function fileSystemSuccess(fileSystem) {
            var download_link = encodeURI(URL);
            ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

            var directoryEntry = fileSystem.root; // to get root path of directory
            directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
            var rootdir = fileSystem.root;
            var fp = rootdir.fullPath; // Returns Fulpath of local directory

            fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
            // download function call
            filetransfer(download_link, fp);
        }

        function onDirectorySuccess(parent) {
            console.log('Directory created!')
        }

        function onDirectoryFail(error) {
            //Error while creating directory
            console.log("Unable to create new directory: " + error.code);
        }

          function fileSystemFail(evt) {
            //Unable to access file system
            console.log(evt.target.error.code);
         }
        }

      // dropsRef.push({url: videoData[0].localURL}).
      //   then(function(data) {
      //     console.log("pushed!");
      //   });

      

    }, function(err) {
      console.log(err);
    });
    
    // $scope.dropUpload();
  }

  // Grab video or picture from camera library

  $scope.getMedia = function() {
    var options = { 
        quality : 45, 
        destinationType : Camera.DestinationType.FILE_URI, 
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        mediaType: Camera.MediaType.ALLMEDIA,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(imageData);

      $scope.selected_media = imageData;
      
    }, function(err) {
      // An error occured. Show a message to the user
    });
    
     $scope.dropUpload();
  }


  // Drop Upload Location modal 
  $ionicModal.fromTemplateUrl('templates/upload_location.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.dropLocation = modal;
  });

  // Open the Drop Upload modal
  $scope.dropUpload = function() {
    $scope.modal.show();
  };
  
  // Close Drop Upload
  $scope.closeDropUpload = function() {
    $scope.modal.hide();
  };

  
  // Open the Drop location modal
  $scope.getDropLocation = function() {
    $scope.dropLocation.show();

    // Get location 
    $cordovaGeolocation.getCurrentPosition()
    .then(function (position) {

            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            console.log('lat= '+lat);
            console.log('long= '+long);
            console.log(position);

            // FOURSQUARE API 

            var clientID = 'BZIF55F4JVZEFEQQOXS5332BSHSFKUNQU1RGYI3XEK0A5OJD';
            var clientSecret = 'C2XRIUXY5CPICDODOPQUJ4EVDDLZQ0CNHLI2KHQNMKO3XTRJ';

            $http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/search?client_id='+clientID+'&client_secret='+clientSecret+'&v=20130815&ll='+lat+','+long}).
            success(function(data, status, headers, config) {
              console.log('Connected to Foursquare:'+data);
            }).
            error(function(data, status, headers, config) {
              console.log(data);
            });

          }, function(err) {
            // error
        });

      
  };
   // cloese drop location modal
  $scope.closeLoc = function() {
    $scope.dropLocation.hide();
  };

  // Drop uploads from CAM icon in header (Drop Feed)
  $scope.doDropUpload = function() {
    console.log('Upload Info:', $scope.dropUploadData);
      

        
        $scope.drops.$add($scope.dropUploadData).then(function(ref) {
          
          var id = ref.name();
          console.log("added record with id " + id);
          
          $scope.drops.$indexFor(id); // returns location in the array

          $ionicLoading.show({
            template: 'UPLOADING DROP'
          });
          $timeout(function() {
            $ionicLoading.hide();
            $scope.closeLoc();
            $scope.closeDropUpload();
          }, 1000);

        });   
  };
})

//  __     __   _  _  ____ 
// (  )   /  \ / )( \(  __)
// / (_/\(  O )\ \/ / ) _) 
// \____/ \__/  \__/ (____)

.controller('loveCtrl', function($scope) {
  $scope.loves = [
    { username: 'Brock_Sewdmwklmetone'},
    { username: 'JeffSmail'},
    { username: 'Skip'},
    { username: 'DJ_Rel'}
  ];
})

//  _  _  ____  ____  ____    ____  ____   __  ____  __  __    ____ 
// / )( \/ ___)(  __)(  _ \  (  _ \(  _ \ /  \(  __)(  )(  )  (  __)
// ) \/ (\___ \ ) _)  )   /   ) __/ )   /(  O )) _)  )( / (_/\ ) _) 
// \____/(____/(____)(__\_)  (__)  (__\_) \__/(__)  (__)\____/(____)

.controller('profileCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for profile
  $scope.profileData = {
      username: 'BrockStone'
  };

  // profile modal 
  $ionicModal.fromTemplateUrl('templates/profile_edit.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Triggered in the login modal to close it
  $scope.closeEditProfile = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.editProfile = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doEditProfile = function() {
    console.log('Profile Info:', $scope.profileData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeEditProfile();
    }, 1000);
  };
})

////////////////
// User Profile 
////////////////

.controller('dropUploadCtrl', function($scope, $ionicModal, $timeout) {
  
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MyCtrl', function($scope, $cordovaCapture) {

  

});
