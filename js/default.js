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
    imgSrc: mark.imgSrc,
    caption:mark.caption,
    username:mark.username
  });

   markers.push(marker);
}

// MAP OPTIONS
var mapOptions = {
    zoom: 14,
    center: mapCenter
  }

function displayInfo(content,marker)
{
  var infowindow = new google.maps.InfoWindow({
      content: content
  });

    infowindow.open(map,marker);

    return infowindow;

}

// MAP OBJECT
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

// IMAGES CONTAINER
var images = [];  

function getImages()
{
/*
//
//  GETTING IMAGE COORDINATES AND SOURCE
//
*/

// GETTING IMAGES TAKEN IN HONG KONG
$.get( "https://api.instagram.com/v1/media/search", { "lat":location.lat,"lng":location.lng,"distance":"5000","client_id":"c9f518c6703b401c8b2b66843d9cd1c0"} ).done(function( data ) {
    console.log( data );



    // GOING THROUGH RETURNED IMAGES
    for(key in data.data)
    {
    	var imgData = data.data[key];
      var caption = imgData.caption;
    	var text = (caption==null)? "-":imgData.caption.text;
      var username = (caption==null)? "Anonymous":imgData.caption.from.username;

    	var marker = {
    		"lat":imgData.location.latitude,
    		"lng":imgData.location.longitude,
    		"imgSrc":imgData.images.standard_resolution.url,
    		"id":imgData.id,
        "caption":text,
        "username":username
    	}

      // START PRELOADING IMAGE
      images[key] = new Image()
      images[key].src = marker.imgSrc;

      // CREATE MARKER
    	addMarker(marker);

    }
  });
}


getImages();

// CURRENT MARKERS COUNTER
var counter  = markers.length;

// CURRENT DISPLAYINFO BOX
var imageBox ;

window.setInterval(function() {

if(imageBox!=undefined) imageBox.close();
      map.panTo(markers[counter].getPosition());

      var boxContent = '<span style="font-weight:bold">'+markers[counter].username+': </span><span>'+markers[counter].caption+'</span><br><img src="'+markers[counter].imgSrc+'" >';
      console.log(boxContent);
      imageBox = displayInfo(boxContent,markers[counter]);

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
