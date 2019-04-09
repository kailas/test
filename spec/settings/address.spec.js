var LoginPage = pageRequire('login.page.js'),
    AddressPage = pageRequire('settings/address.page.js'),
    Request = libRequire('request'),
    Modal = elementRequire('modal');

describe('Address Page', function() {
    var driver,
        login,
        request,
        page,
        modal;

    optionsVitoAddress = {
        uri: 'addresses/index'
    };

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new AddressPage(driver);
        request = new Request(driver);
        modal = new Modal(driver);

        login.loginAsTTAdmin().then(function() {
            page.visit().then(done);
        });
    }, 10000);

    it('Page title should be \'Addresses settings\'', function(done) {
        page.getSubTitle().then(function(title) {
            expect(title.toLowerCase()).toContain(i18n('addressProviderSettings'));
            done();
        });
    }, 10000);

    it('Should show an address if there is one & there shouldn`t be more than one address', function(done) {
        Promise.all([
            request.get(optionsVitoAddress).then(function(data) {
                return data.length;
            }),
            page.getRowsAddresses().then(function(rows) {
                return rows.length;
            })
        ]).then(function(data) {
            if (data[0] > 0) {
                expect(data[1]).toBe(1);
            } else {
                expect(data[1]).toBe(0);
            }

            done();
        });

    }, 10000);

    it('Should have a clickable edit button when logged in as an admin, if no address is present there should be a clickable create button', function(done) {
        request.get(optionsVitoAddress).then(function (data) {
            if (data.length > 0) {
                page.getEditButton().then(function (button) {
                    expect(button.length).toBe(1);
                    page.getReadonlyEditButton().then(function (button) {
                        expect(button.length).toBe(0);
                        done();
                    });
                });
            } else {
                page.getAddButton().then(function (button) {
                    expect(button.length).toBe(1);
                    page.getAddButtonReadOnly().then(function (button) {
                        expect(button.length).toBe(0);
                        done();
                    });
                });
            }
        });

    }, 10000);

    it('Address should be editable when logged in as an admin', function(done) {
        var cityNew = 'Testcity',
            cityOld;
        request.get(optionsVitoAddress).then(function (data) {
            if (data.length > 0) {
                page.getClickEditButton().click().then(function() {
                    page.getCityFieldText().then(function(city) {
                        cityOld = city;
                        page.getCityField().clear();
                        page.setCity(cityNew);
                        page.getSubmitButton().click();
                        page.getCityInTable().then(function(city) {
                            expect(city).toBe(cityNew);
                            page.getClickEditButton().click().then(function() {
                                page.getCityField().clear();
                                page.setCity(cityOld);
                                page.getSubmitButton().click().then(done);
                            });
                        });
                    })
                });
            }
        });

    }, 10000);

    it('Should have a clickable delete button when logged in as an admin and warning window should appear on click', function(done) {
        request.get(optionsVitoAddress).then(function (data) {
            if (data.length > 0) {
                page.getDeleteButton().then(function (button) {
                    expect(button.length).toBe(1);
                    page.getReadonlyDeleteButton().then(function (button) {
                        expect(button.length).toBe(0);
                        page.getClickDeleteButton().click().then(function() {
                            modal.isOpen().then(function(open) {
                                expect(open).toBe(true);
                            });
                        });
                        modal.cancel().then(function() {
                            setTimeout(function() {
                                modal.isClosed().then(function(closed) {
                                    expect(closed).toBe(true);

                                    done();
                                });
                            }, 500);
                        });

                    });
                });
            } else {
                done();
            }
        });

    }, 10000);

    it('Vito user should have readonly edit, delete and add buttons', function(done) {
        //page.changeVito(7);
        login.logout();

        setTimeout( function() {
            login.loginAsVitoUser().then(function () {
                page.visit();

                request.get(optionsVitoAddress).then(function (data) {
                    if (data.length > 0) {
                        page.getReadonlyEditButton().then(function(button)  {
                            expect(button.length).toBe(1);
                            page.getReadonlyDeleteButton().then(function(button)  {
                                expect(button.length).toBe(1);
                                done();
                            });
                        });
                    } else {
                        page.getAddButtonReadOnly().then(function (button) {
                            expect(button.length).toBe(0);
                            done();
                        });
                    }
                });
            });
        }, 1000);

    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
        //done();
    }, 10000);
});