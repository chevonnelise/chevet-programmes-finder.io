let singapore = [1.3521, 103.8198];
let map = L.map("map-container".setView(singapore, 13));

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

document.querySelector("#map").addEventListener("click", async function(){
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
