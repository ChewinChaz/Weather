({
    retrieveCityDetails: function(component, query) {
        console.log('cityWeatherDetailsHelper.retrieveCityDetails: query =', query);

        this.resetAttributes(component);

        var action = component.get('c.getCityDetailsJson');
        action.setParam('query', query);
        this.fireRemoteCall(action, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var cityDetails = JSON.parse(response.getReturnValue());
                console.log('[REMOTE] WeatherController.getCityDetailsJson: query =', query, 'cityDetails =', cityDetails);
                
                if (cityDetails.weather.cod == 404) {
                    component.set('v.cityNotFound', true);
                } else if (cityDetails.weather.cod == 200) {
                    var city = cityDetails.forecast.city;
                    component.set('v.city', city);
                    component.set('v.forecast', cityDetails.forecast.list);
                    component.set('v.weather', cityDetails.weather);

                    this.retrieveNearestCities(component, city.coord.lon, city.coord.lat);
                }
            } else {
                console.log('[REMOTE] WeatherController.getCityDetailsJson: state =', state);
            }

            component.set('v.initialized', true);
        });
    },

    retrieveNearestCities: function(component, longtitude, latitude) {
        var action = component.get('c.getNearestCitiesJson');
        action.setParam('longtitude', longtitude);
        action.setParam('latitude', latitude);
        this.fireRemoteCall(action, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var result = JSON.parse(response.getReturnValue());
                if (result.cod == 200) {
                    var nearestCities = result.list;
                    console.log('[REMOTE] WeatherController.getNearestCitiesJson: nearestCities =', nearestCities);
                    component.set('v.nearestCities', nearestCities);
                }
            } else {
                console.log('[REMOTE] WeatherController.getNearestCitiesJson: state =', state);
            }
        });
    },

    fireRemoteCall: function(action, callback) {
        action.setCallback(this, callback);
        $A.enqueueAction(action);
    },
    
    resetAttributes: function(component) {
        component.set('v.initialized', false);
        component.set('v.cityNotFound', false);
        component.set('v.city', null);
        component.set('v.forecast', null);
        component.set('v.weather', null);
    },

    fireQueryParameterChanged: function(query) {
        var event = $A.get('e.c:queryParameterChanged');
        event.setParams({ 'query': query });
        event.fire();
    }
});
