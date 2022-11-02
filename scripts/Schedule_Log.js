mapboxgl.accessToken = "pk.eyJ1IjoiamFueTE3NCIsImEiOiJjazlvNGZ6c3cwOTY1M25sMHMyOWVjN2g4In0.lOHzw0_2HFPvpiCKam4Cgg";
let map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: [34.56666667, 40.86666667], // starting position [lng, lat] 101.601007, 3.065076
    zoom: 1 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//add legend on map
map.on('load', function() {
  // the rest of the code will go in here
  let indi = ['Origin','Stopover','Destination','Available Plane(s)'];
  let colors = ['#607d8b','#e91e63','#32373b','#EE95AB'];

  for (let i = 0; i < indi.length; i++)
  {
    let indicator = indi[i];
    let color = colors[i];
    let item = document.createElement('div');
    let key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    let value = document.createElement('span');
    value.innerHTML = indicator;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
});

let markersArray = [];
// map Function to show route on click
function displayRoute (index, category)
{
  // to remove previous polylines
  let hasPoly = map.getLayer('route')
	if (hasPoly !== undefined)
	{
		map.removeLayer('route');
		map.removeSource('route');
	}

  // to remove previous markers
  if (markersArray !== null)
  {
    for (let i =0; i< markersArray.length; i++)
    {
       markersArray[i].remove();
    }
  }

  let originMarker = new mapboxgl.Marker({ color: "#607d8b"});
  markersArray.push(originMarker);
  let destMarker = new mapboxgl.Marker({ color: "#32373b"})
  markersArray.push(destMarker);

  if ( category == 0 )
  {
    let originCoord = userRoutesList.curFlights[index].origin.location;
    let destCoord = userRoutesList.curFlights[index].destination.location;
    let waypointArray = userRoutesList.curFlights[index].waypoint; // an array
    map.panTo(originCoord);

    // markers
    originMarker.setLngLat(originCoord)
    destMarker.setLngLat(destCoord)

    if (waypointArray.length >= 1)
    {
      for (let i=0; i<waypointArray.length; i++)
      {
        let waypointMarker = new mapboxgl.Marker({ color: "#e91e63"})
        markersArray.push(waypointMarker);
        waypointMarker.setLngLat(waypointArray[i].location)
        waypointMarker.addTo(map);
      }
    }

    // polylines
    let typeData = {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
        'type': 'LineString',
        'coordinates': []
      }}
    };

    typeData.data.geometry.coordinates.push(originCoord);

    if (waypointArray.length >= 1)
    {
      for (let i=0; i<waypointArray.length; i++)
      {
        typeData.data.geometry.coordinates.push(waypointArray[i].location);
      }
    }

    typeData.data.geometry.coordinates.push(destCoord);

    map.addLayer({
    id: 'route',
    type: 'line',
    source: typeData,
    layout: {'line-join': 'round','line-cap': 'round'},
    paint: { 'line-color': '#888','line-width': 8}
    })
  }
  else if ( category == 1 )
  {
      let originCoord = userRoutesList.futFlights[index].origin.location;
      let destCoord = userRoutesList.futFlights[index].destination.location;
      let waypointArray = userRoutesList.futFlights[index].waypoint; // an array
      map.panTo(originCoord);

      // markers
      originMarker.setLngLat(originCoord)
      destMarker.setLngLat(destCoord)

      if (waypointArray.length >= 1)
      {
        for (let i=0; i<waypointArray.length; i++)
        {
          let waypointMarker = new mapboxgl.Marker({ color: "#e91e63"})
          markersArray.push(waypointMarker);
          waypointMarker.setLngLat(waypointArray[i].location)
          waypointMarker.addTo(map);
        }
      }

      // polylines
      let typeData = {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': []
          }
        }
      };

      typeData.data.geometry.coordinates.push(originCoord);

      if (waypointArray.length >= 1)
      {
        for (let i=0; i<waypointArray.length; i++)
        {
          typeData.data.geometry.coordinates.push(waypointArray[i].location);
        }
      }

      typeData.data.geometry.coordinates.push(destCoord);

      map.addLayer({
      id: 'route',
      type: 'line',
      source: typeData,
      layout: {'line-join': 'round','line-cap': 'round'},
      paint: { 'line-color': '#888','line-width': 8}
    })
  }
  else if ( category == 2 )
  {
      let originCoord = userRoutesList.pastFlights[index].origin.location;
      let destCoord = userRoutesList.pastFlights[index].destination.location;
      let waypointArray = userRoutesList.pastFlights[index].waypoint; // an array
      map.panTo(originCoord);

      // markers
      originMarker.setLngLat(originCoord)
      destMarker.setLngLat(destCoord)

      if (waypointArray.length >= 1)
      {
        for (let i=0; i<waypointArray.length; i++)
        {
          let waypointMarker = new mapboxgl.Marker({ color: "#e91e63"});
          markersArray.push(waypointMarker);
          waypointMarker.setLngLat(waypointArray[i].location);
          waypointMarker.addTo(map);
        }
      }

      // polylines
      let typeData = {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': []
          }
        }
      };

      typeData.data.geometry.coordinates.push(originCoord);

      if (waypointArray.length >= 1)
      {
        for (let i=0; i<waypointArray.length; i++)
        {
          typeData.data.geometry.coordinates.push(waypointArray[i].location);
        }
      }

      typeData.data.geometry.coordinates.push(destCoord);

      map.addLayer({
      id: 'route',
      type: 'line',
      source: typeData,
      layout: {'line-join': 'round','line-cap': 'round'},
      paint: { 'line-color': '#888','line-width': 8}
    })
  }

  // add markers to map
  originMarker.addTo(map);
  destMarker.addTo(map);
}

//display cards
function displayCards(cards, category)
{
  /* INPUTS:
   * - cards: mdl-cards from the html page. In sched log, move it to the future flights first. Must be an array
   * OUTPUTS:
   * no outputs
   */
   let colour = "";
  for(let i = 0; i<cards.length ; i++)
  {
    let curCardDate = new Date(cards[i].origin.date);
    let curCardArrivalDate = new Date(cards[i].arriveTime);
    let output = ""

    output += `<table>
                <tr>
                  <td></br>
                  </td>
                </tr>
                <tr>
                  <td>`;

    output += `<div class = "wide-card mdl-card mdl-shadow--2dp">`
      if(category == 0)
      {
        output += `<div class = "mdl-card__title" id="current-card">
        <h2 class = "mdl-card__title-text">Current Flight</h2>`;
        colour = "darkorange";
      }
      else if (category == 1)
      {
        output += `<div class = "mdl-card__title" id="future-card">
        <h2 class = "mdl-card__title-text">Future Flights</h2>`;
        colour = "lightgreen";
      }
      else
      {
        output += `<div class = "mdl-card__title" id="past-card">
        <h2 class = "mdl-card__title-text">Past Flights</h2>`;
        colour = "darkred";
      }

      output += `</div>
      <div class = "mdl-card__supporting-text">
        <table>
          <tr>
            <td  class="nonLocations" style="width:60%">
              <h6 class="locationTitle">DEPARTURE AIRPORT</h6>
              <h4 class="airportTitle" style = "color: ${colour}"><b>${cards[i].origin.airport}, ${cards[i].origin.country}</b></h4>
              ${cards[i].origin.weather.currently.apparentTemperature}°C, ${cards[i].origin.weather.daily.summary}`;
    for(let j= 0; j < cards[i].waypoint.length; j++)
    {
    output += `<h5 class="waypoint">${cards[i].waypoint[j].airport}, ${cards[i].waypoint[j].country}</h5>`;
    }
    output += `<h6 class="locationTitle">ARRIVAL AIRPORT</h6>
              <h4 class="airportTitle" style = "color: ${colour}"><b>${cards[i].destination.airport}, ${cards[i].destination.country}</b></h4>
              ${cards[i].destination.weather.currently.apparentTemperature}°C, ${cards[i].destination.weather.daily.summary}


            </td>
            <td class="nonLocations" style="width:30%">
              <h6>DEPARTURE TIME <br><b>${cards[i].origin.time} hrs ${curCardDate.toLocaleDateString()}</b></h6>
              <h6>ARRIVAL TIME<br><b>${cards[i].destination.time} hrs ${curCardArrivalDate.toLocaleDateString()}</b></h6>
              <h6>DISTANCE<br><b>${Math.round(cards[i].distance)} km<b></h6>
              <h6>DURATION<br><b>${cards[i].duration}</b></h6>
            </td>

            <td class="nonLocations">
              <div align = "center">
                <img src="images/airplane-vector.png" alt="Airplane image" id="plane"><br>
              </div>
              <table class="plane-table">`;

              if (category === 0)
              {
                output +=`<tr>
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">AIRLINE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.airline}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">ID </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.id}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">TYPE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.type}</h6</td>
                          </tr>`;
              }
              else if (category === 1)
              {
                output += `<tr>
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">AIRLINE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.airline}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">ID </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.id}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">TYPE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.type}</h6</td>
                          </tr>`;
              }
              else {
                output += `<tr>
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">AIRLINE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.airline}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">ID </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.id}</h6></td>
                          </tr>
                          <tr class="plane-cell">
                            <td class="plane-cell"><h6 class = "title plane-info" style = "color: ${colour}">TYPE </h6></td>
                            <td class="plane-cell"><h6 class="plane-info">${cards[i].plane.type}</h6</td>
                          </tr>`;
              }

              output += `</table>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class = "mdl-card__menu">`
          if(category == 0)
          {
            output +=`<a id="link" href="#mapPan">
                          <button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="View pathway" id="view_cur" style="color:white" onclick ="displayRoute(${i},0)">
                          <i class = "material-icons">gps_fixed</i></button>
                      </a>`;
            output += `<button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="delete_cur" style="color:#FFDA90" onclick ="deleteFlight(${i},0)" disabled>`
          }
          else if (category == 1)
          {
            output +=`<a id="link" href="#mapPan">
                          <button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="View pathway" style="color:#212121" id="view_fut" onclick ="displayRoute(${i},1)">
                          <i class = "material-icons">gps_fixed</i></button>
                      </a>`;
            output += `<button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="delete_fut" onclick ="deleteFlight(${i},1)">`
          }
          else
          {
            output +=`<a id="link" href="#mapPan">
                        <button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="View pathway" id="view_past" style="color:white" onclick ="displayRoute(${i},2)">
                        <i class = "material-icons">gps_fixed</i></button>
                      </a>`;
            output += `<button class = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="delete_past" style="color:#CD5C5C" onclick ="deleteFlight(${i},2)" disabled>`
          }

            output += `<i class = "material-icons">delete_outline</i></button>
          </div>
          </div>
        </td>
      </tr>
      <tr><td><br><br></td></tr>`

    cardsRef.innerHTML += output;
  }
  cardsRef.innerHTML += `</table>`;
}

function deleteFlight(index, category)
{
  if(category == 1)
  {
    if(confirm("Flight will be deleted from bookings."))
    {
      userRoutesList.deleteFutFlight(index);
      updateLocalStorage(userRoutesList, CONFIRMED_ROUTES_KEY);
      alert("Successfully cancelled future flight.");
    }
    else
    {
      alert("Deleting flight cancelled.");
    }
  }
  else
  {
    alert("This flight cannot be deleted.");
  }
    // clean page first
    cardsRef.innerHTML = "";
    // displayCards(cards, category)
    displayCards(userRoutesList.curFlights, 0);
    displayCards(userRoutesList.futFlights, 1);
    displayCards(userRoutesList.pastFlights, 2);
}


// codes to run on page load
let cardsRef = document.getElementById("cards");
cardsRef.innerHTML = ""; // clear cards each time first.

displayCards(userRoutesList.curFlights, 0);
displayCards(userRoutesList.futFlights, 1);
displayCards(userRoutesList.pastFlights, 2);
