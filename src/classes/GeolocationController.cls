public with sharing class GeolocationController {
	
    @AuraEnabled
    public static String getRelatedLocation(Id recordId) {
        Event e = [SELECT WhatId FROM Event WHERE Id =: recordId];
        if (e.WhatId != null && ((String) e.WhatId).startsWith(Account.sObjectType.getDescribe().getKeyPrefix())) {
         	Account a = [SELECT BillingLatitude, BillingLongitude FROM Account WHERE Id =: e.WhatId];  
            if (a.BillingLatitude != null && a.BillingLongitude != null) {
                return JSON.serialize(new LocationWrapper(a.BillingLongitude, a.BillingLatitude));
            } 
        }
        return null;
    }

    @AuraEnabled
    public static void saveEventLocation(Id recordId, String location) {
        system.debug(location);
        LocationWrapper userLocation = (LocationWrapper) JSON.deserialize(location, LocationWrapper.class);
        Event e = new Event(Id = recordId, Location__Latitude__s = userLocation.lat, Location__Longitude__s = userLocation.lon);
        update e;
    }
    
    public class LocationWrapper {
        @AuraEnabled
        public Decimal lon {get;set;}
        @AuraEnabled
        public Decimal lat {get;set;}
        
        public LocationWrapper(Decimal lon, Decimal lat) {
            this.lon = lon;
            this.lat = lat;
        }
    }
}