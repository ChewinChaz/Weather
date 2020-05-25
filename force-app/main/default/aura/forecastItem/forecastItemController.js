({
    init: function(component, event, helper) {
        var city = component.get('v.city');
        var item = component.get('v.item');

        var temperature = item.main.temp > 0 ? '+' + Math.round(item.main.temp) : Math.round(item.main.temp);
        component.set('v.temperature', temperature);

        var now = $Weather.getDateTime(item.dt, city.timezone);
        component.set('v.now', now);

        var dayPart = $Weather.getDayPart(city.sunrise, city.sunset, city.timezone, item.dt);
        component.set('v.cardDecoration', 'city-card-' + dayPart + '-' + item.weather[0].main.toLowerCase());
        component.set('v.cardIcon', '/icons/' + dayPart + '-' + item.weather[0].main.toLowerCase() + '.png');
    }
});
