
let map;
const from = document.querySelector('#from');
const to = document.querySelector('#to');

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });

}
var directionsService = new google.maps.DirectionsService();
                // function x() {
                //     service.getDistanceMatrix({
                //         origins: [from.value],
                //         destinations: [to.value],
                //         travelMode: google.maps.TravelMode.DRIVING,
                //         unitSystem: google.maps.UnitSystem.METRIC,
                //         avoidHighways: false,
                //         avoidTolls: false
                //     }, function (response, status) {
                //         if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                //             var distance = response.rows[0].elements[0].distance.text;
                //             var duration = response.rows[0].elements[0].duration.text;
                //             alert(distance);
                //             // var dvDistance = document.getElementById("dvDistance");
                //             // dvDistance.innerHTML = "";
                //             // dvDistance.innerHTML += "Distance: " + distance + "<br />";
                //             // dvDistance.innerHTML += "Duration:" + duration;

                //         } else {
                //             alert("Unable to find the distance via road.");
                //         }
                //     });
                // }



                // from.addEventListener('change', function () {
                //     if (from.value != '' && to.value != '') {

                //     }
                // })