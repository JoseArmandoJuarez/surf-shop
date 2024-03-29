mapboxgl.accessToken = 'pk.eyJ1IjoiampyeiIsImEiOiJja2UxaHJmOG8zNTd5MnRueXNzN2xhemZ2In0.a8-0G44m_cjDd3-VonVxlA';

// instatiating a map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.coordinates,
    zoom: 4
});


// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
    .setLngLat(post.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);

// toggle edit review form

$('.toggle-edit-form').on('click', function(){
    // toggle the edit button on click... $(this)means the button
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // toggle visibility of the edit review form
    $(this).siblings('.edit-review-form').toggle();
});