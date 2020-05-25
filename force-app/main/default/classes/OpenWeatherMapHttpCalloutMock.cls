@isTest
global class OpenWeatherMapHttpCalloutMock implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest request) {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{}');
        response.setStatusCode(200);
        return response;
    }
}
