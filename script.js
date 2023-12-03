const fetch_data = document.querySelector("#btn");

const mapView = document.querySelector(".map");
const details_data = document.querySelector(".data");
const geolocation_data = document.querySelector(".geolocation_data");
const api = "f6e8538ddaeead3d4edf76c74c02e24b";

async function getData(lat, long) {
  const promise = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=current&appid=${api}`
  );
  return await promise.json();
}

async function findLocation(position) {
  const result = await getData(
    position.coords.latitude,
    position.coords.longitude
  );
//   console.log(result);
  weather_data(result);
}

function failedLocation() {
  alert("Please give access to the location");
}

fetch_data.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(findLocation, failedLocation);
});

function removeDom() {
  document.querySelector(".heading").remove();
}

function  toTextualDescription(degree){
    if ((degree>337.5 && degree<360)|| (degree>22.5 && degree<22.5))
    {return 'Northerly';}
    else if(degree>22.5 && degree<67.5){return 'North East';}
    else if(degree>67.5 && degree<112.5){return 'East';}
    else if(degree>122.5 && degree<157.5){return 'South East';} 
    else if(degree>157.5 && degree<202.5){return 'South';}
    else if(degree>202.5 && degree<247.5){return 'South West';}
    else if(degree>247.5 && degree<292.5){return 'West';}
    else if(degree>292.5 && degree<337.5){return 'North West';}
}



function weather_data(result) {
  removeDom();
const seconds = `${result.timezone}`;
const hours = Math. floor(seconds / 3600); 
const  minutes = Math. floor((seconds - (hours * 3600)) / 60);
//  converting the pressure from bar to atm.
const  pressureInAtm = Math.floor((`${result.main.pressure}`/1.01325));
// console.log(pressureInAtm);

//converting the degree into the direction.
const directionOfWind = toTextualDescription(`${result.wind.deg}`)

  const url = `https://maps.google.com/maps/?q=${result.coord.lat},${result.coord.lon}&output=embed`;
  geolocation_data.innerHTML = `
  <div class="top_div">
          <h1>Welcome To The Weather App</h1>
          <p>Here is your current location</p>
          <div class="lat_lon">
            <p>Lat:<span class="lat">${result.coord.lat}</span></p>
            <p>Long:<span class="long"> ${result.coord.lon}</span></p>
          </div>
          <div class="map" id="map">
          <iframe
          src=${url}
          width="360"
          height="270"
          frameborder="0"
          style="border:0;width: 90vw;
          height: 65vh;margin-top_div:3rem; border-radius:1rem"></iframe>
          </div>
        </div>
  <div class="bottom_div">
          <div>
            <h2>Your Weather Data</h2>
          </div>
          <div class="data">
          <p>Location: ${result.name}</p>
            <p>Wind Speed: ${result.wind.speed} kmph</span></p>
            <p>Humidity: ${result.main.humidity}</p>
            <p>Time Zone: GMT +${hours} : ${minutes}</p>
            <p>Pressure: ${pressureInAtm} atm</p>
            <p>Wind Direction: ${directionOfWind}</p>
            <p>Feels like: ${result.main.feels_like}\u00B0</p>
          </div>
        </div>
    `;
}