
// Define map layers
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" aria-label="OpenStreetMap attribution. Opens in a new tab" target="_blank">OpenStreetMap</a>'
});

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

const key = 'fTqz035OSDg9GsUaD2Fu';

const mtLayerDataviz = L.tileLayer(`https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=${key}`,{
    maxZoom: 19,
    attribution: '<a href="https://www.maptiler.com/copyright/" aria-label="MapTiler attribution. Opens in a new tab" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" aria-label="OpenStreetMap attribution. Opens in a new tab" target="_blank">&copy; OpenStreetMap contributors</a>',
});

const mtLayerToner = L.tileLayer(`https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=${key}`, {
    maxZoom: 19,
    attribution: '<a href="https://www.maptiler.com/copyright/" aria-label="MapTiler attribution. Opens in a new tab" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" aria-label="OpenStreetMap attribution. Opens in a new tab" target="_blank">&copy; OpenStreetMap contributors</a>',
});

const jawgLight = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=72PfAsavPGBrPQf2FE0JOoybXUoXPpap3zQOpRhL0bsmh5CK4eilk2S9zcq3xAra', {
    maxZoom: 22,
    attribution: '<a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" aria-label="Jawg attribution. Opens in a new tab" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" aria-label="OpenStreetMap attribution. Opens in a new tab" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
});

const jawgDark = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=72PfAsavPGBrPQf2FE0JOoybXUoXPpap3zQOpRhL0bsmh5CK4eilk2S9zcq3xAra', {
    maxZoom: 22,
    attribution: '<a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" aria-label="Jawg attribution. Opens in a new tab" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" aria-label="OpenStreetMap attribution. Opens in a new tab" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
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
        layers: [jawgLight]
    }
).setView([47.691, 13.388], 8);

// Add data to map
fetch('./data/austriancastles.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            filter: function (castle) {
                let isAttraction = castle.properties.tourism === 'attraction';
                let hasImg = castle.properties['img_file'] !== null;
                let hasDescription = castle.properties['description-translated'] !== null;
                return isAttraction && hasImg && hasDescription;
            },

            pointToLayer: function (castle, latlng) {
                const markerOptions = {
                    title: castle.properties.name,
                    alt: castle.properties.name,
                };

                return L.marker(latlng, markerOptions);
            },

            onEachFeature: function (castle, layer) {
                layer.bindPopup(
                    `<h2>${castle.properties.name}</h2>
                    <img src="${castle.properties["img_file"]}" alt="">
                    <p>${castle.properties['description-translated']}</p>`
                );

                //Add labels to markers
                let label = L.divIcon({
                    className: 'label',
                    html: castle.properties.name
                });

                L.marker([castle.geometry.coordinates[1], castle.geometry.coordinates[0]], {
                    icon: label
                }).addTo(map);

                // focus leaflet-popup on marker click
                layer.on('click', focusPopup);
                layer.on('keypress', (event) => {
                    if (event.originalEvent.key === 'Enter') {
                        focusPopup();
                    }
                });

                layer.on('focus', () => {
                    map.setView([castle.geometry.coordinates[1], castle.geometry.coordinates[0]], 10);
                });
            }
        }).addTo(map);

        // PinSearch component
        var searchBar = L.control.pinSearch({
            position: 'topright',
            placeholder: 'Search castle',
            buttonText: 'Search',
            onSearch: function (query) {
                // Handle the search query here
                const results = data.features.filter(feature =>
                    feature.properties.name.toLowerCase().includes(query.toLowerCase())
                );

                console.log(results[0]);
            },
            searchBarWidth: '250px',
            searchBarHeight: '35px',
            maxSearchResults: 5
        }).addTo(map);

    });
    
    

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

// Add layer control
L.control.layers(baseMaps).setPosition('topleft').addTo(map);

// Add keyboard shortcuts to attribution control
map.attributionControl.addAttribution(
    '<button id="shortcuts-button" aria-label="Keyboard Shortcuts">Keyboard Shortcuts</button>'
);


function focusPopup() {
    let popup = document.querySelector('.leaflet-popup-content');
    popup.style.padding = '5px';
    popup.setAttribute('tabindex', '0');
    popup.focus();
}

// Close popup with escape key
map.on('keydown', (event) => {
    if (event.originalEvent.key === 'Escape' && map.hasLayer(map._popup)) {
        map.closePopup();
    }
});

// save and return focus to the last focused element after closing the popup
map.on('popupopen', () => {
    let lastFocusedElement = document.activeElement;
    map.on('popupclose',  () => lastFocusedElement.focus());
});

// if popup is open + and - keys zoom in and out
map.on('popupopen', () => {
    document.addEventListener('keydown', (event) => {
        if (event.key === '+' || event.key === '=') {
            map.zoomIn();
        } else if (event.key === '-') {
            map.zoomOut();
        }
    });
});

// if popup is open, arrow keys move the map
map.on('popupopen', () => {
    focusPopup();
    document.querySelector('.search-results').style.display = 'none';

    if (map.hasLayer(map._popup)) {   
            document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                map.panBy([0, -100]);
            } else if (event.key === 'ArrowDown') {
                map.panBy([0, 100]);
            } else if (event.key === 'ArrowLeft') {
                map.panBy([-100, 0]);
            } else if (event.key === 'ArrowRight') {
                map.panBy([100, 0]);
            }
        });
    }
});

// use shift + f to focus the search bar on document
document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.code === 'KeyF') {
        event.preventDefault();
        let searchInput = document.querySelector('.search-input');
        searchInput.focus();
        searchInput.value = '';
    }
});


// Set map view on marker focus
// const markers = document.querySelectorAll('img.leaflet-marker-icon');
// markers.forEach((marker, i) => marker.addEventListener('focus', 
//     () => {
//         map.setView([data.data[i].geometry.coordinates[1], data.data[i].geometry.coordinates[0]], 10);
//     }
// ));

// remove tab index from labels
const labels = document.querySelectorAll('.label');
labels.forEach(label => label.removeAttribute('tabindex'));

// DOM manipulation
// Hide / show keyboard shortcuts
let shortcuts = document.getElementById('keyboard-shortcuts-view');
let wrapper = document.getElementById('shortcuts-wrapper');
let shortcutsButton = document.getElementById('shortcuts-button');

function showShortcuts() {
    shortcuts.style.display = 'block';
    wrapper.style.display = 'block';
    shortcuts.focus();
}

function closeShortcuts() {
    shortcuts.style.display = 'none';
    wrapper.style.display = 'none';
}

shortcutsButton.addEventListener('click', showShortcuts);
document.getElementsByClassName('popup-close-button')[0].addEventListener('click', closeShortcuts);

wrapper.addEventListener('click', function (event) {
    if (event.target === wrapper) {
        closeShortcuts();
    }
});

// Close shortcuts with escape key
wrapper.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeShortcuts();
    }
});

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
    highContrastBtn.checked ?
    document.body.classList.add('high-contrast') :
    document.body.classList.remove('high-contrast');
}

highContrastBtn.addEventListener('change', toggleHighContrast);

// Toggle labels
let labelsBtn = document.getElementById('labels-checkbox');

labelsBtn.addEventListener('change', () => {
    labelsBtn.checked ?
    document.querySelectorAll('.label').forEach(label => label.style.display = 'block') :
    document.querySelectorAll('.label').forEach(label => label.style.display = 'none');
}
);

// Change basemap layer with basemap-selector-buttons
const basemapSelectors = document.querySelectorAll('.basemap-selector-button');
const basemapLayers = document.querySelectorAll('.leaflet-control-layers-selector');

basemapSelectors.forEach((selector, index) => {
    selector.addEventListener('click', () => basemapLayers[index].click());
});

// Style basemap selector if basemapLayer is selected
basemapLayers.forEach((layer, index) => {
    if (layer.checked) {
        basemapSelectors[index].classList.add('selected');
    }

    layer.addEventListener('change', () => {
        basemapSelectors.forEach((selector, i) => {
            if (i === index) {
                selector.classList.add('selected');
            } else {
                selector.classList.remove('selected');
            }
        });
    });
});

export {focusPopup};