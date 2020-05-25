({
    init: function(component, event, helper) {
        component.set('v.currentQuery', component.get('v.query'));
    },
    
    clickLogo: function(component, event, helper) {
        console.log('headerController.clickLogo');
        helper.firePageChanged('home');
    },

    submitSearch: function(component, event, helper) {
        event.preventDefault();
        var query = component.get('v.currentQuery');
        if (!query) return;
        helper.fireQueryParameterChanged(query);
    }
});
