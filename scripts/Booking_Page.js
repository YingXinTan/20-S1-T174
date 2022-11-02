mapboxgl.accessToken = "pk.eyJ1IjoiamFueTE3NCIsImEiOiJjazlvNGZ6c3cwOTY1M25sMHMyOWVjN2g4In0.lOHzw0_2HFPvpiCKam4Cgg";
let map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: [userFlightInputs.originCoordinates[0], userFlightInputs.originCoordinates[1]], // starting position [lng, lat] 101.601007, 3.065076
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

//Retrieve UserFlightInput from LocalStorage
let obj = localStorage.getItem(FLIGHT_DATA_KEY);
let retrievedData = JSON.parse(obj);

//Polyline Object
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

// to add polylines from imported plane to the origin airport
let importPlane = {
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

//Markers for origin airports
let originCoor = retrievedData.originCoordinates;
let airportOrigin = retrievedData.originAirport;

let airportsLocation = [
{
  coordinates:originCoor,
  description:airportOrigin
}];

//variables for each airport data
let latOrigin = originCoor[1];
let lngOrigin = originCoor[0];

//Calling WEATHER API
let weatherUrl = "https://eng1003.monash/api/v1/darksky/";
let weatherOriginData = {
  u: "ytan0165",
  key: "82a904e9029032ca12b3b1ad3054eca1",
  lng: lngOrigin,
  lat: latOrigin,
  callback: "weatherCallback"
}
webServiceRequest(weatherUrl,weatherOriginData);

// loop each location in local storage and place marker at respective airports
// Callback Function
function weatherCallback(data)
{
  let originMarker = "";
  let popup = "";
  originWeatherData = data;

  for (let i = 0; i < airportsLocation.length; i++)
  {
	   let location = airportsLocation[i];
     originMarker = new mapboxgl.Marker({ "color": "#607d8b" });
     originMarker.setLngLat(location.coordinates);

	   let popup = new mapboxgl.Popup({
        offset: 45,
        closeOnClick: false // prevent close on mapClick
      });

      if (data.latitude == location.coordinates[1])
	    {
        popup.setHTML(`${location.description} | ${data.currently.temperature}°C`);
      }

     // attach popup to a marker
	   originMarker.setPopup(popup);

    // Display the marker.
    originMarker.addTo(map);

    // Display the popup.
     popup.addTo(map);

     //add clickable markers
      originMarker.getElement().addEventListener("click", function()
      {
        planeCheck();
      })
   }
}

let planeObject = {
  data: {
    code: "",
    status: "",
    latitude: "",
    longitude: ""
  }
}

//function runs when ADD WAYPOINT button is clicked
function planeCheck()
{
  let counter = 0;
  for (let index = 0; index < allPlanes.airplanes.length; index++)
  {
    planeObject.data.code = allPlanes.airplanes[index].location;
    planeObject.data.status = allPlanes.airplanes[index].status;

    let checking = (allPlanes.airplanes[index].location === userFlightInputs.originAirport)//check if at originairport got plane or not

    if (checking === true)
    {
      counter++;
    }
  }

  if (counter == 0)
  {
    alert("No available planes at selected airport. Select a plane from the 5 closest planes from selected airport.");
    nearestPlaneFromOrigin();
  }
  else
  {
    generateAvailablePlanes();
  }
}

function nearestPlaneFromOrigin()
{
  let planeCoordinates = [];
  let nearestFivePlane = [];
  const MAX_NUM_OF_PLANES = 5;

  for (let i = 0; i < allPlanes.airplanes.length; i++)  //planedata
  {
    for (let j = 0; j < allAirports.length;j++)
    {
      if (allPlanes.airplanes[i].location===allAirports[j].airportCode)
      {
        let lat1 = allAirports[j].latitude;
        let lng1 = allAirports[j].longitude;
        planeCoordinates[i] = [lng1,lat1];
        break;
      }
    }
  }

  //calculating the distance between origin and planes
  for (let k = 0; k < planeCoordinates.length; k++)
  {
    let inputPlaneCoor = [planeCoordinates[k][0],planeCoordinates[k][1]];
    let routesDistCoor = [userFlightInputs.originCoordinates,inputPlaneCoor];
    planeDistance[k]=calcDistance(routesDistCoor);
  }

  let temp = [];
  for (let i = 0; i < planeDistance.length; i ++)
   {
     temp[i] = planeDistance[i]; //copy array without affecting original array
   }

   for(let i = 0 ; i < MAX_NUM_OF_PLANES ; i++)
   {
     let currentMin = Math.min(...temp); // Math.min(...array) the formula
     nearestFivePlane.push(currentMin);
     let currentMinIndex = temp.indexOf(currentMin);
     temp.splice(currentMinIndex,1);
   }

   let planeIndex = [];
   let firstFiveCode =[];
   for (let i = 0; i < nearestFivePlane.length; i++)
   {
     for (let j = 0; j < planeDistance.length; j++)
     {
       if (nearestFivePlane[i] == planeDistance[j])
       {
         planeIndex[i]=j;
         firstFiveCode[i]=j;

         if (allPlanes.airplanes[i].registration === planeIndex)
         {
           let newPlane = new Plane(allPlanes.airplanes[i].registration[planeIndex], allPlanes.airplanes[i].location, allPlanes.airplanes[i].range, allPlanes.airplanes[i].avgSpeed, allPlanes.airplanes[i].type, allPlanes.airplanes[i].status, allPlanes.airplanes[i].airline );
           console.log(newPlane);
           curPlaneList.addPlane(newPlane);
         }
       }
     }
   }

   for (let count = 0; count <planeIndex.length; count++)
   {
     let index2 = planeIndex[count];

     let planeM = new mapboxgl.Marker({color: "#EE95AB"});
     planeM.setLngLat([planeCoordinates[planeIndex[count]][0],planeCoordinates[planeIndex[count]][1]]);

     // add the 5 available planes into curPlaneList
     let thisPlane = allPlanes.airplanes[planeIndex[count]]
     let newPlane = new Plane(thisPlane.registration, thisPlane.location, thisPlane.range, thisPlane.avgSpeed, thisPlane.type, thisPlane.status, thisPlane.airline);
     curPlaneList.addPlane(newPlane);

     // create pop ups
     let popup = new mapboxgl.Popup({
       offset: 45,
       closeOnClick: false
     });
     popup.setText(`PLANE ${count+1}: ${newPlane.location}`);
     planeM.setPopup(popup);

     // add marker and popup to the map
     planeM.addTo(map);
     popup.addTo(map);

     // display planes
     displayCards(curPlaneList.planeList);

    //clickable plane markers
    planeMarkers.push(planeM);

    planeM.getElement().addEventListener("click", function()
    {
      if(confirm(`Select plane ${allPlanes.airplanes[planeIndex[count]].registration} at airport ${allPlanes.airplanes[planeIndex[count]].location}?`))
      {
       // if confirm, push coordinates into array for polyline
        importPlane.data.geometry.coordinates.push(planeCoordinates[planeIndex[count]]);
        importPlane.data.geometry.coordinates.push(userFlightInputs.originCoordinates);

        // set the selected plane index based on its position inside curPlaneList
        selectedPlaneIndex = count;

        for (let j =0; j< planeMarkers.length; j++)
        {
           planeMarkers[j].remove();
        }

        // display polyline on map
        map.addLayer({
        id: "routes",
        type: "line",
        source: importPlane,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 8 }
        });

        airportsInRange();
      }
    })
  }
}

function generateAvailablePlanes()
{
  // 1. obtain the coordinates of the planes
  let curPlaneObj = {
    details: "",
    coords: []
  };
  let curPlaneArray = [];
  for (let i = 0; i < curPlaneList.planeListLength; i++)
  {
    for (let j = 0; j < allAirports.length;j++)
    {
      if (curPlaneList.planeList[i].location===allAirports[j].airportCode)
      {
        let lat = allAirports[j].latitude;
        let lng = allAirports[j].longitude;
        let coords = [lng, lat];
        curPlaneObj.details = curPlaneList.planeList[i];
        curPlaneObj.coords = coords;
        curPlaneArray.push(curPlaneObj);
        break;
      }
    }
  }

  // plant markers at the obtained coordinates
  let markersArray = [];
  for (let i = 0; i <curPlaneList.planeListLength; i++)
  {
    let curPlane = curPlaneArray[i];
    let planeM = "";
    let popup = "";

    if(i < 1)
    {
      planeM = new mapboxgl.Marker({color: "#EE95AB", offset: [8, -15]});

      // create pop up
      popup = new mapboxgl.Popup({
         offset: [10, -45],
         closeOnClick: false
       });
    }
    else
    {
      planeM = new mapboxgl.Marker({color: "#EE95AB", offset: [-8, -12] });

      // create pop up
      popup = new mapboxgl.Popup({
         offset: [-15, -35],
         closeOnClick: false
       });
    }
    markersArray.push(planeM);
    planeM.setLngLat(curPlane.coords);

    popup.setText(`PLANE ${i+1}: ${curPlane.details.location}`);
    planeM.setPopup(popup);

     //add marker and popup to map
     planeM.addTo(map);
     popup.addTo(map);

     //clickable plane markers
     planeM.getElement().addEventListener("click", function()
     {
       if(confirm(`Select plane ${i+1} ${curPlane.details.id} at airport ${curPlane.details.location}?`))
       {
         //set the selected plane index based on its position inside curPlaneList
         selectedPlaneIndex = i;

         for (let j =0; j< markersArray.length; j++)
         {
            markersArray[j].remove();
         }

         airportsInRange();
       }
     })
  }
}


// displays top 5 available flights
function displayCards(cards)
{
  /* INPUTS:
   * - cards: mdl-cards from the html page. In Booking Page, it would be the cards that display the top 5 available flights. Must be an array
   * OUTPUTS:
   * no outputs
   */
  //console.log(cards);
  const MAX_DISPLAYED_CARDS = 5;
  flightsDisplayRef.innerHTML = ""; // clear cards each time first.

  if(curPlaneList.planeList.length === 0)
  {
    let output = `There are no available planes from ${userFlightInputs.originAirport} airport.\n`;
  }
  else
  {
      for(let i = 0; i<cards.length && i < MAX_DISPLAYED_CARDS ; i++)
      {
        let output = ""

        output += `<div class="demo-card-wide mdl-card mdl-shadow--2dp">
                                <div class="mdl-card__title">

                                  <h2 class="mdl-card__title-text">PLANE ${i+1}</h2>
                                </div>

        <!--Supporting text-->    <div style="max-height:200px;" class="mdl-card__supporting-text">
                                      <div class="airline-status">
                                        <h5>AIRLINE: ${cards[i].airline}</h5>
                                        <h5>PLANE ID: ${cards[i].id}</h5>
                                        <h5>STATUS: ${cards[i].status}</h5>
                                      </div>

                                      <div class="date-duration">
                                        <h6 style="display: inline-block; padding: 0 40px 0 40px;">Date: ${userFlightInputs.date}</h6>
                                        <h6 style="display: inline-block; padding: 0 40px 0 40px;">Time: ${userFlightInputs.time} hrs</h6>
                                      </div>

                                      <div class="text-information">
                                        <h5 style="display: inline-block; padding: 0 40px 0 40px;">LOCATION: ${cards[i].location}</h5>
                                      </div>

                                      <div class="misc-information">
                                        <h5>MAX RANGE: ${cards[i].range} km</h5>
                                        <h5>AVG SPEED: ${cards[i].avgSpeed} knots</h5>
                                      </div>

                                  </div>



                                </div>

                            <br>
                            <br>`;

        flightsDisplayRef.innerHTML += output;
      }
  }
}

function findAllAirports()
{
  webServiceRequest(airportQueryUrl,airportQueryData);
}

function airportDataCallback(result)
{
  allAirports = result;
  return allAirports;
}

function findAllPlanes()
{
  // 1. Make call to Planes API. Store data into a variable
  // 2. GO through the returned data. Check each available plane if they match the airport we're currently at.
  // 3. If yes, push into an array availableFlights
  // 4. call function displayCards(availableFlights);
  // 5. If no, give user alert. Prompt them to make a waypoint

  webServiceRequest(planesUrl, planesData);
}

// this callbackFunction only runs after the whole page is loaded
// store planes returned from API call into global variable allPlanes
// updates curPlaneList by pushing each new available plane into the array .planeList
function planesCallback(planes)
{
  allPlanes = planes ;

  let output = "";

  for(let i = 0; i< planes.airplanes.length; i++)
  {
     if(planes.airplanes[i].location === userFlightInputs.originAirport)
     {
       let newPlane = new Plane(planes.airplanes[i].registration, planes.airplanes[i].location, planes.airplanes[i].range, planes.airplanes[i].avgSpeed, planes.airplanes[i].type, planes.airplanes[i].status, planes.airplanes[i].airline );
       curPlaneList.addPlane(newPlane);
     }
  }
  displayCards(curPlaneList.planeList);
}

function weatherDest()
{
  let weatherUrl = "https://eng1003.monash/api/v1/darksky/";
  let weatherDestData = {
    u: "ared0005",
    key: "756b083f939d8ae6dbc76c0420afddb5",
    lng: waypointAirports[waypointAirports.length-1].location[0],
    lat: waypointAirports[waypointAirports.length-1].location[1],
    callback: "weatherDestCallback"
  }
webServiceRequest(weatherUrl,weatherDestData);
}

function weatherDestCallback(destData)
{
  destWeatherData = destData;

  // show the Booking Summary
  displaySummary(waypointAirports);
}

// makes a call to the Airports API to find all planes within glying range of the plane we're using
function airportsInRange()
{
  // polyline point for origin
  typeData.data.geometry.coordinates.push([userFlightInputs.originCoordinates[0], userFlightInputs.originCoordinates[1]])

  // - call airport API
  let rangeUrl = "https://eng1003.monash/api/v1/airports/";
  let dataRangeQuery = {
    lat: userFlightInputs.originCoordinates[1],
    lng: userFlightInputs.originCoordinates[0],
    range: curPlaneList.planeList[selectedPlaneIndex].range,
    callback: "airportsInRangeCallback"
  }
  webServiceRequest(rangeUrl,dataRangeQuery);
}

function airportsInRangeCallback(result)
{
  let markersArray = [];
  for (let i =0; i<result.length; i++ )
  {
    let airportCode = result[i].airportCode;
    let airportName = result[i].name;
    let city = result[i].city;
    let country = result[i].country;
    let lat = result[i].latitude;
    let lng = result[i].longitude;

    // markers for selected airport in Range
    let airportLocations =
    {
      coordinates: new mapboxgl.LngLat(lng,lat),
      coordPolylines: [lng,lat],
      codes: airportCode,
      country: country,
      city: city,
      airport: airportName
    }

    //add markers for each respective airports
    let marker = "";
    if(buttonValid === false)
    {
        marker = new mapboxgl.Marker({ "color": "#e91e63" });
    }
    else if(buttonValid === true)
    {
      marker = new mapboxgl.Marker({ "color": "#32373b" });
    }

    marker.setLngLat(airportLocations.coordinates);

    //add short description of each airports
    let popup = new mapboxgl.Popup(
      {
        offset: 45
      });
    popup.setText(`${airportLocations.codes}`);

    // attach popup to a marker
    marker.setPopup(popup);

    // Display the marker.
    marker.addTo(map);

   // Display the popup.
    popup.addTo(map);

    // push into markersArray
    markersArray.push(marker);

    // add clickable markers
    marker.getElement().addEventListener("click", function()
    {
      let locationStr = buttonValid? 'destination?':'way point?';

      if(confirm(`Select airport ${airportLocations.codes} as a ` + locationStr))
      {
        // if confirm, push coordinates into array for polyline
        typeData.data.geometry.coordinates.push(airportLocations.coordPolylines);
        // if confirm, push the data about the airport into array waypointAirports
        let newWaypoint = new Waypoint(userFlightInputs.date, airportLocations.country, airportLocations.codes, airportLocations.coordPolylines)
        waypointAirports.push(newWaypoint);

        waypointMarkers.push(markersArray[i]); // if waypoint is selected, pushinto global vairable waypointMarkers
        for (let j =0; j<result.length; j++ )
        {
          if(result[j] !== result[i])
          {
            markersArray[j].remove();
          }
        }

        // if button has not been pressed, make an API call to airport API to do a search based on range
        if(buttonValid === false)
        {
          let rangeUrl = "https://eng1003.monash/api/v1/airports/";
          let dataRangeQuery = {
            lat: result[i].latitude,
            lng: result[i].longitude,
            range: curPlaneList.planeList[selectedPlaneIndex].range,
            callback: "airportsInRangeCallback"
          }
          webServiceRequest(rangeUrl,dataRangeQuery);
        }
        else if(buttonValid === true)
        {
          alert("Your set route looks like this.");

          weatherDest();

          // Adding polylines to map
           map.addLayer({
           id: 'route',
           type: 'line',
           source: typeData,
           layout: {'line-join': 'round','line-cap': 'round'},
           paint: { 'line-color': '#888','line-width': 8}
            })
        }
      };
    });
  }

  // outside the for loop, copy values of markersArray to globalMarkers
  globalMarkers = markersArray;
}

// calculate total distance of route
function calcDistance(routeCoord) // routeCoord must be an array that contains array of coordinates eg. [ [lng1,lat1],[lng2,lat2] ]
{
  let totalDistance = 0;
  for (let i=0; i<routeCoord.length-1; i++)
  {
  	  let R = 6371; // radius of earth in km
  	  let latRad1 = routeCoord[i][1] * (Math.PI/180);  // φ, λ in radians
  	  let latRad2 = routeCoord[i+1][1] * (Math.PI/180);
  	  let lngRad1 = routeCoord[i][0];
  	  let lngRad2 = routeCoord[i+1][0];
  	  let latDiff = (latRad2-latRad1) * (Math.PI/180);
  	  let lngDiff = (lngRad2-lngRad1) * (Math.PI/180);

  	  let a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
  				Math.cos(latRad1) * Math.cos(latRad2) *
  				Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
  	  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  	  let distance = R * c; // in km
  	  totalDistance += distance;
  }
  return totalDistance;
}

// calculate duration of flight
function calcDuration(totalDistance,avgSpeed) // conversion of avgSpeed from knots to km is done within function
{
	let kmPerKnots = 1.852;
	let durationInHours = (totalDistance/(avgSpeed*kmPerKnots)); // gives duration IN hours eg. 7.9994 hours (aka 7hr&59min)
	let durationMinutes = (durationInHours-Math.floor(durationInHours))*60; // eg. 7 hours and 59 minutes, this gives 59 minutes
	let durationInfo = {
		durationString:`${Math.floor(durationInHours)} hr ${Math.floor(durationMinutes)} min`, // duration in string form for display
		durationInHours: durationInHours, // information used for calculating arrival time
		durationMinutes: durationMinutes  // information used for calculating arrival time
	};
	return durationInfo; // returns an object, use .durationString for display purposes
}

// Calculate arrival time
function calcArrivalTime(startDate,totalDistance,avgSpeed) // startDate must be either eg.("October 13, 2014 11:13:00") or (2014,10,13,11,13)
{
	let duration = calcDuration(totalDistance,avgSpeed); // calling calcDuration function
	let startTime = new Date(startDate);
  startTime.setHours(startTime.getHours() + duration.durationInHours ); // set hours for arrival time
	startTime.setMinutes(startTime.getMinutes() + duration.durationMinutes ); // set minutes for arrival time
	let arrivalTime = startTime;
	return arrivalTime;
}

// display summary of route selected by user
function displaySummary(waypointAirports)
{
  /* INPUTS:
   * waypointAirports: an array that holds the information about the waypoint airports chosen
   */
  flightSummaryRef.innerHTML = ``;
  const MIN_WAYPOINT_CELLS = 3;
  const MIN_LOCATION_CELLS = 5;

  let newOrigin = new Location(userFlightInputs.date, userFlightInputs.time, userFlightInputs.originCountry, userFlightInputs.originAirport, userFlightInputs.originCoordinates, originWeatherData);
  destElement = waypointAirports[waypointAirports.length-1];
  let newDest = new Location(userFlightInputs.date, userFlightInputs.time, destElement.country, destElement.airport, destElement.location, destWeatherData);

  // insert all coordinates into an array for calc distance, duration & arrival time
  let routeCoord=[newOrigin.location];
  for (let i=0; i < waypointAirports.length; i++)
  {
    routeCoord.push(waypointAirports[i].location);
  }
  let totalDistance = calcDistance(routeCoord);
  let duration=calcDuration(totalDistance,curPlaneList._planeList[0]._avgSpeed);

  // changing format of time and combining into input of date object
  let date = new Date(newOrigin.date);
  date.setHours(newOrigin.time[0]+newOrigin.time[1],newOrigin.time[3]+newOrigin.time[4]);
  let arrivalTime=calcArrivalTime(date,totalDistance,curPlaneList._planeList[0]._avgSpeed);

  let arrivalTimeHours = arrivalTime.getHours().toString();
  if (arrivalTimeHours.length < 2)
  {
    arrivalTimeHours = "0" + arrivalTimeHours;
  }
  else
  {
    arrivalTimeHours = arrivalTimeHours;
  }

  let arrivalTimeMins = arrivalTime.getMinutes().toString();
  if (arrivalTimeMins.length < 2)
  {
    arrivalTimeMins = "0"+arrivalTimeMins;
  }
  else
  {
    arrivalTimeMins = arrivalTimeMins;
  }

  // set destination details into class instance
  newDest.date=arrivalTime;
  newDest.time=arrivalTimeHours +":"+ arrivalTimeMins;

  // set weather details into class instance
  newDest.weather = destWeatherData;

  let originMinTemp = "";
  let originMaxTemp = "";
  let destMinTemp = "";
  let destMaxTemp = "";

  for (let j = 0; j < originWeatherData.daily.data.length; j++)
  {
    originMinTemp = originWeatherData.daily.data[j].temperatureLow;
    originMaxTemp = originWeatherData.daily.data[j].temperatureHigh;
  }

  for (let k = 0; k < originWeatherData.daily.data.length; k++)
  {
    destMinTemp = destWeatherData.daily.data[k].temperatureLow;
    destMaxTemp = destWeatherData.daily.data[k].temperatureHigh;
  }

  if (destWeatherData == undefined || destWeatherData == null)
  {
    destWeatherData = "no weather data available";
  }

  // removed the extra onlyWaypoints
  let weatherCell = `<td id="weather-cell" rowspan="2">
                    <table width="100%" class="weather-table">
                      <tr>
                        <td class="temperature" id="originTempCurr"><br>${(originWeatherData.currently.temperature).toFixed(1)} °C</td>
                        <td class="temperature" id="destTempCurr"><br>${(destWeatherData.currently.temperature).toFixed(1)} °C</td>
                      </tr>
                      <tr>
                        <td>${newOrigin.airport}</td>
                        <td>${newDest.airport}</td>
                      </tr>
                      <tr>
                        <td><h6>${originMinTemp.toFixed(1)}°C - ${originMaxTemp.toFixed(1)}°C <br>${originWeatherData.daily.summary}</h6></td>
                        <td><h6>${destMinTemp.toFixed(1)}°C - ${destMaxTemp.toFixed(1)}°C <br> ${destWeatherData.daily.summary}</h6></td>
                      </tr>
                    </table>
                  </td>`;
  let durationCell = `<td align="center" colspan="3" class="duration">Duration: ${duration.durationString} | Distance: ${Math.round(totalDistance)} km</td>`

  let destRow = `<tr>
                   <td width="50px" class="icons-col"><i class="material-icons md-48">location_on</i></td>
                   <td  class="journey"><b>Destination</b></td>
                   <td ><b>${arrivalTimeHours}:${arrivalTimeMins} ${arrivalTime.toLocaleDateString()} ${newDest.airport}, ${newDest.country}<i class="material-icons">wb_sunny</i></b></td>
                </tr>`;
  let destCell = `<td width="50px" class="icons-col"><i class="material-icons md-48">location_on</i></td>
                  <td  class="journey"><b>Destination</b></td>
                  <td ><b>${arrivalTimeHours}:${arrivalTimeMins} ${arrivalTime.toLocaleDateString()} ${newDest.airport}, ${newDest.country}<i class="material-icons">wb_sunny</i></b></td>`;
  let emptyRow = `<tr>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr>`;
  let output = "";

  // display the "general cells" -- the plane cell and the origin cell
  output += `<h3>BOOKING SUMMARY</h3>
     <table class="fixed" style="width:100%">
        <tr>
           <td id="plane-cell" rowspan="4"><img src="images/airplane-vector.png" alt="Airplane image" id="plane">
              <table class="plane-table">
                <tr>
                  <td class="title">AIRLINE</td>
                  <td>${curPlaneList.planeList[selectedPlaneIndex].airline}</td>
                </tr>
                <tr>
                  <td class="title">ID</td>
                  <td>${curPlaneList.planeList[selectedPlaneIndex].id}</td>
                </tr>
                <tr>
                  <td class="title">TYPE</td>
                  <td>${curPlaneList.planeList[selectedPlaneIndex].type}</td>
                </tr>
              </table>
           </td>
           <td width="50px" class="icons-col"><i class="material-icons md-48">location_on</i></td>
           <td  class="journey"><b>Origin</b></td>
           <td><b>${newOrigin.time} ${newOrigin.date.toLocaleDateString()} ${newOrigin.airport}, ${newOrigin.country} <i class="material-icons">wb_sunny</i></b></td>
        </tr>`;


  // when there's less than 5 waypoints
  if(waypointAirports.length < MIN_LOCATION_CELLS)
  {
    // when there's only origin and destination, include a more_vert icon in between them
    if(waypointAirports.length <= MIN_WAYPOINT_CELLS - 1)
    {
      output += `<tr>
         <td width="50px" class="icons-col"><i class="material-icons md-48">more_vert</i></td>`;
      if(waypointAirports.length === 1) // no waypoints
      {
        output += `<td  class="journey"></td>
                    <td></td>
                 </tr>`;
      }
      // when there's only one waypoint, display only the origin, dest and waypoint
      else if(waypointAirports.length === 2) // one waypoint
      {
        output += `<td  class="journey">Waypoint ${waypointAirports.length-1}</td>
                    <td>${waypointAirports[0].airport}, ${waypointAirports[0].country}</td>
                 </tr>`;
      }
      output += destRow + emptyRow + emptyRow + '<tr>' + weatherCell + durationCell + '</tr>';
    }
    else if(waypointAirports.length> MIN_WAYPOINT_CELLS - 1)
    {
      for(let i = 0; i< waypointAirports.length-1; i++ ) // since the ast item in waypointAirports is the destination
      {
        output += `<tr>
                     <td width="50px" class="icons-col"><i class="material-icons md-48">more_vert</i></td>
                     <td  class="journey">Waypoint ${i + 1}</td>
                     <td>${waypointAirports[i].airport}, ${waypointAirports[i].country}</td>
                  </tr>`;
      }
      if(waypointAirports.length === MIN_WAYPOINT_CELLS) // 2 waypoints
      {
          output += destRow + '<tr>' + weatherCell + durationCell +'</tr>';
      }
      else if(waypointAirports.length > MIN_WAYPOINT_CELLS) // 3 waypoints
      {
        output += '<tr>' + weatherCell + destCell +'</tr>' + '<tr>' + durationCell + '</tr>';
      }
    }
  }
  else if(waypointAirports.length >= MIN_LOCATION_CELLS)
  {
    for(let i = 0; i< waypointAirports.length-1 && i < MIN_WAYPOINT_CELLS; i++ ) // since the ast item in waypointAirports is the destination
    {
      output += `<tr>
                   <td width="50px" class="icons-col"><i class="material-icons md-48">more_vert</i></td>
                   <td  class="journey">Waypoint ${i + 1}</td>
                   <td>${waypointAirports[i].airport}, ${waypointAirports[i].country}</td>
                </tr>`;
    }
    output += '<tr>' + weatherCell;
    output += `<td width="50px" class="icons-col"><i class="material-icons md-48">more_vert</i></td>
               <td  class="journey">Waypoint ${MIN_WAYPOINT_CELLS + 1}</td>
               <td>${waypointAirports[MIN_WAYPOINT_CELLS].airport}, ${waypointAirports[MIN_WAYPOINT_CELLS].country}</td>
            </tr>`;
    if(waypointAirports.length == MIN_LOCATION_CELLS) // 4 waypoints
    {
      output += destRow + '<tr><td></td>' + durationCell +'<tr>';
    }
    else if(waypointAirports.length > MIN_LOCATION_CELLS) // 5 waypoints
    {
      for(let i = MIN_LOCATION_CELLS - 1; i< waypointAirports.length-1; i++  )
      {
        output += `<tr>`;
        output += (i >= MIN_LOCATION_CELLS ? '<td></td>': '');
        output +=   `<td width="50px" class="icons-col"><i class="material-icons md-48">more_vert</i></td>
                     <td  class="journey">Waypoint ${i + 1}</td>
                     <td>${waypointAirports[i].airport}, ${waypointAirports[i].country}</td>
                  </tr>`;
      }
      output += '<tr><td></td>' + destCell + '</tr>'+ '<tr><td></td>' + durationCell +'<tr>';
    }
  }

  output += `</table>

   <hr>

   <div align="center">
     <!-- Accent-colored raised button with ripple -->
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="confirmButton" onclick="confirmSelection()">
      CONFIRM
    </button>
   </div>`;

   flightSummaryRef.innerHTML = output;

  let onlyWaypoints = waypointAirports;
  onlyWaypoints.pop(); // remove destination from the array
  let newRoute = new Route(newOrigin, newDest, onlyWaypoints, curPlaneList.planeList[selectedPlaneIndex], newOrigin.date, duration.durationString, totalDistance, newOrigin.time, arrivalTime );
  curRoute = newRoute;
}

function confirmSelection()
{
  if(confirm("Are you sure?"))
  {
    alert("Booking successful. Proceed to Schedule Log to view booking details.");
    userRoutesList.addFutFlights(curRoute);

    updateLocalStorage(userRoutesList, CONFIRMED_ROUTES_KEY);
    window.location = "Schedule_Log.html";
  }
  else
  {
    alert("Booking cancelled.");
  }
}

function finaliseRoute()
{
  buttonValid = true;
  let finalWaypoint = waypointMarkers[waypointMarkers.length-1];

  // clear the field of orange markers
  for(let i = 0; i< globalMarkers.length ; i++)
  {
    if(globalMarkers[i] !== finalWaypoint)
    {
      globalMarkers[i].remove();
    }
  }

  // populate the map with red markers
  let rangeUrl = "https://eng1003.monash/api/v1/airports/";
  let dataRangeQuery = {
    lng: finalWaypoint.getLngLat().lng,
    lat: finalWaypoint.getLngLat().lat,
    range: curPlaneList.planeList[selectedPlaneIndex].range,
    callback: "airportsInRangeCallback" // WP stands for waypoint
  }
  webServiceRequest(rangeUrl,dataRangeQuery);
}

// Codes to run on page load
let planesUrl = "https://eng1003.monash/api/v1/planes/"
let planesData = {
  callback: "planesCallback"
}

let airportQueryUrl = "https://eng1003.monash/api/v1/airports/";
let airportQueryData = {
  country: "",
  callback: "airportDataCallback"
}

let flightSummaryRef = document.getElementById("flightSummary");
let flightsDisplayRef = document.getElementById("flightsDisplay");
let allPlanes = "";
let allAirports = "";
let destWeatherData = ""; //holds weather information of the destination
let originWeatherData = ""; //holds weather information of the origin
let destElement = "";
let curPlaneList = new PlaneList();
let curRoute = null; // will be an instance of route. Refers to the route the user is making now.
let selectedPlaneIndex = 0;

// findAllPlanes() is a function to call the web API for planes
// findAllAirports() is a function to call the web API for airports
findAllPlanes();
findAllAirports();

let buttonValid = false;
let setRouteButtonRef = document.getElementById("setRouteButton");
let waypointMarkers = [];
let waypointAirports = [];

// global markers should have all the orange markers on the screen now
let globalMarkers = [];
let planeDistance = [];
let planeMarkers = [];

planeCode = [];
