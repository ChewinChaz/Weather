({
    isInFavorites: function(city, favoriteCities) {
        var cityRemoteId = city.id;
        for (var i in favoriteCities) {
            var favoriteCity = favoriteCities[i];
            if (cityRemoteId == favoriteCity.RemoteId__c) return true;
        }
        return false;
    },

    addToFavorites: function(component, cityRemoteId, cityName) {
        var action = component.get('c.addToFavorites');
        action.setParams({ 
            'cityRemoteId': cityRemoteId,
            'cityName': cityName
        });
        this.fireFavoritesAction(component, action);
    },

    removeFromFavorites: function(component, cityRemoteId) {
        var action = component.get('c.removeFromFavorites');
        action.setParams({ 'cityRemoteId': cityRemoteId });
        this.fireFavoritesAction(component, action);
    },

    fireFavoritesAction: function(component, action) {
        this.fireRemoteCall(action, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var updated = response.getReturnValue();
                console.log('[REMOTE] WeatherController(add or remove favorites): updated =', updated);
                if (!updated) return; // here we may show message
                this.fireFavoritesUpdated();
                component.set('v.inFavorites', !component.get('v.inFavorites'));
            }
        });
    },
    
    fireRemoteCall: function(action, callback) {
        action.setCallback(this, callback);
        $A.enqueueAction(action);
    },

    fireFavoritesUpdated: function() {
        var event = $A.get('e.c:favoritesUpdated');
        event.fire();
    },

    fireQueryParameterChanged: function(query) {
        var event = $A.get('e.c:queryParameterChanged');
        event.setParam('query', query);
        event.fire();
    }
});
