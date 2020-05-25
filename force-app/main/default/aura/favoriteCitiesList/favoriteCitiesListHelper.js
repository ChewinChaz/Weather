({
    firePageChanged: function(page) {
        var event = $A.get('e.c:pageChanged');
        this.fireEvent(event, { 'page': page });
    },

    fireQueryParameterChanged: function(query) {
        var event = $A.get('e.c:queryParameterChanged');
        this.fireEvent(event, { 'query': query });
    },

    fireEvent: function(event, params) {
        event.setParams(params);
        event.fire();
    }
});
