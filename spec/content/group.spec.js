var LoginPage = pageRequire('login'),
    GroupPage = pageRequire('content/group'),
    GroupsPage = pageRequire('content/groups'),
    Modal = elementRequire('modal'),
    Loader = elementRequire('loader'),
    VitoTravelPeriodsService = serviceRequire('dictionaries/activeFlightProviders');

describe('Content Groups List Page', function() {
    var driver,
        login,
        page,
        groupsPage,
        modal,
        loader,
        Service,
        IATAList;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new GroupPage(driver);
        groupsPage = new GroupsPage(driver);
        modal = new Modal(driver);
        loader = new Loader(driver, {
            visibleTimeoutInterval: 2000,
            hiddenTimeoutInterval: 10000
        });
        Service = new VitoTravelPeriodsService(driver);

        IATAList = ['JFK', 'FRA', 'CDG', 'LHR'];

        login.loginAsTTAdmin().then(done);
    }, 20000);

    beforeEach(function(done) {
        page
            .visit()
            .then(loader.blinks)
            .then(done);
    }, 20000);

    it('Page Subtitle should be \'Edit flight content group\'', function(done) {
        page
            .getSubTitle()
            .then(function(title) {
                expect(title.toLowerCase()).toContain(i18n('flightContentGroup'));
            })
            .then(done);
    }, 10000);

    it('\'Optional Filters\': only one can be selected', function(done) {
        var flightProviders = page.getFlightProvidersElement(),
            flightCategory = page.getFlightCategoryElement(),
            fareType = page.getFareTypeElement();

        promise
            .all([
                flightProviders.isEnabled(),
                flightCategory.isEnabled(),
                fareType.isEnabled()
            ])
            .then(function(status) {
                expect(status[0]).toBe(true);
                expect(status[1]).toBe(true);
                expect(status[2]).toBe(true);
            })
            .then(function() {
                return Service.get().then(function(providers) {
                    return _.chain(providers)
                        .sample(_.random(1, providers.length))
                        .pluck('code')
                        .value();
                });
            })
            .then(flightProviders.select)
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(false);
                        expect(status[2]).toBe(false);
                    });
            })
            .then(flightProviders.deselect)
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                    });
            })
            .then(flightCategory.select('charter'))
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(false);
                    });
            })
            .then(flightCategory.deselect)
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                    });
            })
            .then(fareType.select('published'))
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                        expect(status[2]).toBe(true);
                    });
            })
            .then(fareType.deselect)
            .then(function() {
                return Promise.all([
                        flightProviders.isEnabled(),
                        flightCategory.isEnabled(),
                        fareType.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                    });
            })
            .then(done);
    }, 20000);

    it('\'Destination Level\': only one can be selected', function(done) {
        var taxZone = page.getTaxZoneElement(),
            country = page.getCountryElement(),
            flightLength = page.getFlightLengthElement(),
            destinationIATACode = page.getDestinationIATAElement();

        promise
            .all([
                taxZone.isEnabled(),
                country.isEnabled(),
                flightLength.isEnabled(),
                destinationIATACode.isEnabled()
            ])
            .then(function(status) {
                expect(status[0]).toBe(true);
                expect(status[1]).toBe(true);
                expect(status[2]).toBe(true);
                expect(status[3]).toBe(true);
            })
            .then(taxZone.select('eu'))
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(false);
                        expect(status[2]).toBe(false);
                        expect(status[3]).toBe(false);
                    });
            })
            .then(taxZone.deselect)
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                        expect(status[3]).toBe(true);
                    });
            })
            .then(country.select(39))
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(false);
                        expect(status[3]).toBe(false);
                    });
            })
            .then(country.deselect)
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                        expect(status[3]).toBe(true);
                    });
            })
            .then(flightLength.select('mediumHaul'))
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                        expect(status[2]).toBe(true);
                        expect(status[3]).toBe(false);
                    });
            })
            .then(flightLength.deselect)
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                        expect(status[3]).toBe(true);
                    });
            })
            .then(destinationIATACode.select(IATAList))
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                        expect(status[2]).toBe(false);
                        expect(status[3]).toBe(true);
                    });
            })
            .then(destinationIATACode.deselect)
            .then(function() {
                return Promise.all([
                        taxZone.isEnabled(),
                        country.isEnabled(),
                        flightLength.isEnabled(),
                        destinationIATACode.isEnabled()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(true);
                        expect(status[2]).toBe(true);
                        expect(status[3]).toBe(true);
                    });
            })
            .then(done);
    }, 20000);

    it('Cancel button should redirect to Groups List page', function(done) {
        page
            .cancel()
            .then(driver.extention.getCurrentLocation)
            .then(function(current) {
                expect(current.url).toEqual(groupsPage.url);
            })
            .then(done);
    }, 10000);

    it('Should properly validate fields', function(done) {
        promise
            .all([
                page.nameElementErrorIsShown(),
                page.filterIsMissingErrorIsShown()
            ])
            .then(function(status) {
                expect(status[0]).toBe(false);
                expect(status[1]).toBe(false);
            })
            .then(page.save)
            .then(function() {
                return Promise.all([
                        page.nameElementErrorIsShown(),
                        page.filterIsMissingErrorIsShown()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(false);
                    });
            })
            .then(function() {
                return page.typeName(mixing.generateUniqName('FCG'));
            })
            .then(function() {
                return Promise.all([
                        page.nameElementErrorIsShown(),
                        page.filterIsMissingErrorIsShown()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                    });
            })
            .then(page.save)
            .then(function() {
                return Promise.all([
                        page.nameElementErrorIsShown(),
                        page.filterIsMissingErrorIsShown()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(true);
                    });
            })
            .then(function() {
                return page.getTaxZoneElement().select('eu');
            })
            .then(function() {
                return Promise.all([
                        page.nameElementErrorIsShown(),
                        page.filterIsMissingErrorIsShown()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                    });
            })
            .then(done);
    }, 20000);

    it('Should notify user that group was successfully saved', function(done) {
        var name = mixing.generateUniqName('FCG');

        promise
            .all([
                page.typeName(name),
                page.getDestinationIATAElement().select('JFK')
            ])
            .then(page.save)
            .then(loader.blinks)
            .then(modal.isOpen)
            .then(function(open) {
                expect(open).toBe(true);
            })
            .then(modal.getText)
            .then(function(text) {
                expect(text).toContain(name);
            })
            .then(modal.submit)
            .then(function() {
                return groupsPage
                    .setGeneralFilter(name)
                    .then(loader.blinks)
                    .then(groupsPage.getDestinationLevelExpander().getContentRows)
                    .then(function(rows) {
                        return rows[0].getContent().then(function(content) {
                            expect(content).toContain(name);
                        });
                    });
            })
            .then(done);
    }, 10000);

    describe('Should create a Group at Destination Level', function() {
        var Groups,
            name;

        beforeEach(function() {
            Groups = groupsPage.getDestinationLevelExpander();
            name = mixing.generateUniqName('FCG');
        });

        it('European Tax Zone', function(done) {
            page.typeName(name)
                .then(page.getTaxZoneElement().select('eu'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Country', function(done) {
            page.typeName(name)
                .then(page.getCountryElement().select(39))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Flight Length', function(done) {
            page.typeName(name)
                .then(page.getFlightLengthElement().select('longHaul'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Destination IATA Code', function(done) {
            page.typeName(name)
                .then(page.getDestinationIATAElement().select(IATAList))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Optional filter doesn\'t affect hierarchy level', function(done) {
            page.typeName(name)
                .then(page.getTaxZoneElement().select('eu'))
                .then(page.getFlightCategoryElement().select('charter'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);
    });

    describe('Should create a Route Level', function() {
        var Groups,
            name;

        beforeEach(function() {
            Groups = groupsPage.getDestinationDepartureLevelExpander();
            name = mixing.generateUniqName('FCG');
        });

        it('Departure IATA & European Tax Zone', function(done) {
            page.typeName(name)
                .then(page.getDepartureIATAElement().select(IATAList))
                .then(page.getTaxZoneElement().select('eu'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Departure IATA & Country', function(done) {
            page.typeName(name)
                .then(page.getDepartureIATAElement().select(IATAList))
                .then(page.getCountryElement().select(39))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Departure IATA & Flight Length', function(done) {
            page.typeName(name)
                .then(page.getDepartureIATAElement().select(IATAList))
                .then(page.getFlightLengthElement().select('longHaul'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Departure IATA & Destination IATA Code', function(done) {
            page.typeName(name)
                .then(page.getDepartureIATAElement().select(IATAList))
                .then(page.getDestinationIATAElement().select(IATAList))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Optional filter doesn\'t affect hierarchy level', function(done) {
            page.typeName(name)
                .then(page.getDepartureIATAElement().select(IATAList))
                .then(page.getFlightCategoryElement().select('charter'))
                .then(page.save)
                .then(loader.blinks)
                .then(modal.submit)
                .then(Groups.open)
                .then(_.partial(Groups.getContentRows, name))
                .then(function(rows) {
                    return rows[0].getContent().then(function(content) {
                        expect(content).toContain(name);

                        return rows[0].remove();
                    });
                })
                .then(modal.submit)
                .then(loader.blinks)
                .then(done);
        }, 10000);
    });

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});