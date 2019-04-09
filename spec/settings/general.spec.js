var LoginPage = pageRequire('login.page.js'),
    SteeringPage = pageRequire('settings/general.page.js'),
    Request = libRequire('request'),
    Modal = elementRequire('modal');

describe('Settings Page', function() {
    var driver,
        login,
        page,
        modal,
        request;

    optionsFilters = {
        uri: 'providers/index/type/flights',
        data: {
            providerCode: 'A'
        }
    };

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new SteeringPage(driver);
        request = new Request(driver);
        modal = new Modal(driver);

        login.loginAsTTAdmin().then(function() {
            page.visit().then(done);
        });
    }, 10000);

    it('Page title should be \'General provider settings\'', function(done) {
        page.getSubTitle().then(function(title) {
            expect(title.toLowerCase()).toContain(i18n('generalProviderSettings'));
            done();
        });
    }, 10000);

    it('Should be able to change the select for release days to a new value, then reset to old value', function(done) {
        var oldVal;
        page.getFirstFlightProviderReleaseSelect().then(function(value) {
            oldVal = parseInt(value) + 1;

            page.setFirstFlightProviderReleaseSelect(6);
            page.getFirstFlightProviderReleaseSelect().then(function(value) {
                expect(value).toBe('5');
                setTimeout( function() {
                    process.nextTick(function() {
                        page.setFirstFlightProviderReleaseSelect(oldVal).then( function() {
                            setTimeout( function() {
                                page.getFirstFlightProviderReleaseSelect().then(function(value) {
                                    var val = (oldVal - 1).toString();
                                    expect(value).toBe(val);
                                    done();
                                });
                            }, 500)
                        });
                    });
                }, 500)
            });
        });
    }, 10000);

    it('Confirmation popup should be shown on change of activation status', function(done) {
        setTimeout( function() {
            process.nextTick(function() {
                page.firstFlightProviderActiveTick().click();
                modal.isOpen().then(function(open) {
                    expect(open).toBe(true);

                    modal.cancel().then(function() {
                        modal.isClosed().then(function(closed) {
                            expect(closed).toBe(true);

                            done();
                        });
                    })
                });
            });
        }, 200)

    }, 10000);

    it('Filling the filter field and submitting it should have an effect on the rows displayed', function(done) {
        page.fillAndsubmitFilterField().then( function() {
            request.get(optionsFilters).then(function (data) {
                setTimeout( function() {
                    page.getRowsProvider().then(function(rows) {
                        if (data.length > 0) {
                            expect(rows.length).toBe(data.length);
                        } else {
                            expect(rows.length).toBe(1);
                        }

                        done();
                    });
                }, 1000);
            });
        });
    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});