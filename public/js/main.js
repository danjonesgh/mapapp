google.maps.event.addDomListener(window, 'load', initialize);
var _map;
var loc = angular.module('locationApp', []);

loc.controller('LocationController', function($scope) {
  var locationcontrol = this;

  locationcontrol.locations = [];
  locationcontrol.coordLocations = [];
  $scope.destination = 'test';

  // add a single location
  locationcontrol.addLocation = function() {
    console.log('add location');
    locationcontrol.locations.push(locationcontrol.address);
    //$scope.destination = locationcontrol.address;
    $scope.getCoordsForLocation(locationcontrol.address, function(result) {
      //console.log('res: ' + result);
      var marker = new google.maps.Marker({
        position: result,
        map: _map,
        animation: google.maps.Animation.DROP/*,
        icon: '/images/greendot.png'*/
      });
    });
    locationcontrol.address = '';
  }

  // submitted final result, get middle 
  $scope.submitLocation = function() {
    console.log('submit');
    //$scope.destination = "okok";
    $scope.getCentroid(locationcontrol.locations, function(result) {
      //console.log('in here');
      //$scope.destination = 'result';
      //$(".destination").html("yesyesyes");
      console.log(result);
      $scope.getLocationForCoords(result, function(res) {
        //console.log(res);
        //console.log('location for coords');
        $scope.destination = res;
      });
      _map.setCenter(result);
      var marker = new google.maps.Marker({
        position: result,
        map: _map,
        animation: google.maps.Animation.DROP
      });
    });
  };

  // get center point
  $scope.getCentroid = function(locations, callback) {
    var averageX = 0;
    var averageY = 0;
    var i = 0;
    var len = locationcontrol.locations.length;

    for(var x = 0; x < len; x++) {
      $scope.getCoordsForLocation(locationcontrol.locations[x], function(result) {
        averageX += result.lat();
        //console.log('av: ' + averageX + ' lat: ' + result.lat());
        averageY += result.lng();
        i++;
        if(i == len) {
          averageX /= len;
          averageY /= len;

          callback(new google.maps.LatLng(averageX, averageY));
        }
      });
    }


    /*
    locations.forEach(function(entry) {
      getCoordsForLocation(entry, function(result) {
        averageX += result.lat();
        averageY += result.lng();
        i++;
        if(i == locations.length) {
          averageX /= locations.length;
          averageY /= locations.length;
          callback(new google.maps.LatLng(averageX, averageY));
        }
      });
    });
    */
  }

  $scope.getLocationForCoords = function(location, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': location}, function(result, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        //console.log(result);
        //console.log(result[2].formatted_address);
        callback(result[2].formatted_address);
      }
    });
  }

  $scope.getCoordsForLocation = function(location, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, function(results, status) {
      callback(results[0].geometry.location);
    });
  }
});


function initialize() {
  var myLatlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    center: myLatlng,
    zoom: 8
  };
  _map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var geocoder = new google.maps.Geocoder();
  var address = 'Lansing, Michigan';
  geocoder.geocode({'address': address}, function(results, status) {
    _map.setCenter(results[0].geometry.location);
  });
}

//$(document).ready(function() {
  $("#test").css("background-color", "red");
//});
