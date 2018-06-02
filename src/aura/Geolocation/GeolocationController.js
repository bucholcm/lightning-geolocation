({
    doInit : function(component, event, helper) {      
		if (navigator.geolocation) {
  	    	navigator.geolocation.getCurrentPosition(success);
            	function success(position) {
                 	component.set('v.location', position.coords);
				}
		} else {
            let resultsToast = $A.get('e.force:showToast');
            resultsToast.setParams({
                title: 'Error',
                message: 'Geo Location is not supported by your device'
            });
            resultsToast.fire();
        }
    },
    jsLoaded: function(component, event, helper) {
        let map = L.map(component.find('map').getElement(), {zoomControl: true, tap: false}).setView([52, 21], 10);
        L.tileLayer(
       'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
       {
              attribution: 'Tiles © maciek.in'
       }).addTo(map);
        component.set('v.map', map);
        component.set('v.jsLoaded', true);
        helper.getAccountLocation(component);
    },
	handleCoordsChange : function(component, event, helper) {
        if (component.get('v.jsLoaded')) {
            const locateIcon = L.AwesomeMarkers.icon({icon: 'street-view', markerColor: 'blue', prefix: 'fa'});
            helper.setMarkersGroup(component, event.getParam('value').latitude, event.getParam('value').longitude, locateIcon);
        }
    },
    handleSave : function(component, event, helper) {
        helper.saveEventLocation(component);
    },
    handleCancel : function(component, event, helper) {
        let dismissActionPanel = $A.get('e.force:closeQuickAction');
        dismissActionPanel.fire();
    }
})