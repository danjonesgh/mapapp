google.maps.event.addDomListener(window, 'load', initialize);
var _map;
var loc = angular.module('locationApp', ['ngAnimate']);

loc.controller('LocationController', function($scope) {

  $scope.markers = [];
  $scope.locations = [];
  $scope.coordLocations = [];
  $scope.destination = '';
  $scope.locationTitle = '';

  //
  //
  // add a single location
  //
  //
  $scope.addLocation = function() {
    if($scope.address != '' 
      && $scope.address != undefined 
      && $scope.address != null) {

      if(!$(".input-box").next().hasClass("location-title")) {
        $(".input-box").after('<h1 class="location-title">Locations</h1>');
      }

      $scope.locations.push($scope.address);

      $scope.getCoordsForLocation($scope.address, function(coords) {
        _map.setCenter(coords);
        var marker = new google.maps.Marker({
          position: coords,
          map: _map,
          animation: google.maps.Animation.DROP //,
         // icon: '/images/greendot.png'
        });
        $scope.markers.push(marker);
      });
      $scope.address = '';
    }
  }

  //
  //
  // submitted final result, get middle 
  //
  //
  $scope.submitLocation = function() {
    $scope.getCentroid($scope.locations, function(center) {
      $scope.getLocationForCoords(center, function(location) {
        $(".destination").before('<h1 class="destination-title">Destination</h1>');
        $scope.$apply($scope.destination = location);
      });
    
      _map.setCenter(center);      
      var marker = new google.maps.Marker({
        position: center,
        map: _map,
        animation: google.maps.Animation.DROP
      });
      $scope.markers.push(marker);
    });
  };

  //
  //
  // clear locations
  //
  //
  $scope.clear = function() {
    $(".location-title").remove();
    $(".destination-title").remove();
    $scope.locations.length = 0;
    $scope.destination = '';
    for(var i = 0; i < $scope.markers.length; i++) {
      $scope.markers[i].setMap(null);
    }
    $scope.markers.length = 0;

    var address = 'Lansing, Michigan';
    $scope.getCoordsForLocation(address, function(coords) {
      _map.setCenter(coords);
    });
  }

  //
  //
  // get center point
  //
  //
  $scope.getCentroid = function(locations, callback) {
    var averageX = 0;
    var averageY = 0;
    var i = 0;
    var len = $scope.locations.length;

    for(var x = 0; x < len; x++) {
      $scope.getCoordsForLocation($scope.locations[x], function(coords) {
        averageX += coords.lat();
        //console.log('av: ' + averageX + ' lat: ' + result.lat());
        averageY += coords.lng();
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

  //
  //
  //
  //
  //
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

  //
  //
  //
  //
  //
  $scope.getCoordsForLocation = function(location, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, function(results, status) {
      callback(results[0].geometry.location);
    });
  }
});

//
//
// init
//
//
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
