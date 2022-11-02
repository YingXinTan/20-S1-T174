// Constants used as KEYS for LocalStorage
const FLIGHT_DATA_KEY = "userFlightInputsObj";
const CONFIRMED_ROUTES_KEY = "userRoutesObj";

// Location
class Location
{
  constructor(date="",time = "",country="",airport="",location=[],weather="")
  {
    this._date= new Date(date);
    this._time = time;
    this._country= country;
    this._airport= airport;
    this._location= location;
    this._weather= weather;
  }
  // getters
  get date() { return this._date; }
  get time() {return this._time;}
  get country() { return this._country; }
  get airport() { return this._airport; }
  get location() { return this._location; }
  get weather() { return this._weather; }

  //mutators
  set date(newDate)
  {
    this._date = newDate;
  }

  set time(newTime)
  {
    this._time = newTime;
  }

  // methods
  fromData(locationObj)
  {
    this._date= locationObj._date;
    this._time = locationObj._time;
    this._country= locationObj._country;
    this._airport= locationObj._airport;
    this._location= locationObj._location;
    this._weather= locationObj._weather;
  }

  toString()
  {
    let output = "";
    return output += `Location class
                  Date: ${this._date.toLocaleDateString()}
                  Country: ${this._country}
                  Airport: ${this._airport}
                  Location: ${this._location}
                  Weather: ${this._weather} \n`;
  }
}

// Waypoint
class Waypoint
{
  //constructor
  constructor(date = "", country = "", airport = "", location = [])
  {
    this._date = new Date(date);
    this._country = country;
    this._airport = airport;
    this._location = location;
  }

  //accessor
  get date() { return this._date; }
  get country () { return this._country; }
  get airport() { return this._airport; }
  get location() { return this._location; }

  //mutators
  set country(newCountry)
  {
    this._country = newCountry;
  }

  set airport(newAirport)
  {
    this._airport = newAirport;
  }

  set location(newLocation)
  {
    this._location = newLocation;
  }

  //methods
  fromData(waypointObj)
  {
    this._date = waypointObj._date;
    this._country = waypointObj._country;
    this._airport = waypointObj._airport;
    this._location = waypointObj._location;
  }

  toString()
  {
    let output = "";
    output +=`WayPoint class
              Date: ${this._date.toLocaleDateString()}
              Country: ${this._country}
              Airport: ${this._airport}
              Location: ${this._location}\n\n`;
    return output;
  }
}

// Plane
class Plane
{
  constructor(id="", location = "", range= 0, avgSpeed= 0, type = "", status="", airline="")
  {
    this._id= id;
    this._location= location;
    this._range= range;
    this._avgSpeed= avgSpeed;
    this._type = type;
    this._status= status;
    this._airline= airline;
  }

  // accessors
  get id() { return this._id; }
  get location() { return this._location; }
  get range() { return this._range; }
  get avgSpeed() { return this._avgSpeed; }
  get type() {return this._type; }
  get status() { return this._status; }
  get airline() { return this._airline; }

  // mutators
  set location (newLocation)
  {
    this._location = newLocation;
  }
  set status (newStatus)
  {
    this._status = newStatus;
  }

  // methods
  fromData(planeObj)
  {
    this._id= planeObj._id;
    this._location= planeObj._location;
    this._range= planeObj._range;
    this._avgSpeed= planeObj._avgSpeed;
    this._type = planeObj._type;
    this._status= planeObj._status;
    this._airline= planeObj._airline;
  }

  toString()
  {
  	let output = "";
    output += `> ID: ${this._id}\n`
    output += `> Location: ${this._location}\n`;
    output += `> Range: ${this._range}\n`;
    output += `> Average Speed: ${this._avgSpeed}\n`;
    output += `> Type: ${this._type}\n`;
    output += `> Status: ${this._status}\n`;
    output += `> Airline: ${this._airline}\n\n`;
    return output;
  }
}

// Plane List
class PlaneList // it's the array for fleet information
{
  //constructor
  constructor ()
  {
    this._planeList = []; // this array will be populated by routes. Each route must be an instance of Route
  }

  //accessors
  get planeList() { return this._planeList; }
  get planeListLength() { return this._planeList.length; }

  //methods
  addPlane(list)
  {
    if(list instanceof Plane) // some quick error checking to prevent any non-planes to be added into the array
    {
      if(list.status === "available") // only push available planes into the array
      {
        this._planeList.push(list);
      }
    }
    else
    {
      console.log("ERROR: Input is not an instance of Plane.");
    }
  }

  fromData(planeListObj)
  {
    this._planeList = planeListObj._planeList;
  }

  toString()
  {
    let output = "";
    output += `PlaneList class:\nPlanelist:\n\n`;

    for(let i = 0; i< this._planeList.length; i++)
    {
      output += `Plane ${i+1} \n${this._planeList[i]}`;
    }
    return output;
  }
}

// Route
class Route
{
  constructor(origin=null,destination=null,waypoint=[],plane="",date="",duration="",distance=0,departTime="",arriveTime="")
  {
    if(origin instanceof Location && destination instanceof Location)
    {
      this._origin= origin;
      this._destination= destination;
    }
    else
    {
        console.log("ERROR: origin/ destination !instanceof Location.");
    }

    this._waypoint= waypoint;
    this._plane= plane;
    this._date= new Date(date);
    this._duration= duration;
    this._distance= distance;
    this._departTime = new Date(departTime);
    this._arriveTime = new Date(arriveTime);
  }

  //accessors
  get origin() { return this._origin; }
  get destination() { return this._destination; }
  get waypoint() { return this._waypoint; }
  get plane() { return this._plane; }
  get date() { return this._date; }
  get duration() { return this._duration; }
  get distance() { return this._distance; }
  get departTime() { return this._departTime; }
  get arriveTime() { return this._arriveTime; }

  //mutators
  set origin(newOrigin)
  {
    this._origin = newOrigin;
  }
  set destination(newDestination)
  {
    this._destination = newDestination;
  }
  set plane(newPlane)
  {
    this._plane = newPlane;
  }

  // methods
  addWaypoint(newWaypoint)
  {
    this._waypoint.push(newWaypoint);
  }

  calcDuration(avgSpeed,distance)
  {
    let totalDuration = distance/avgSpeed;
  }

  calcDepartTime(arriveTime,duration)
  {
    let departTime = arriveTime - duration;
  }

  fromData(routeObj)
  {
    this._origin= routeObj._origin;
    this._destination= routeObj._destination;
    this._waypoint= routeObj._waypoint;
    this._plane= routeObj._plane;
    this._date= routeObj._date;
    this._duration= routeObj._duration;
    this._distance= routeObj._distance;
    this._departTime = routeObj._departTime;
    this._arriveTime = routeObj._arriveTime;
  }

  toString()
  {
      let output = "";
     output += `Route class
                Origin:\n ${this._origin}
                Destination: \n${this._destination}`;

	  output += `\nWaypoint: \n`;
	 for(let i = 0; i< this._waypoint.length; i++)
	 {
		 output += `${i+1}. \n ${this._waypoint[i]}`;
	 }

     output += `Plane: \n`;
	 for(let i = 0; i< this._plane.length; i++)
	 {
		 output += `${i+1}. \n ${this._plane[i]}`;
	 }

     output += `Date: \n${this._date.toLocaleDateString()}\n
                Duration: \n${this._duration}\n
                Distance: \n${this._distance}\n
                Depart Time: \n${this._departTime}\n
                Arrive Time: \n${this._arriveTime}\n`;

	  return output;
  }
}

// Route List
class RouteList
{
  //constructors
  constructor()
  {
      //private attributes
      this._curFlights = [];
      this._futFlights = [];
      this._pastFlights = [];
  }

  //accessors
  get curFlights() {return this._curFlights;}
  get futFlights() {return this._futFlights;}
  get pastFlights() {return this._pastFlights;}
  get numOfCurFlights() {return this._curFlights.length;}
  get numOfFutFlights() {return this._futFlights.length;}
  get numOfPastFlights() {return this._pastFlights.length;}

  //mutators
  set curFlights(newCurFlights)
  {
    this._curFlights = newCurFlights;
  }
  set futFlights(newFutFlights)
  {
    this._futFlights = newFutFlights;
  }
  set pastFlights(newPastFlights)
  {
    this._pastFlights = newPastFlights;
  }

  //methods
  addCurFlights(curFlights)
  { this._curFlights.push(curFlights);}

  addFutFlights(futFlights)
  { this._futFlights.push(futFlights);}

  addPastFlights(pastFlights)
  { this._pastFlights.push(pastFlights);}

//deleting flight of one card
  deleteFutFlight(index)
  {
    this._futFlights.splice(index, 1);
  }


  fromData(routeListObj)
  {
    this._curFlights = routeListObj._curFlights;
    this._futFlights = routeListObj._futFlights;
    this._pastFlights = routeListObj._pastFlights;
  }

  toString()
  {
      let output = "";
      output +=    `RouteList Class\n
                            Current Flights:\n`;
	  for(let i = 0; i< this.numOfCurFlights; i++)
	  {
		  output += `\n>>> Route ${i+1} \n${this._curFlights[i]}\n\n`;
	  }

	  output += `Future Flights:\n`;
	   for(let i = 0; i< this.numOfFutFlights; i++)
	  {
		  output += `\n>>> Route ${i+1}. \n${this._futFlights[i]}\n`;
	  }

	  output += `Past Flights:\n`;
	  for(let i = 0; i< this.numOfPastFlights; i++)
	  {
		  output += `\n>>> Route ${i+1}. \n${this._pastFlights[i]}\n\n`;
	  }

     return output;
  }
}

function checkIfDataExistsLocalStorage(key)
{
  let data = localStorage.getItem(key);

    if(typeof data === "undefined" || data === null || data === "")
    {
      return false;
    }
    else
    {
        return true;
    }
}

function updateLocalStorage(data, key)
{
  // REMINDER: I'm not sure if all data for this assignment will be an object. To be safe, assume not all are object.
  if(typeof data === "object")
  {
    data = JSON.stringify(data);
  }
  localStorage.setItem(key, data);
}

function getDataLocalStorage(key)
{
  let data = localStorage.getItem(key);
  try
  {
     data = JSON.parse(data);
  }
  catch(e)
  {
     console.log(e);
  }
  finally
  {
     return data;
  }
}

function webServiceRequest(url,data)
{
    // Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (params.length == 0)
            {
                // First parameter starts with '?'
                params += "?";
            }
            else
            {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
         }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

function restoreAllClasses(flightCategory)
{
  /* INPUTS:
   * - flightCategory: can either be PlaneList .curFlights , .pastFlights or .futFlights
   * OUTPUTS:
   * - flightCategory: restored class instances version of input
   */
  // flight Category can only be either PLaneList.curFlights, PLaneList.futFlights or PlaneList.pastFlights
  for(let i = 0; i< flightCategory.length; i++)
  {
    // restore Route class instances
    let restoreOrigin = new Location();
    let restoreDest = new Location();
    let restoreRoute = new Route(restoreOrigin, restoreDest);
    restoreRoute.fromData(flightCategory[i]);
    flightCategory[i] = restoreRoute;

    // restore Location class instances
    restoreOrigin.fromData(flightCategory[i].origin);
    flightCategory[i].origin = restoreOrigin;
    restoreDest.fromData(flightCategory[i].destination);
    flightCategory[i].destination = restoreDest;

    // restore Plane class instances
    let restorePlane = new Plane();
    restorePlane.fromData(flightCategory[i].plane);
    flightCategory[i].plane = restorePlane;

    // restore Waypoint class instances
    for(let j = 0; j < flightCategory[i].waypoint.length; j++ )
    {
      let restoreWaypoint = new Waypoint();
      restoreWaypoint.fromData(flightCategory[i].waypoint[j]);
      flightCategory[i].waypoint[j] = restoreWaypoint;
    }
  }

  return flightCategory;
}

// Global variables to be used across all pages
let userFlightInputs = {
  date: "",
  time: "",
  originCountry: "",
  originAirport: "",
  originCoordinates: [], // [longitude, latitude]
};

let userRoutesList = new RouteList();

// codes to run on page run
// check if data exists in LocalStorage to populate flight info
// if data exists, populate the userFlightInputs from data retrieved
let dataExists = checkIfDataExistsLocalStorage(FLIGHT_DATA_KEY);
if(dataExists === true)
{
  let dataRetrieved = getDataLocalStorage(FLIGHT_DATA_KEY);
  userFlightInputs.date = dataRetrieved.date;
  userFlightInputs.time = dataRetrieved.time;
  userFlightInputs.originCountry = dataRetrieved.originCountry;
  userFlightInputs.originAirport = dataRetrieved.originAirport;
  userFlightInputs.originCoordinates = dataRetrieved.originCoordinates; // [longitude, latitude]
}

// check if data exists in LocalStorage to populate the latest data about the routes selected
// if data exists, populate the userRoutesList from data retrieved
let userRoutesListExist = checkIfDataExistsLocalStorage(CONFIRMED_ROUTES_KEY);
if(userRoutesListExist === true)
{
  let dataRetrieved = getDataLocalStorage(CONFIRMED_ROUTES_KEY);
  let restoreRouteList = new RouteList();

  // restore all data to thier respective class instanceS
  // restore dataRetrieved into a class instance of RouteList
  restoreRouteList.fromData(dataRetrieved);
  
  // now that restoreRouteList is instance of RouteList, can use the function restoreAllClasses
  restoreRouteList.curFlights = restoreAllClasses(restoreRouteList.curFlights);
  restoreRouteList.futFlights = restoreAllClasses(restoreRouteList.futFlights);
  restoreRouteList.pastFlights = restoreAllClasses(restoreRouteList.pastFlights);

  userRoutesList = restoreRouteList;

  // 1. compare if the route is scheduled close to now or not
  // 2. if scheduledTime < now -> past Flights
  // 3. if scheduledTime == now -> current Flights
  // 4. if scheduledTime > now -> future Flights
  // 5. display the cards accordingly
  // 6. update localStorage
  let now = new Date();
  let cmpRouteList = new RouteList();

  for(let i = 0; i< userRoutesList.numOfFutFlights; i++ )
  {
      let time = userRoutesList.futFlights[i].origin.time; // time input is in string form e.g "21:35"

      // turn the date string back into a date object
      let dateStr = userRoutesList.futFlights[i].origin.date;
      let dateObject = new Date(dateStr);

      // set hour and minute into dateObject
      dateObject.setHours(time[0]+time[1],time[3]+time[4]);
      dateObject = new Date(dateObject.getTime());

      // creating a date object for destination
      let destDateObject = new Date(userRoutesList.futFlights[i].arriveTime);

      // current flights, within +-10 minutes from now AND still flying
      if (dateObject< now && destDateObject > now )
      {
        cmpRouteList.addCurFlights(userRoutesList.futFlights[i]);
      }
      // past flights
      else if (dateObject < now)
      {
        cmpRouteList.addPastFlights(userRoutesList.futFlights[i]);
      }
      // future flights
      else if(dateObject > now)
      {
        cmpRouteList.addFutFlights(userRoutesList.futFlights[i]);
      }
  }

  if(cmpRouteList.numOfCurFlights !== 0) // if there's updates to currentFlights
  {
    for(let i = 0; i<cmpRouteList.numOfCurFlights; i++ )
    {
        userRoutesList.addCurFlights(cmpRouteList.curFlights[i]);
    }
  }

  if(cmpRouteList.numOfPastFlights !== 0) // if there's updates to pastFlights
  {
    for(let i = 0; i<cmpRouteList.numOfPastFlights; i++ )
    {
        userRoutesList.addPastFlights(cmpRouteList.pastFlights[i]);
    }
  }
  userRoutesList.futFlights = cmpRouteList.futFlights;

  // compare the current flights, check if there's past flights
  cmpRouteList = new RouteList();
  for(let i = 0; i< userRoutesList.numOfCurFlights; i++ )
  {
    let destDateObject = new Date(userRoutesList.curFlights[i].arriveTime);
    if(destDateObject < now)
    {
      cmpRouteList.addPastFlights(userRoutesList.curFlights[i]);
    }
    else if(destDateObject > now)
    {
      cmpRouteList.addCurFlights(userRoutesList.curFlights[i]);
    }
  }

  if(cmpRouteList.numOfPastFlights !== 0) // if there's updates to pastFlights
  {
    for(let i = 0; i<cmpRouteList.numOfPastFlights; i++ )
    {
        userRoutesList.addPastFlights(cmpRouteList.pastFlights[i]);
    }
  }
  userRoutesList.curFlights = cmpRouteList.curFlights;

  updateLocalStorage(userRoutesList, CONFIRMED_ROUTES_KEY)
}

/*
// A bunch of TESTING DATA if anyone needs it, don't need to make again.
//>>> Plane class
let plane_1 = new Plane("VH-TAI", "ADL", 17395, 512, "777-200LR", "available" , "Qantas");
let plane_2 = new Plane("VH-MGS", "MEL", 17395, 512, "777-200LR", "available" , "Qantas");
let plane_3 = new Plane("N49265", "LAX", 5600, 474, "F900C", "available" , "American Airlines");
let plane_4 = new Plane("9M-JDE", "LGK", 17395, 512, "777-200LR", "available" , "Malaysian Airlines");
let plane_5 = new Plane("G-BUU", "LHR", 5600, 474, "F900C", "unavailable" , "British Airways");
let plane_6 = new Plane("G-XWN", "FRA", 15400, 566, "A380-800", "available" , "British Airways");

//>>> PlaneList class
let newPlaneList = new PlaneList();

//>>> Location class
//> Origin
let origin_1 = new Location("2020-08-16", "Australia", "SYD", [1.23, 3.56], "clear-day");
let origin_2 = new Location("2020-03-31", "Malaysia", "KLIA", [8.33, 4.90], "clear-day");
let origin_3 = new Location("2020-11-02", "United Kingdom", "LHr", [-2.66, 6.48], "cloudy-day");
//> Destination
let dest_1 = new Location("2020-08-16", "Malaysia", "KLIA", [8.33, 4.90], "clear-day");
let dest_2 = new Location("2020-03-31", "USA", "LAX", [84.99, 55.26], "cloudy-day");
let dest_3 = new Location("2020-11-02", "Malaysia", "PEN", [10.67, -57.33], "clear-day");

//>>> Waypoint class
let waypoint_1_1 = new Waypoint("2020-08-16", "NZ", "AKL", [-1.89, 22.54] );
let waypoint_1_2 = new Waypoint("2020-08-16", "UAE", "AUH", [2.66, 5.88] );

let waypoint_2_1 = new Waypoint("2020-03-31", "Singapore", "SIN", [24.09, 1.78] );

//>>> Route class
let route_1 = new Route(origin_1, dest_1, [waypoint_1_1, waypoint_1_2], [plane_1, plane_2], origin_1.date, 23, 45, "2:00am", "4:00pm");
let route_2 = new Route(origin_2, dest_2, [waypoint_2_1], [plane_3], origin_2.date, 78, 90, "10:00am", "11:00pm");
let route_3 = new Route(origin_3, dest_3, [], [plane_4], origin_3.date, 277, 480, "03:30pm", "11:30pm");

//>>> RouteList class
let newRouteList = new RouteList();
newRouteList.addCurFlights(route_1);
newRouteList.addCurFlights(route_2);
newRouteList.addCurFlights(route_3);
 */
