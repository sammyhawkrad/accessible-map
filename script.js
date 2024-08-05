var map = L.map('map').setView([47.691, 13.388], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Add fullscreen control
L.control
    .fullscreen({
        position: 'topleft', 
        title: 'Open map in fullscreen mode', 
        titleCancel: 'Exit fullscreen mode',
        forceSeparateButton: true,
        forcePseudoFullscreen: false,
        fullscreenElement: false
    })
    .addTo(map);

map.on('enterFullscreen', function () {
    let fullscreenElement = document.querySelector('.leaflet-fullscreen-on');
    fullscreenElement.setAttribute('aria-label', 'Exit fullscreen mode');
});

map.on('exitFullscreen', function () {
    let fullscreenElement = document.querySelector('.fullscreen-icon');
    fullscreenElement.setAttribute('aria-label', 'Open map in fullscreen mode');
});

var marker = L.marker([47.691, 13.388], {alt: "Salzburg"})
    .bindPopup("<b>Salzburg</b><br>Home of Mozart.")
    .addTo(map);