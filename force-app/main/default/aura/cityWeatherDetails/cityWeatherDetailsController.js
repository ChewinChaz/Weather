({
    init: function(component, event, helper) {
        console.log('cityWeatherDetailsController.init');

        var query = component.get('v.query');
        helper.retrieveCityDetails(component, query);
    }, 

    clickNearestCity: function(component, event, helper) {
        var cityName = event.getSource().get('v.name');
        helper.fireQueryParameterChanged(cityName);
    }
});
