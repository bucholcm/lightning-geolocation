({
    getAccountLocation : function(component) {
        let action = component.get('c.getRelatedLocation');
        if (action && component.get('v.recordId')) {
            action.setParams({'recordId': component.get('v.recordId')});
            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === 'SUCCESS') {
                    const accountLoc = JSON.parse(response.getReturnValue());
                    console.log(response.getReturnValue());
                    component.set('v.accountLocation', accountLoc);
                    const locateIcon = L.AwesomeMarkers.icon({icon: 'building', markerColor: 'orange', prefix: 'fa'});
                    this.setMarkersGroup(component, accountLoc.lat, accountLoc.lon, locateIcon);
                    
                } else {
                    let resultsToast = $A.get('e.force:showToast');
                    resultsToast.setParams({
                        title: 'Error',
                        message: 'There was an error: ' + JSON.stringify(response.error)
                    });
                    resultsToast.fire();
                }
            });
            $A.enqueueAction(action);
        }
    },
    saveEventLocation : function(component) {
        let action = component.get('c.saveEventLocation');
        if (action && component.get('v.recordId')) {
            console.log({recordId: component.get('v.recordId'), location: JSON.stringify({lat: component.get('v.location').latitude, lon: component.get('v.location').longitude})});
            action.setParams({recordId: component.get('v.recordId'), location: JSON.stringify({lat: component.get('v.location').latitude, lon: component.get('v.location').longitude})});
            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === 'SUCCESS') {
                    let dismissActionPanel = $A.get('e.force:closeQuickAction');
                    dismissActionPanel.fire();
                    $A.get('e.force:refreshView').fire();
                } else {
                    let resultsToast = $A.get('e.force:showToast');
                    resultsToast.setParams({
                        title: 'Error',
                        message: 'There was an error: ' + JSON.stringify(response.error)
                    });
                    resultsToast.fire();
                }
            });
            $A.enqueueAction(action);
        }
    },
    setMarkersGroup : function(component, lat, lon, icon) {
        component.get('v.markers').push({lat: lat, lon: lon});
        if (!component.get('v.markersGroup')) {
            let featureGroup = L.featureGroup([L.marker([lat, lon], {icon: icon})]);
            featureGroup.addTo(component.get('v.map'));
            component.set('v.markersGroup', featureGroup);   
        } else {
            component.get('v.markersGroup').addLayer(L.marker([lat, lon], {icon: icon}));
            component.get('v.map').fitBounds(component.get('v.markersGroup').getBounds(), {padding: [3, 3]});
            component.set('v.loaded', true);
            let markers = component.get('v.markers');
            let distance = component.get('v.map').distance(L.latLng(markers[0].lat, markers[0].lon), L.latLng(markers[1].lat, markers[1].lon));
            component.set('v.distance', distance/1000);
        }
    }
})