@isTest
public class WeatherControllerTest {
    @testSetup
    static void setup() {
        List<FavoriteCity__c> favoriteCities = new List<FavoriteCity__c>();
        favoriteCities.add(new FavoriteCity__c(Name = 'London, GB', RemoteId__c = '2643743'));
        favoriteCities.add(new FavoriteCity__c(Name = 'Berlin, DE', RemoteId__c = '2950159'));
        favoriteCities.add(new FavoriteCity__c(Name = 'Ottawa, CA', RemoteId__c = '6094817'));
        insert favoriteCities;
    }

    @isTest 
    static void testCallouts() {
        Test.startTest();

        Test.setMock(HttpCalloutMock.class, new OpenWeatherMapHttpCalloutMock());
        System.assertEquals('{}', WeatherController.getWorldWeatherJson());
        System.assertEquals('{}', WeatherController.getFavoriteCitiesWeatherJson());
        System.assertEquals('{"weather":{},"forecast":{}}', WeatherController.getCityDetailsJson('Moscow, RU'));
        System.assertEquals('{}', WeatherController.getNearestCitiesJson((Double)37.62, (Double)55.75));

        Test.stopTest();
    }

    @isTest
    static void testGetFavorites() {
        List<FavoriteCity__c> favoriteCities;

        favoriteCities = WeatherController.getFavoriteCitiesList();
        System.assertEquals(3, favoriteCities.size());

        insert new FavoriteCity__c(Name = 'Moscow, RU', RemoteId__c = '524901');

        favoriteCities = WeatherController.getFavoriteCitiesList();
        System.assertEquals(4, favoriteCities.size());
    }

    @isTest
    static void testAddToFavoritesNewCity() {
        Boolean added = WeatherController.addToFavorites('524901', 'Moscow, RU');
        System.assert(added);
        System.assertEquals(4, countFavorites());
    }

    @isTest
    static void testAddToFavoritesAlreadyAddedCity() {
        Boolean added = WeatherController.addToFavorites('2643743', 'London, GB');
        System.assert(!added);
        System.assertEquals(3, countFavorites());
    }

    @isTest
    static void testRemoveFromFavoritesCityInList() {
        Boolean removed = WeatherController.removeFromFavorites('2643743'); // London, GB
        System.assert(removed);
        System.assertEquals(2, countFavorites());
    }

    @isTest
    static void testRemoveFromFavoritesCityNotInList() {
        Boolean removed = WeatherController.removeFromFavorites('524901'); // Moscow, RU
        System.assert(!removed);
        System.assertEquals(3, countFavorites());
    }

    static Integer countFavorites() {
        String userId = System.UserInfo.getUserId();
        List<FavoriteCity__c> favoriteCities = [SELECT Id FROM FavoriteCity__c WHERE OwnerId = :userId];
        return favoriteCities.size();
    }
}
