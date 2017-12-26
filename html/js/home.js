/**
 * datarange picker
 */
$('.input-daterange-datepicker').daterangepicker({
    buttonClasses: ['btn', 'btn-sm']
    , applyClass: 'btn-danger'
    , cancelClass: 'btn-inverse'
});

$('#signup-button').on('click', function() {
    $('#login-modal').modal('show');
    $('.nav-tabs a[href="#signup-tab"]').tab('show');
});

// This is for Vertical carousel
$('.vcarousel').carousel({
  interval: 10000
})

var loginSuccessfully = function () {
    swal({
        title: "Login Successfully!",
        type : "success",
        timer: 1100,
        showConfirmButton: false
    });
}

var logoutSuccessfully = function () {
    swal({
        title: "Logout Successfully!",
        type : "success",
        timer: 1100,
        showConfirmButton: false
    });
}

function initMap() {

    console.log("enter google map");
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16
    });
    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    var address = "chonghua hospital mandaue";
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

$('#quickview-modal').on('shown.bs.modal', function () {
    console.log("enter event");
    initMap();

});
