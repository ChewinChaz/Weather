({
    init: function(component, event, helper) {
        console.log('cityWeatherCardController.init');
        var city = component.get('v.city');

        var cityFullname = city.name + ', ' + city.sys.country;
        component.set('v.cityFullname', cityFullname);

        var timezone = city.sys.timezone || city.timezone || 0;

        var now = $Weather.getDateTime(null, timezone);
        var lastMeasurement = $Weather.getDateTime(city.dt, timezone);
        var sunriseTime = $Weather.getDateTime(city.sys.sunrise, timezone, true);
        var sunsetTime = $Weather.getDateTime(city.sys.sunset, timezone, true);
        component.set('v.now', now);
        component.set('v.lastMeasurement', lastMeasurement);
        component.set('v.sunriseTime', sunriseTime);
        component.set('v.sunsetTime', sunsetTime);

        var nowTime = $Weather.getDateTime(null, timezone, true);
        component.set('v.nowTime', nowTime);

        var dayPart = $Weather.getDayPart(city.sys.sunrise, city.sys.sunset, timezone);
        var decoration = dayPart + '-' + city.weather[0].main.toLowerCase();
        component.set('v.cardDecoration', 'city-card-' + decoration);
        component.set('v.weatherIcon', '/icons/' + decoration + '.png');

        var temperature = (city.main.temp > 0) ? '+'+Math.round(city.main.temp) : Math.round(city.main.temp);
        component.set('v.temperature', temperature);
        var feelsLike = (city.main.feels_like > 0) ? '+'+Math.round(city.main.feels_like) : Math.round(city.main.feels_like);
        component.set('v.feelsLike', feelsLike);

        component.set('v.windDirection', $Weather.windDirection(city.wind.deg));

		var favoriteCities = component.get('v.favoriteCities');
        if (helper.isInFavorites(city, favoriteCities)) {
            component.set('v.inFavorites', true);
		}
    },

    clickFavoriteButton: function(component, event, helper) {
        var inFavorites = component.get('v.inFavorites');
        var city = component.get('v.city');
        if (inFavorites) {
            helper.removeFromFavorites(component, city.id);
        } else {
            var cityFullname = component.get('v.cityFullname');
            helper.addToFavorites(component, city.id, cityFullname);
        }
    },

    clickCityTitle: function(component, event, helper) {
        var cityFullname = component.get('v.cityFullname');
        helper.fireQueryParameterChanged(cityFullname);
    }
});
