({
    doInit : function(component, event, helper) {      
		if (navigator.geolocation) {
  	    	navigator.geolocation.getCurrentPosition(success);
            	function success(position) {
                 	component.set('v.coords', position.coords);
				}
		} else {
  			error('Geo Location is not supported');
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
    },
	handleCoordsChange : function(component, event, helper) {
        component.set('v.loaded', true);
        component.get('v.map').flyTo([event.getParam('value').latitude, event.getParam('value').longitude], 17);
    }
})