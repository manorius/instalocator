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
    animation: google.maps.Animation.DROP,
    imgSrc: mark.imgSrc,
    caption:mark.caption,
    username:mark.username
  });

   markers.push(marker);
}

// MAP OPTIONS
var mapOptions = {
    zoom: 14,
    center: mapCenter,
    disableDefaultUI: true
  }

// INFO CONTAINER
function displayInfo(content,marker)
{
  var infowindow = new google.maps.InfoWindow({
      content: content
  });

    infowindow.open(map,marker);

// STYLING INFO BOX
/*
 * The google.maps.event.addListener() event waits for
 * the creation of the infowindow HTML structure 'domready'
 * and before the opening of the infowindow defined styles
 * are applied.
 */
google.maps.event.addListener(infowindow, 'domready', function() {
console.log("domready");
   // Reference to the DIV which receives the contents of the infowindow using jQuery
   var iwOuter = $('.gm-style-iw');

   /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
   var iwBackground = iwOuter.prev();

   // Remove the background shadow DIV
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});

   // Remove the white background DIV
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

   // Moves the infowindow 115px to the right.
//iwOuter.parent().parent().css({left: '115px'});

// Moves the shadow of the arrow 76px to the left margin 
//iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

// CHANGES THE COLOR OF THE ARROW
//iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

// Changes the desired color for the tail outline.
// The outline of the tail is composed of two descendants of div which contains the tail.
// The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': '0 1px 6px rgba(178, 178, 178, 0.6)', 'z-index' : '1'});

// STYLING THE CLOSE BUTTON
var iwCloseBtn = iwOuter.next();

// Apply the desired effect to the close button
iwCloseBtn.css({
  opacity: '0'
  });

// The API automatically applies 0.7 opacity to the button after the mouseout event.
// This function reverses this event to the desired value.
iwCloseBtn.mouseout(function(){
  $(this).css({opacity: '1'});
});

});

    return infowindow;

}

// MAP OBJECT
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

// IMAGES CONTAINER
var images = [];  

function getImages(){
/*
//
//  GETTING IMAGE COORDINATES AND SOURCE
//
*/
$.ajax({
                    url: 'https://api.instagram.com/v1/media/search?lat='+location.lat+'&lng='+location.lng+'&distance=5000&client_id=8e389360eb63441da5f5680c26ed7dbf',
                    dataType: 'jsonp',
                    success: function(data){
                        console.log(data);

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
      //cm(marker);
      (function cm(m){
      window.setTimeout(function() {
      addMarker(m);
   //   console.log(m);
    }, key * 150);
      })(marker)
      

    }
                    }})

}


getImages();

// CURRENT MARKERS COUNTER
var counter  = markers.length;

// CURRENT DISPLAYINFO BOX
var imageBox ;

window.setInterval(function() {

if(imageBox!=undefined) imageBox.close();
      map.panTo(markers[counter].getPosition());

      var boxContent = '<div id="iw-container"><span style="font-weight:bold">'+markers[counter].username+': </span><span>'+markers[counter].caption+'</span><br><img src="'+markers[counter].imgSrc+'" ></div>';
     // console.log(boxContent);
      imageBox = displayInfo(boxContent,markers[counter]);

      counter = ( counter == 0 )? markers.length-1 : counter - 1;
//console.log("move");
    }, 5000);

// STYLING MAP
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
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e5e3df"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#e80c8e"
            },
            {
                "visibility": "on"
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
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]);




}); // end document ready
