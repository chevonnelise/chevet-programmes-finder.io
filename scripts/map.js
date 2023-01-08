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

var taxiIcon = L.icon({
  iconUrl: "../images/taxi.svg",
  iconSize: [50,50]
});

var mrtIcon = L.icon({
  iconUrl: "../images/mrt.svg"
})

var programmeIcon = L.icon({
  iconUrl: '../images/programme-heart.svg'
})

loadData();

async function loadData(query, latLng, radius) {
  const response = await axios.get("https://api.foursquare.com/v3/places/search", {
      params: {
          query: query,
          ll: latLng,
          v: '20210903',
          radius: radius,
          limit: 10
      },
      headers:{
          Accept: 'application/json',
          Authorization:'fsq3yTCwGoC10mQ96bmvqdlYrI2qhubC42VtmGXbfmaGOrs='
      }
  });
  return response.data;
}

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



// document.querySelector("#search-btn").addEventListener('DOMContentLoaded', async function(){
//   const programmesResponse = await axios.get("geoJson/programmes.geojson");
//   const programmesCoordinates = programmesResponse.data.features[0].geometry.coordinates;
//   let programmesMarkerClusterLayer = L.markerClusterGroup();
//   for (let i = 0; i < programmesCoordinates.length; i++) {
//     let pos = programmesCoordinates[i];
//     L.marker([pos[1],pos[0]],{icon:programmeIcon}).bindPopup(`Service/Programme(s) at Lat: ${pos[1]}, Lon:${pos[0]}`).addTo(programmesMarkerClusterLayer);
//   }
//   programmesMarkerClusterLayer.addTo(map);
// }

window.addEventListener('DOMContentLoaded', async () => {
  // // get taxi data and plot on map
  // const taxiResponse = await axios.get("../geoJson/taxi-availability.geojson");
  // console.log(taxiResponse.data.features[0].geometry.coordinates)
  // const taxiCoordinates = taxiResponse.data.features[0].geometry.coordinates;
  // let taxiMarkerClusterLayer = L.markerClusterGroup();
  // for (let i = 0; i < taxiCoordinates.length; i++) {
  //   let pos = taxiCoordinates[i];
  //   L.marker([pos[1],pos[0]],{icon:taxiIcon}).bindPopup(`Service/Programme(s) at Lat: ${pos[1]}, Lon:${pos[0]}`).addTo(taxiMarkerClusterLayer);
  // }
  // taxiMarkerClusterLayer.addTo(map);

  // // get mrt data and plot on map
  // const mrtResponse = await axios.get("../geoJson/mrt.geojson");
  // const mrtLayer = L.geoJson(mrtResponse.data, {
  //   onEachFeature: function (feature, layer) {
  //     if (feature.type == "station") {
  //       layer.bindPopup(`
  //         <div style="min-width:300px">
  //           <h1>${feature.properties.name}</h1>
  //         </div>
  //         `)
  //     } else {
  //       layer.bindPopup(`
  //         <div>
  //           <h1>${feature.properties.name}</h1>       
  //         </div>
  //         `)
  //     }
  //   }
  // })
  // mrtLayer.addTo(map);
})


document.querySelector('#search-btn-modal').addEventListener('click', async () => {
  // get user's input
  let userInput = document.querySelector('#search-terms-programmes').value
  
  // load programmes data
  const programmesDataResponse = await axios.get("../geoJson/programmes.geojson");

  // array of objects
  let programmes = programmesDataResponse.data.features

  // to save results
  let result = [];

  // loop through all programmes and get the result related to the user's search
  for (let i = 0; i < programmes.length; i++) {
    // check there is service/programmes
    if (programmes[i].properties['Service/Programme(s)']) {
      // check that it includes user's input
      if (!(programmes[i].properties['Service/Programme(s)'].search(userInput) == -1)) {
        // plot the marker
        console.log(programmes[i].properties['Service/Programme(s)'])

        const lat = 


      }
    }
    
  }


})


let programmesMarkerClusterLayer = L.layerGroup();
let taxiMarkerClusterLayer = L.layerGroup();
let mrtLayer = L.layerGroup();


function addCircleMarkersToLayers(
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
    }).addTo(layer).bindPopup(data[i].name);
  }
}

// addCircleMarkersToLayers(programmesMarkerClusterLayer,programmesResponse,"green")
// addCircleMarkersToLayers(taxiMarkerClusterLayer,taxiResponse,"blue")
// addCircleMarkersToLayers(mrtLayer,mrtResponse,"red")