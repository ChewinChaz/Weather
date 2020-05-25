({
    selectedNavItem: function(component, event, helper) {
        var selectedItem = event.getSource().get('v.selectedItem');
        console.log('favoriteCitiesListController.selectedNavItem: selectedItem =', selectedItem);
        if (selectedItem == 'favorites') {
            helper.firePageChanged(selectedItem);
        } else {
            helper.fireQueryParameterChanged(selectedItem);
        }
    },

    handlePageChanged: function(component, event, helper) {
        var page = event.getParam('page');
        var navigation = component.find('navigation');
        if (!navigation) return;
        if (page == 'favorites') navigation.set('v.selectedItem', 'favorites');
        if (page == 'home') navigation.set('v.selectedItem', null);
    },

    handleQueryParameterChanged: function(component, event, helper) {
        var query = event.getParam('query');
        component.find('navigation').set('v.selectedItem', query);
    }
});
