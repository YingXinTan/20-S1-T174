let flightDateRef = document.getElementById("flightDate");
let flightTimeRef = document.getElementById("flightTime");
let originCountryRef = document.getElementById("originCountry");
let originAirportRef = document.getElementById("originAirport");
let searchButtonRef = document.getElementById("searchButton");

let airportsUrl = "https://eng1003.monash/api/v1/airports/"
let airportsData = {
  country: "",
  callback: "airportsCallback"
}

// airportsReturned will store all airports that are returned from API call
let airportsReturned = [];

// function to dynamically generate all the airports from a certain selected country by calling API and then callback function airportsCallback(airports)
function generateAirports()
{
  let originDropdownList = document.getElementsByTagName("datalist")[0].options;
  let locationRef = "";
  locationRef = originCountryRef;
  let counter = 0;

  for(let i = 1; i< originDropdownList.length; i++)
  {
    if(locationRef.value === originDropdownList[i].value)
    {
        counter++;
    }
  }

  if(counter === 0)
  {
    alert("Country not in list.");
  }
  else
  {
      console.log("Country in list.");
      airportsData.country = locationRef.value;
  }
  webServiceRequest(airportsUrl,airportsData);
}


// function to the request for airports and populate the airport dropdown lists
function airportsCallback(airports)
{
  let output = "";
  output += '<option value="">';
  for(let i = 0; i < airports.length; i++ )
  {
    output += `<option value="${airports[i].airportCode}">`
  }

  let originAirportListRef = document.getElementById("originAirportList");
  originAirportListRef.innerHTML = output;

  airportsReturned = airports;
}

// to find the coordinates of the selected airport
function findCoordinates()
{
  for(let i = 0; i< airportsReturned.length; i++)
  {
    if(airportsReturned[i].airportCode === originAirportRef.value)
    {
      userFlightInputs.originCoordinates = [];
      userFlightInputs.originCoordinates.push(airportsReturned[i].longitude); // [longitude, latitude]
      userFlightInputs.originCoordinates.push(airportsReturned[i].latitude);
      break;
    }
  }
}

function directToBooking()
{
  // now populate the global variables
  userFlightInputs.date = flightDateRef.value;
  userFlightInputs.time = flightTimeRef.value;
  userFlightInputs.originCountry = originCountryRef.value;
  userFlightInputs.originAirport = originAirportRef.value;
  updateLocalStorage(userFlightInputs,FLIGHT_DATA_KEY);
  window.location = "Booking_Page.html";
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
                  <div class = "mdl-card__menu">
                  </div>
                </div>
              </td>
            </tr>
            <tr><td><br><br></td></tr>`

    cardsRef.innerHTML += output;
  }
  cardsRef.innerHTML += `</table>`;
}

function switchView()
{
  switchCounter++;
  // state 1: curFlights and future Flights
  // state 2: only past flights
  cardsRef.innerHTML = "";
  if(switchCounter%2 == 0)
  {
    displayCards(userRoutesList.curFlights, 0);
    displayCards(userRoutesList.futFlights, 1);
  }
  else
  {
    displayCards(userRoutesList.pastFlights, 2);
  }
}

// codes to run on page load
let switchCounter = 0;
let switchButtonRef = document.getElementById("switchButton");
let cardsRef = document.getElementById("remindercard");
cardsRef.innerHTML = ""; // clear cards each time first.


if(userRoutesList.numOfCurFlights === 0 && userRoutesList.numOfFutFlights === 0 && userRoutesList.numOfPastFlights === 0)
{
  cardsRef.innerHTML += `<div align="center">
                            <h4><b>There's currently no flight routes.<br>Proceed to Start Booking</b></h4>
                        </div>`;
}
else
{
  displayCards(userRoutesList.curFlights, 0);
  displayCards(userRoutesList.futFlights, 1);
}
