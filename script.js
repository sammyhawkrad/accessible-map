
import * as data from './data.js';
// Define map layers
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

const key = 'fTqz035OSDg9GsUaD2Fu';

const mtLayerDataviz = L.tileLayer(`https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=${key}`,{
    maxZoom: 19,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
});

const mtLayerToner = L.tileLayer(`https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=${key}`, {
    maxZoom: 19,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
});

const jawgLight = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=72PfAsavPGBrPQf2FE0JOoybXUoXPpap3zQOpRhL0bsmh5CK4eilk2S9zcq3xAra', {
    maxZoom: 22,
    attribution: '<a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
});

const jawgDark = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=72PfAsavPGBrPQf2FE0JOoybXUoXPpap3zQOpRhL0bsmh5CK4eilk2S9zcq3xAra', {
    maxZoom: 22,
    attribution: '<a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
});

const baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "MapTiler Dataviz": mtLayerDataviz,
    "MapTiler Toner": mtLayerToner,
    "Jawg Light": jawgLight,
    "Jawg Dark": jawgDark

};


// Create map
var map = L.map('map',
    {
        attributionControl: true,
        setPrefix: false,
        layers: [osm]
    }
).setView([47.691, 13.388], 9);

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


// Add keyboard shortcuts to attribution control
map.attributionControl.addAttribution(
    '<button id="shortcuts-button" aria-label="Keyboard Shortcuts">Keyboard Shortcuts</button>'
);

// Add data to map
// const data = fetch('./data/austriancastles.geojson')
//     .then(response => response.json())
//     .then(data => {
//         L.geoJSON(data, {
//             onEachFeature: function (feature, layer) {
//                 layer.bindPopup(feature.properties.name);
//             }
//         }).addTo(map);
//     });

data.data.forEach(function (castle) {
    let marker = L.marker([castle.geometry.coordinates[1], castle.geometry.coordinates[0]],
        {
            title: castle.properties.name,
            alt: castle.properties.name + " " + castle.properties['description-translated'],
            riseOnHover: true
        }
    ).addTo(map)
    .bindPopup(
        `<h2>${castle.properties.name}</h2>
        <p>${castle.properties['description-translated']}</p>`
    );
});


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