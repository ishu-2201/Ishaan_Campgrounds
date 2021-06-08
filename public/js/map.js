
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    .addTo(map)