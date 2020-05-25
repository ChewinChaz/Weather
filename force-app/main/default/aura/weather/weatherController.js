({
    init: function(component, event, helper) {
        console.log('weatherController.init');

        helper.retrieveFavoriteCities(component);

        var query = component.get('v.query');
        if (query != null) component.set('v.page', 'weather');

        var page = component.get('v.page');
        if (page != 'favorites' && page != 'weather' || page == 'weather' && query == null) {
            page = 'home';
            component.set('v.page', page);
        }

        helper.render(component, page);
    },

    handlePageChanged: function(component, event, helper) {
        component.set('v.initialized', false);
        component.set('v.weather', null);
        var page = event.getParam('page');
        component.set('v.page', page);
        helper.render(component, page);
    },

    handleQueryParameterChanged: function(component, event, helper) {
        var query = event.getParam('query');
        component.set('v.query', query);
        component.set('v.page', 'weather');
        helper.render(component, 'weather');
    },

    handleFavoritesUpdated: function(component, event, helper) {
        console.log('weatherController.handleFavoritesUpdated');
        helper.retrieveFavoriteCities(component);
        var page = component.get('v.page');
        helper.render(component, page);
    }
});
