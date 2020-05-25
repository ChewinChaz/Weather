({
    retrieveWorldWeather: function(component) {
        this.retrieveWeather(component, 'c.getWorldWeatherJson');
    },

    retrieveFavoriteCitiesWeather: function(component) {
        this.retrieveWeather(component, 'c.getFavoriteCitiesWeatherJson');
    },

    retrieveWeather: function(component, actionName) {
        var action = component.get(actionName);
        this.fireRemoteCall(action, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var weather = JSON.parse(response.getReturnValue());
                console.log('[REMOTE] WeatherController.'+actionName.substr(2)+': weather =', weather);
                if (weather.cod != 401) component.set('v.weather', weather);
            } else {
                console.log('[REMOTE] WeatherController.'+actionName.substr(2)+': state =', state);
            }
 
            component.set('v.initialized', true);
        });
    },

    retrieveFavoriteCities: function(component) {
        console.log('weatherHelper.retrieveFavoriteCities');
        var action = component.get('c.getFavoriteCitiesList');
        this.fireRemoteCall(action, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var favoriteCities = response.getReturnValue();
                console.log('[REMOTE] WeatherController.getFavoriteCitiesList: favoriteCities =', favoriteCities);
                component.set('v.favoriteCities', favoriteCities);
                component.set('v.weather', component.get('v.weather')); // update to rerender
            } else {
                console.log('[REMOTE] WeatherController.getFavoriteCitiesList: state =', state);
            }
        });
    },

    fireRemoteCall: function(action, callback) {
        action.setCallback(this, callback);
        $A.enqueueAction(action);
    },

    render: function(component, page) {
        console.log('weatherHelper.render: page =', page);
        if (page == 'home') this.retrieveWorldWeather(component);
        if (page == 'favorites') this.retrieveFavoriteCitiesWeather(component);

        // Rerender
        clearTimeout(window.rerenderInterval);
        if (page == 'home' || page == 'favorites') {
            component.set('v.query', '');
            var self = this;
            // [i] Solution found here: https://salesforce.stackexchange.com/questions/183833/a-getcallback-function-in-settimeout-runs-3-times-in-a-row
            window.rerenderInterval = setTimeout($A.getCallback(function() {
                self.render(component, page);
            }), 60000);
        }
    }
});
