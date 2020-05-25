public with sharing class WeatherController {
	private static String[] worldCities = new String[] {
		'2643743', // London
		'2950159', // Berlin
		'3169070', // Rome, IT
		'6094817', // Ottawa
		'524901',  // Moscow
		'5815135', // Washington
		'2988507', // Paris
		'1850144'  // Tokyo
	};

	@AuraEnabled
	public static String getWorldWeatherJson() {
		String groupParams = String.join(worldCities, ',');
		String responseUri = getUri(apiGroup, groupParams);
		return requestRemoteJson(responseUri);
	}

	@AuraEnabled
	public static String getFavoriteCitiesWeatherJson() {
		List<FavoriteCity__c> favoriteCities = WeatherController.getFavoriteCitiesList();
		List<String> favorites = new List<String>();
		for (FavoriteCity__c city: favoriteCities) {
			favorites.add(city.RemoteId__c);
		}
		String groupParams = String.join(favorites, ',');
		String responseUri = getUri(apiGroup, groupParams);
		return requestRemoteJson(responseUri);
	}

	@AuraEnabled
	public static List<FavoriteCity__c> getFavoriteCitiesList() {
		return getUserFavorites();
	}

	@AuraEnabled
	public static String getCityDetailsJson(String query) {
		String weatherJson = requestRemoteJson(getUri(apiWeather, query));
		String forecastJson = requestRemoteJson(getUri(apiForecast, query));
		return concatForecastWeatherJson(weatherJson, forecastJson);
	}

	@AuraEnabled
	public static Boolean addToFavorites(String cityRemoteId, String cityName) {
		List<FavoriteCity__c> favorites = getUserFavoritesByRemoteId(cityRemoteId);

		// already added
		if (favorites.size() > 0) return false;

		// add
		upsert new FavoriteCity__c(Name = cityName, RemoteId__c = cityRemoteId);
		return true;
	}

	@AuraEnabled
	public static Boolean removeFromFavorites(String cityRemoteId) {
		List<FavoriteCity__c> favorites = getUserFavoritesByRemoteId(cityRemoteId);

		// already removed
		if (favorites.size() == 0) return false;

		// remove
		delete favorites;
		return true;
	}

	@AuraEnabled
	public static String getNearestCitiesJson(Double longtitude, Double latitude) {
		String params = (longtitude - 1) + ',' + (latitude - 1) + ',' +
			(longtitude + 1) + ',' + (latitude + 1) + ',20';
		String responseUri = getUri(apiBoxCity, params);
		return requestRemoteJson(responseUri);
	}

	private static String apiPrefix = 'https://api.openweathermap.org/data/2.5/';
	private static String apiKey = '482b7c2f7cac99c9ec779922a2a2b7fe';
	private static String apiLang = 'en';
	private static String apiCommonPart = '&units=metric&lang=' + apiLang + '&appid=' + apiKey;

	private static String apiWeather = 'weather?q=';
	private static String apiForecast = 'forecast?q=';
	private static String apiGroup = 'group?id=';
	private static String apiBoxCity = 'box/city?bbox=';
	
	private static String getUri(String type, String params) {
		return apiPrefix + type + params + apiCommonPart;
	}

	private static String requestRemoteJson(String endpoint) {
		Http http = new Http();
		HttpRequest request = new HttpRequest();
		request.setEndpoint(endpoint);
		request.setMethod('GET');
		HttpResponse response = http.send(request);

		return response.getBody();
	}

	private static String concatForecastWeatherJson(String weatherJson, String forecastJson) {
		return '{"weather":' + weatherJson + ',"forecast":'+ forecastJson + '}';
	}

	private static List<FavoriteCity__c> getUserFavorites() {
		String userId = System.UserInfo.getUserId();
		return [
			SELECT Id, Name, RemoteId__c
			FROM FavoriteCity__c
			WHERE OwnerId = :userId
			ORDER BY CreatedDate
			LIMIT 10
		];
	}

	private static List<FavoriteCity__c> getUserFavoritesByRemoteId(String cityRemoteId) {
		String userId = System.UserInfo.getUserId();
		return [
			SELECT Id
			FROM FavoriteCity__c
			WHERE OwnerId = :userId AND RemoteId__c = :cityRemoteId
			ORDER BY CreatedDate
		];
	}
}
