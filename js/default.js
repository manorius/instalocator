// Default JavaScript Functions and Initiations
$(document).ready(function() {

// SEARCH AREA
var location = {"lat":"22.280519","lng":"114.180994"};
// ARRAY THAT HOLDS COORDINATES AND IMAGE URL
var markers = [];

// MAP CENTER
  var mapCenter = new google.maps.LatLng(location.lat,location.lng);

// Add a marker to the map and push to the array.
function addMarker(mark)
{

   var newMarker = new google.maps.LatLng(mark.lat,mark.lng);

// SET MARKER ICON
 var image = {
    url: 'img/instamark.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32,32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(16, 16)
  };
 
   var marker = new google.maps.Marker({
    position: newMarker,
    map: map,
    icon: image,
    title: mark.id,
    imgSrc: mark.imgSrc
  });

   markers.push(marker);
}

// MAP OPTIONS
var mapOptions = {
    zoom: 14,
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
    	
    	var marker = {
    		"lat":imgData.location.latitude,
    		"lng":imgData.location.longitude,
    		"imgSrc":imgData.images.standard_resolution.url,
    		"id":imgData.id
    	}

    	addMarker(marker);

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

var counter  = markers.length;

window.setInterval(function() {

      map.panTo(markers[counter].getPosition());
      counter = ( counter == 0 )? markers.length-1 : counter - 1;
console.log("move");
    }, 5000);

map.set('styles',[
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -100
            },
            {
                "color": "#e80c8e"
            }
        ]
    }
]);

}); // end document ready
