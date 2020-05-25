function getDateTime(timestamp, offset, timeonly) {
    if (timeonly === undefined) timeonly = false;
    offset = offset || 0;
    timestamp = timestamp || Date.now();
   
    var date = new Date(timestamp + offset);
    var H = (date.getUTCHours()).toString().padStart(2, '0');
    var i = (date.getUTCMinutes()).toString().padStart(2, '0');
    if (timeonly) return `${H}:${i}`;
    
    var Y = date.getUTCFullYear();
    var m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    var d = (date.getUTCDate()).toString().padStart(2, '0');
    return `${d}/${m}/${Y} ${H}:${i}`;
}

var cities = await fetch('https://api.openweathermap.org/data/2.5/group?id=2643743,2950159,4219762,6094817,524901,5815135,2988507,1850144&units=metric&lang=en&appid=482b7c2f7cac99c9ec779922a2a2b7fe').then(x => x.json());

cities.list.forEach(city => {
    console.groupCollapsed(`${city.name}, ${city.sys.country}`);
    console.log(`On map by coords: https://www.google.ru/maps/@${city.coord.lat},${city.coord.lon},11z`);
    console.log(`On map by city name: https://www.google.ru/maps/search/${city.name}`);
    console.log(`Temperature: ${city.main.temp} °C (from ${city.main.temp_min} °C to ${city.main.temp_max} °C), feels like: ${city.main.feels_like} °C`);
    var mmHgPressure = Math.round(city.main.pressure * 0.75006157584566);
    console.log(`Humidity: ${city.main.humidity}%, pressure: ${city.main.pressure}hpa (${mmHgPressure} mm Hg), wind: ${city.wind.speed} m/s, clouds: ${city.clouds.all}%`);
    var dateTime = getDateTime(null, city.sys.timezone * 1000);
    var measurementTime = getDateTime(city.dt * 1000, city.sys.timezone * 1000, true);
    var sunriseTime = getDateTime(city.sys.sunrise * 1000, city.sys.timezone * 1000, true);
    var sunsetTime = getDateTime(city.sys.sunset * 1000, city.sys.timezone * 1000, true);
    console.log(`Now: ${dateTime} (last measurement: ${measurementTime}), sunrise: ${sunriseTime}, sunset: ${sunsetTime}`);
    console.groupEnd(`${city.name}, ${city.sys.country}`);
});
