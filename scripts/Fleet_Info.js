let planesUrl = "https://eng1003.monash/api/v1/planes/"
let planesData = {
  callback: "planesCallback"
}

function planesCallback(planes)
{
  displayAllPlanes(planes);
}

function displayAllPlanes(allPlanes)
{
  let arrayLength = 0;
  if(typeof(allPlanes.airplanes) == "undefined")
  {
    arrayLength = allPlanes.planeListLength;
  }
  else
  {
      arrayLength = allPlanes.airplanes.length;
  }

  let listOfPlanesRef = document.getElementById("listOfPlanes");
  listOfPlanesRef.innerHTML = "";
  output = `  <table>
                <tr>
                  <th>NO.</th>
                  <th>AIRLINE</th>
                  <th>ID</th>
                  <th>TYPE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>RANGE</th>
                  <th>AVG. SPEED</th>
                </tr>`;

  for(let i = 0; i< arrayLength; i++)
  {
    if(typeof(allPlanes.airplanes) !== "undefined")
    {
      let newPlane = new Plane(allPlanes.airplanes[i].registration, allPlanes.airplanes[i].location, allPlanes.airplanes[i].range, allPlanes.airplanes[i].avgSpeed, allPlanes.airplanes[i].type, allPlanes.airplanes[i].status, allPlanes.airplanes[i].airline );
      allPlanesList.addPlane(newPlane);
    }
    output += `<tr>
                <td>${i+1}</td>
                <td>${allPlanesList.planeList[i].airline}</td>
                <td>${allPlanesList.planeList[i].id}</td>
                <td>${allPlanesList.planeList[i].type}</td>
                <td>${allPlanesList.planeList[i].location}</td>
                <td>${allPlanesList.planeList[i].status}</td>
                <td>${allPlanesList.planeList[i].range} km</td>
                <td>${allPlanesList.planeList[i].avgSpeed} knots</td>
              </tr>`;
  }
  
  output += `</table>`;
  listOfPlanesRef.innerHTML += output;
}

// sorts ID of plane in ascending order
function sortByPlaneId()
{
  if(allPlanesList instanceof PlaneList ) // error-checking. To ensure the input is an instance of planeList
  {
    for(let i = 0; i < allPlanesList.planeListLength - 1; i++ )
    {
      let minIndex = i; // assume that the current index is the smallest value amngst the unsorted range
      for(let j = i+1; j< allPlanesList.planeListLength; j++)
      {
        if(allPlanesList.planeList[j].id < allPlanesList.planeList[minIndex].id)
        {
          // if true, it means that the new smalled value amongst the unsorted values is j
          // update minIndex to j
          minIndex = j;
        }
      }
      // Exited the j for loop. Now check if minIndex is still == i. If yes, no swap
      // else, do a swap, to change the values in position i and position minIndex
      if(minIndex !== i)
      {
        let temp = allPlanesList.planeList[i];
        allPlanesList.planeList[i] = allPlanesList.planeList[minIndex];
        allPlanesList.planeList[minIndex] = temp;
      }
    }
  }
  else
  {
      return "ERROR: Function sortByPlaneID input must be an instance of PlaneList.";
  }
  displayAllPlanes(allPlanesList);
}

// sorts name of airline in ascending order
function sortByAirline()
{
  if(allPlanesList instanceof PlaneList ) // error-checking. To ensure the input is an instance of planeList
  {
    for(let i = 0; i < allPlanesList.planeListLength - 1; i++ )
    {
      let minIndex = i; // assume that the current index is the smallest value amngst the unsorted range
      for(let j = i+1; j< allPlanesList.planeListLength; j++)
      {
        if(allPlanesList.planeList[j].airline < allPlanesList.planeList[minIndex].airline)
        {
          // if true, it means that the new smallest value amongst the unsorted values is j
          // update minIndex to j
          minIndex = j;
        }
      }
      // Exited the j for loop. Now check if minIndex is still == i. If yes, no swap.
      // else, do a swap, to change the values in position i and position minIndex
      if(minIndex !== i)
      {
        let temp = allPlanesList.planeList[i];
        allPlanesList.planeList[i] = allPlanesList.planeList[minIndex];
        allPlanesList.planeList[minIndex] = temp;
      }
    }
  }
  else
  {
      return "ERROR: Function sortByAirline input must be an instance of Planelist.";
  }
  displayAllPlanes(allPlanesList);
}

// arrange by the AIrportcode in ascending order
function sortByLocation()
{
  if(allPlanesList instanceof PlaneList ) // error-checking. To ensure the input is an instance of planeList
  {
    for(let i = 0; i < allPlanesList.planeListLength - 1; i++ )
    {
      let minIndex = i; // assume that the current index is the smallest value amngst the unsorted range
      for(let j = i+1; j< allPlanesList.planeListLength; j++)
      {
        if(allPlanesList.planeList[j].location < allPlanesList.planeList[minIndex].location)
        {
          // if true, it means that the new smalled value amongst the unsorted values is j
          // update minIndex to j
          minIndex = j;
        }
      }
      // Exited the j for loop. Now check if minIndex is still == i. If yes, no swap
      // else, do a swap, to change the values in position i and position minIndex
      if(minIndex !== i)
      {
        let temp = allPlanesList.planeList[i];
        allPlanesList.planeList[i] = allPlanesList.planeList[minIndex];
        allPlanesList.planeList[minIndex] = temp;
      }
    }
  }
  else
  {
      return "ERROR: Function sortByLocation input must be an instance of PlaneList.";
  }
  displayAllPlanes(allPlanesList);
}

// sorts plane Type in ascending order
function sortByPlaneType()
{
  if(allPlanesList instanceof PlaneList ) // error-checking. To ensure the input is an instance of planeList
  {
    for(let i = 0; i < allPlanesList.planeListLength - 1; i++ )
    {
      let minIndex = i; // assume that the current index is the smallest value amngst the unsorted range
      for(let j = i+1; j< allPlanesList.planeListLength; j++)
      {
        if(allPlanesList.planeList[j].type < allPlanesList.planeList[minIndex].type)
        {
          // if true, it means that the new smalled value amongst the unsorted values is j
          // update minIndex to j
          minIndex = j;
        }
      }
      // Exited the j for loop. Now check if minIndex is still == i. If yes, no swap
      // else, do a swap, to change the values in position i and position minIndex
      if(minIndex !== i)
      {
        let temp = allPlanesList.planeList[i];
        allPlanesList.planeList[i] = allPlanesList.planeList[minIndex];
        allPlanesList.planeList[minIndex] = temp;
      }
    }
  }
  else
  {
      return "ERROR: Function sortByPlaneID input must be an instance of PlaneList.";
  }
  displayAllPlanes(allPlanesList);
}

function sort()
{
  let sortMenuRef = document.getElementById("sortMenu");
  if(sortMenuRef.value == 1)
  {
    sortByAirline();
  }
  else if(sortMenuRef.value == 2)
  {
      sortByPlaneId();
  }
  else if(sortMenuRef.value == 3)
  {
    sortByLocation();
  }
  else if(sortMenuRef.value == 4)
  {
    sortByPlaneType()
  }
}

// codes to run on page load
let allPlanesList = new PlaneList();
webServiceRequest(planesUrl, planesData);
