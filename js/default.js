// Default JavaScript Functions and Initiations
$(document).ready(function() {
    // SEARCH AREA
    var location = {
        "lat": "22.280519",
        "lng": "114.180994"
    };
    // ARRAY THAT HOLDS COORDINATES AND IMAGE URL
    var markers = [];

    /*
//  GETTING REFERENCES TO ELEMENTS
*/

    // TEXT WINDOW
    var textContainer = document.getElementById("instacopy-container");

    // COPY
    var instacopy = document.getElementById("instacopy");

    // MAP CENTER
    var mapCenter = new google.maps.LatLng(location.lat, location.lng);

    // SEARCH DISTANCE
    var dist = "5000";

    // SHOW IMAGE DURATION
    var imgDuration = "5000";

    // NUMBER OF RESULTS
    var resNum = 50;

    // CURRENT MINUTE
    var cMin;

    // MAP OPTIONS
    var mapOptions = {
        zoom: 12,
        center: mapCenter,
        disableDefaultUI: true
    }

    // MAP OBJECT
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // IMAGES CONTAINER
    var images = [];

    // NUMBER OF MARKERS
    var counter = 0;

    // CURRENT DISPLAYINFO BOX
    var imageBox;

    // MAP INFOWINDOW
    var infowindow = new google.maps.InfoWindow({
        content: ''
    });


    /*
    // LISTENERS
    */

    // SETINTERVAL LISTENER
    var imgInterval;

    // LISTENING FOR RETURN PRESS
    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 13) {
            toggleFullScreen();

        }
    }, false);

    // LISTENER FOR SCREEN RESIZE
    window.addEventListener("resize", onScreenResized);

    // STYLING INFO WINDOW
    /*
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */

    var infoWindowListener = google.maps.event.addListener(infowindow, 'domready', styleInfoWindow);

    // CALCULATE TIME TIMEFRAME IS IN MINUTES
    function getTimestamp(hoursAgo, minutesAgo, timeFrame) {
        // GET CURRENT YEAR, MONTH, DAY, AND HOUR
        var year = new Date().getYear() + 1900;
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var startHour = new Date().getHours() - hoursAgo;
        startHour = (startHour < 0) ? 24 + startHour : startHour;
        var startMin = new Date().getMinutes() - minutesAgo;
        startMin = (startMin < 0) ? 59 + startMin : startMin;

        var endMin = startMin + timeFrame;
        console.log(startMin + " - " + timeFrame);
        var endHour = startHour;
        if (endMin > 59) {
            endHour = startHour + 1;
            endHour = (endHour > 23) ? endHour - 24 : endHour;
            endMin = (endMin > 59) ? endMin - 60 : endMin;
        }

        console.log(" year- " + year + " month- " + month + " day- " + day + " sH- " + startHour + " sM- " + startMin + " eH- " + endHour + " eM- " + endMin);

        //  minimum timestamp. All media returned will be taken later than this timestamp.
        var minT = new Date(year, month, day, startHour, startMin, 0);
        // converting into UNIX timestamp
        var unixMinT = minT.getTime() / 1000;
        //  max timestamp. All media returned will be taken earlier than this timestamp.
        var maxT = new Date(year, month, day, endHour, endMin, 0);
        // converting into UNIX timestamp
        var unixMaxT = maxT.getTime() / 1000;

        // MIN TIMESTAMP TO STRING
        console.log(minT.toString());
        console.log(maxT.toString());

        return [unixMinT, unixMaxT]
    }

    // Add a marker to the map and push to the array.
    function addMarker(mark) {

        var newMarkerPosition = new google.maps.LatLng(mark.lat, mark.lng);

        // SET MARKER ICON
        var image = {
            url: 'img/instamark.png',
            // This marker is 20 pixels wide by 32 pixels tall.
            size: new google.maps.Size(32, 32),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at 0,32.
            anchor: new google.maps.Point(16, 16)
        };

        var marker = new google.maps.Marker({
            position: newMarkerPosition,
            map: map,
            icon: image,
            title: mark.id,
            animation: google.maps.Animation.DROP,
            img: mark.img,
            caption: mark.caption,
            username: mark.username
        });

        markers.push(marker);
    }

    // REMOVE MARKERS
    function removeMarkers() {
        for (var i = markers.length - 1; i >= 0; i--) {
            markers[i].setMap(null);

        };
        markers = [];

    }


    // INFO CONTAINER
    function displayInfo(content, marker) {
        infowindow.setContent(content);

        infowindow.open(map, marker);

        return infowindow;

    }


    function styleInfoWindow() {
        console.log("domready");
        // Reference to the DIV which receives the contents of the infowindow using jQuery
        var iwOuter = $('.gm-style-iw');

        /* The DIV we want to change is above the .gm-style-iw DIV.
         * So, we use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
         */
        var iwBackground = iwOuter.prev();

        // Remove the background shadow DIV
        iwBackground.children(':nth-child(2)').css({
            'display': 'none'
        });

        // Remove the white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none'
        });

        // Moves the infowindow 115px to the right.
        //iwOuter.parent().parent().css({left: '115px'});

        // Moves the shadow of the arrow 76px to the left margin 
        //iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

        // CHANGES THE COLOR OF THE ARROW
        //iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

        // Changes the desired color for the tail outline.
        // The outline of the tail is composed of two descendants of div which contains the tail.
        // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
        iwBackground.children(':nth-child(3)').find('div').children().css({
            'box-shadow': '0 1px 6px rgba(178, 178, 178, 0.6)',
            'z-index': '1'
        });

        // STYLING THE CLOSE BUTTON
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.css({
            opacity: '0'
        });

        // The API automatically applies 0.7 opacity to the button after the mouseout event.
        // This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function() {
            $(this).css({
                opacity: '1'
            });
        });

        // REMOVE EVENT LISTENER
        google.maps.event.removeListener(infoWindowListener);

    }

    function getImages(h, m, dt) {
        /*
//
//  GETTING IMAGE COORDINATES AND SOURCE
//
*/
        var timeStamp = getTimestamp(h, m, dt);

        $.ajax({
            url: 'https://api.instagram.com/v1/media/search?lat=' + location.lat + '&lng=' + location.lng + '&min_timestamp=' + timeStamp[0] + '&max_timestamp=' + timeStamp[1] + '&distance=' + dist + '&client_id=8e389360eb63441da5f5680c26ed7dbf&count=' + resNum,
            dataType: 'jsonp',
            success: function(data) {
                console.log(data);

                // GOING THROUGH RETURNED IMAGES
                for (key in data.data) {
                    var imgData = data.data[key];
                    var caption = imgData.caption;
                    var text = (caption == null) ? "-" : imgData.caption.text;
                    var username = imgData.user.username;

                    // DISPLAY CREATION TIME
                    console.log(new Date(data.data[key].created_time * 1000).toString())

                    // START PRELOADING IMAGES
                    images.push(new Image());
                    images[key].src = imgData.images.standard_resolution.url;


                    var marker = {
                        "lat": imgData.location.latitude,
                        "lng": imgData.location.longitude,
                        "img": images[key],
                        "id": imgData.id,
                        "caption": text,
                        "username": username
                    };

                    // CREATE MARKER
                    //cm(marker);
                    (function cm(m) {
                        window.setTimeout(function() {
                            // UPDATING  NUMBER OF COUNTERS
                            // counter++;
                            addMarker(m);
                        }, key * 150);
                    })(marker)


                }

                // CURRENT MARKERS COUNTER
                counter = markers.length;

                // START INTERVAL
                imgInterval = window.setInterval(showInfoBox, imgDuration);

                // GET CURRENT MINUTE
                cMin = new Date().getMinutes();

            }
        })

    }

    var h = new Date().getHours() - 1;
    h = (h < 0) ? h + 1 : h;
    getImages(h, 0, 1);

    // REMOVE IMAGES
    function removeImages() {

        for (var i = images.length - 1; i >= 0; i--) {
            images[i].src = null;
            images[i] = null;
        };
        images = [];

    }

    function showInfoBox() {
        console.log("INFOBOX");
        counter = (counter == 0) ? markers.length - 1 : counter - 1;

        console.log(map);
        if (imageBox != undefined) imageBox.close();
        map.panTo(markers[counter].getPosition());

        // UPDATE STRIPE 
        instacopy.innerHTML = '<span id="pic-username">' + markers[counter].username + ': </span><span id="pic-text">' + hashtagStyler(markers[counter].caption, "hashtag") + '</span>';

        // REPOSITION TEXT
        onScreenResized();

        //console.log(textContainer);
        // UPDATE INFO BOX CONTENT
        //var boxContent = '<img src="' + markers[counter].imgSrc + '" ></div>';
        // console.log(boxContent);
        imageBox = displayInfo(markers[counter].img, markers[counter]);

        // WHEN EACH IMAGE HAS BEEN VIEWED TWICE RETRIEVE NEW IMAGES
        var now = new Date().getMinutes();
        console.log(now + " -- " + cMin);
        if (cMin != now) {
            // CLOSE INFOBOX
            imageBox.close();
            // CLEAR INTERVAL
            window.clearInterval(imgInterval);
            // REMOVE MARKERS
            removeMarkers();
            // RESET MARKERS LENGTH COUNTER
            counter = 0;
            // REMOVE ALL IMAGES
            removeImages();
            // CLEAR TEXT
            instacopy.innerHTML = '';
            // GET NEW IMAGE DATA 
            getImages(1, 0, 1);
        }
    }

    function updateMap() {

    }
    // STYLING MAP
    map.set('styles', [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#e5e3df"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#e80c8e"
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }, {
            "lightness": -100
        }, {
            "color": "#e80c8e"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }]);


    // EVENT HANDLER FOR SCREEN RESIZE
    function onScreenResized(e) {
        var copyContainerHeight = parseInt($(textContainer).css("height"), 10);
        var copyHeight = parseInt($(instacopy).css("height"), 10);
        var fromTop = (copyContainerHeight - copyHeight) * 0.5;

        instacopy.style.top = fromTop + 'px';

    }

}); // end document ready

// ISOLATE AND STYLE HASHTAGS
function hashtagStyler(txt, tagClass) {
    var words = txt.split(" ");
    txt = "";

    for (var n = words.length - 1; n > -1; n--) {
        var word = (words[n].charAt(0) == "#") ? '<span class="' + tagClass + '">' + words[n] + '</span>' : words[n];
        txt = word + " " + txt;
    }
    return txt
}

// TOGGLE FULL SCREEN FUNCTION
function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}