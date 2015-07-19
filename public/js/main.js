google.maps.event.addDomListener(window, 'load', initialize);
var _map;
var loc = angular.module('locationApp', []);

loc.controller('LocationController', function($scope) {
  var locationcontrol = this;

  locationcontrol.locations = [];
  locationcontrol.coordLocations = [];

  locationcontrol.addLocation = function() {
    locationcontrol.locations.push(locationcontrol.address);
    /*
    getCoordsForLocation(locationcontrol.address, function(result) {
      console.log('add location result: ' + result);
      var marker = new google.maps.Marker({
        position: result,
        map: _map
      });
    });
    */
    locationcontrol.address = '';
  }

  locationcontrol.submitLocation = function() {
    getCentroid(locationcontrol.locations, function(result) {
      _map.setCenter(result);
      var marker = new google.maps.Marker({
        position: result,
        map: _map
      });
    });
  };
});

function getCentroid(locations, callback) {
  var averageX = 0;
  var averageY = 0;
  var i = 0;
  locations.forEach(function(entry) {
    getCoordsForLocation(entry, function(result) {
      averageX += result.A;
      averageY += result.F;
      i++;
      if(i == locations.length) {
        averageX /= locations.length;
        averageY /= locations.length;
        callback(new google.maps.LatLng(averageX, averageY));
      }
    });
  });
}

function getCoordsForLocation(location, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': location}, function(results, status) {
    var latitutde = results[0].geometry.location.A;
    var longitutde = results[0].geometry.location.F;
    callback(results[0].geometry.location);
  });
}

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
    var latitutde = results[0].geometry.location.A;
    var longitutde = results[0].geometry.location.F;
    /*
    var marker = new google.maps.Marker({
      position: results[0].geometry.location,
      map: _map,
      title: 'Hello World!'
    });
    */
    _map.setCenter(results[0].geometry.location);


  });

}
/*
var geocoder = new google.maps.Geocoder();
var address = "1600 Amphitheatre Parkway, Mountain  View";
geocoder.geocode({'address': address}, function(results, status) {
  console.log(results);
  console.log(status);
  var marker = new google.maps.Marker({
    position: results[0].geometry.location,
    map: _map,
    title: 'Hello World!'
  });
});
*/
/*
geocoder.getLatLng(address, function(point) {
  var latitude = point.y;
  var longitude = point.x;

  console.log("geocoder get lat and lang: " + latitude + " and this: " + longitude);
         // do something with the lat lng
});
*/


/*
$(".done-button").click(function() {
    var location = $('.input-box').val();
    console.log(location);
});
*/
