// Define map layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT
};

// Create map
var map = L.map('map',
    {
        attributionControl: true,
        setPrefix: false,
        layers: [osm]
    }
).setView([47.691, 13.388], 7);

L.control.layers(baseMaps).addTo(map);

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

// Add marker
var marker = L.marker([47.691, 13.388], {alt: "Salzburg"})
    .bindPopup("<b>Salzburg</b><br>Home of Mozart.")
    .addTo(map);

// Add keyboard shortcuts to attribution control
map.attributionControl.addAttribution(
    '<button id="shortcuts-button" aria-label="Keyboard Shortcuts">Keyboard Shortcuts</button>'
);


// DOM manipulation
// Hide / show keyboard shortcuts
let shortcuts = document.getElementById('keyboard-shortcuts-view');
let wrapper = document.getElementById('shortcuts-wrapper');

function showShortcuts() {
    shortcuts.style.display = 'block';
    wrapper.style.display = 'block';
    shortcuts.focus();
}

function closeShortcuts() {
    shortcuts.style.display = 'none';
    wrapper.style.display = 'none';
}

document.getElementById('shortcuts-button').addEventListener('click', showShortcuts);
document.getElementsByClassName('popup-close-button')[0].addEventListener('click', closeShortcuts);

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

// Increase / decrease font size
let fontSize = 16;
let increaseBtn = document.getElementById('increase-font-size');
let decreaseBtn = document.getElementById('decrease-font-size');

function increaseFontSize() {
    fontSize += 2;
    document.documentElement.style.fontSize = fontSize + 'px';
    document.body.style.gridTemplateRows = 'auto max-content';
}

function decreaseFontSize() {
    fontSize -= 2;
    document.documentElement.style.fontSize = fontSize + 'px';
}

increaseBtn.addEventListener('click', increaseFontSize);
decreaseBtn.addEventListener('click', decreaseFontSize);

// Toggle high contrast mode
let highContrastBtn = document.getElementById('contrast-checkbox');

function toggleHighContrast() {
    if (highContrastBtn.checked) {
        document.body.classList.add('high-contrast');

    } else {
        document.body.classList.remove('high-contrast');
    }
}

highContrastBtn.addEventListener('change', toggleHighContrast);