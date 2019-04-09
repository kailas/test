var LoginPage = pageRequire('login.page.js'),
    SteeringPage = pageRequire('content/steeringProviders.page.js');

describe('Content Steering Flight Provider Page', function() {
    var driver,
        login,
        page;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new SteeringPage(driver);

        login.loginAsTTAdmin().then(function() {
            page.visit().then(done);
        });
    }, 10000);

    it('Page title should be \'Content\'', function(done) {
        page.getSubTitle().then(function(title) {
            expect(title.toLowerCase()).toContain(i18n('steeringFlightProvider'));
            done();
        });
    }, 10000);

    it('Confirmation popup should be shown on change of Default Packaging status', function(done) {
        page.firstTravelPeriodDefaultPackageTick().click();

        page.findModalWindow().then(function(display) {
            expect(display).toEqual('block');

            page.clickToCancelModalWindow().then(done);
        });
    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});