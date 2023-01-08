let singapore = [1.3521, 103.8198];
let map = L.map("map").setView(singapore, 13);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

const resultLayer = L.layerGroup();
resultLayer.addTo(map);

loadData();

document.querySelector("#search-btn").addEventListener("click", async function(){
    resultLayer.clearLayers();

    const searchTerms = document.querySelector("#search-terms").value;
    const center = map.getBounds().getCenter();
    const ll = center.lat + "," + center.lng;
    const results = await loadData(searchTerms, ll, 2000);
    console.log(results)
    // plot markers
    for (let r of results.results) {
        const lat = r.geocodes.main.latitude;
        const lng = r.geocodes.main.longitude;
        const marker = L.marker([lat, lng]);
        marker.addTo(resultLayer);
        marker.bindPopup(r.name)

        // search result under the search box
        let resultElement = document.createElement('div');
        resultElement.innerHTML = r.name;

        document.querySelector("#search-results").appendChild(resultElement)
    }
});

document.querySelector("#search-btn").addEventListener('DOMContentLoaded', async function(){
  const programmesResponse = await axios.get("geoJson/programmes.geojson");
  const programmesCoordinates = programmesResponse.data.features[0].geometry.coordinates;
  let programmesMarkerClusterLayer = L.markerClusterGroup();
  for (let i = 0; i < programmesCoordinates.length; i++) {
    let pos = programmesCoordinates[i];
    L.marker([pos[1],pos[0]]).bindPopup(`Service/Programme(s) at Lat: ${pos[1]}, Lon:${pos[0]}`).addTo(programmesMarkerClusterLayer);
  }
  programmesMarkerClusterLayer.addTo(map);
}

,document.querySelector("#search-btn").addEventListener('DOMContentLoaded', async function(){
  const taxiResponse = await axios.get("./geoJson/taxi-availability.geojson");
  const taxiCoordinates = taxiResponse.data.features[0].geometry.coordinates;
  let taxiMarkerClusterLayer = L.markerClusterGroup();
  for (let i = 0; i < taxiCoordinates.length; i++) {
    let pos = taxiCoordinates[i];
    L.marker([pos[1],pos[0]]).bindPopup(`Service/Programme(s) at Lat: ${pos[1]}, Lon:${pos[0]}`).addTo(programmesMarkerClusterLayer);
  }
  taxiMarkerClusterLayer.addTo(map);
}

,loadMrtData()

, async function loadMrtData() {
  console.log('search')
  const response = await axios.get('./geoJson/mrt.geojson');
  const mrtLayer = L.geoJson(response.data, {
    onEachFeature: function (feature, layer) {
      if (feature.type == "station") {
        layer.bindPopup(`
          <div style="min-width:300px">
            <h1>${feature.properties.name}</h1>
          </div>
          `)
      } else {
        layer.bindPopup(`
          <div>
            <h1>${feature.properties.name}</h1>       
          </div>
          `)
      }
    }
  })
  mrtLayer.addTo(map);
}

let programmesMarkerClusterLayer = L.layerGroup();
let taxiMarkerClusterLayer = L.layerGroup();
let mrtLayer = L.layerGroup();


function add CircleMarkersToLayers(
  layer,
  data,
  color
) {
  for (let i =0; i <data.length; i++){
    L.circle(data[i].coordinates, {
      color: color,
      fillColor: color,
      fillOpacity:0.5,
      radius: 250
    }).addTO(layer).bindPopup(data[i].name);
  }
}

addCircleMarkersToLayers(programmesMarkerClusterLayer,programmesResponse,"green")
addCircleMarkersToLayers(taxiMarkerClusterLayer,taxiResponse,"blue")