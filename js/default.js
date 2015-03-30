// Default JavaScript Functions and Initiations
$(document).ready(function() {

// SEARCH AREA
var location = {"lat":"22.280519","lng":"114.180994"};
// ARRAY THAT HOLDS COORDINATES AND IMAGE URL
var markers = [];

// MAP CENTER
  var mapCenter = new google.maps.LatLng(location.lat,location.lng);

// Add a marker to the map and push to the array.
function addMarker(loc)
{

   var newMarker = new google.maps.LatLng(loc.lat,loc.lng);
//	console.log(location);
   var marker = new google.maps.Marker({
    position: newMarker,
    map: map,
    title: loc.id
  });
}

// MAP OPTIONS
var mapOptions = {
    zoom: 15,
    center: mapCenter
  }

// MAP OBJECT
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

function getImages()
{
/*
//
//  GETTING IMAGE COORDINATES
//
*/

// GETTING IMAGES TAKEN IN HONG KONG
$.get( "https://api.instagram.com/v1/media/search", { "lat":location.lat,"lng":location.lng,"distance":"5000","client_id":"c9f518c6703b401c8b2b66843d9cd1c0"} ).done(function( data ) {
    console.log( data );

	

    // GOING THROUGH RETURNED IMAGES
    for(key in data.data)
    {
    	var imgData = data.data[key];
    	
    	markers.push({
    		"lat":imgData.location.latitude,
    		"lng":imgData.location.longitude,
    		"imgSrc":imgData.images.standard_resolution.url,
    		"id":imgData.id
    	})

    	addMarker(markers[key]);

    /*	var imgSrc = data.data[key].images.standard_resolution.url;
console.log(imgSrc);
var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
img.attr('src', imgSrc);
$("body").append(img);*/
    }
  });
}

/*
function initialize() {



  var myLatlng = new google.maps.LatLng(location.lat,location.lng);
  var myLatlng2 = new google.maps.LatLng(22.283537,114.185972);
  
  


  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });

// This event listener will call addMarker() when the map is clicked.
 google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng);
  });


}*/

getImages();


}); // end document ready
