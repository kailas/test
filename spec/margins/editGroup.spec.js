var LoginPage = pageRequire('login'),
    EditGroupPage = pageRequire('margins/editGroup'),
    GroupsPage = pageRequire('margins/groups'),
    Modal = elementRequire('modal'),
    Loader = elementRequire('loader');
    FlightProvidersSelect = elementRequire('smartSelects/flightProviders');
    GroupsService = serviceRequire('margins/groups');
    ActiveFlightProvidersService = serviceRequire('dictionaries/activeFlightProviders');;

describe('Edit Margins Group Page', function() {
    var driver,
        login,
        page,
        groupsPage,
        modal,
        loader,
        Service,
        ProvidersService,
        IATAList;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new EditGroupPage(driver);
        groupsPage = new GroupsPage(driver);
        modal = new Modal(driver);
        loader = new Loader(driver, {
            visibleTimeoutInterval: 2000,
            hiddenTimeoutInterval: 10000
        });
        Service = new GroupsService(driver);
        ProvidersService = new ActiveFlightProvidersService(driver);

        IATAList = ['JFK', 'FRA', 'CDG', 'LHR'];

        login.loginAsTTAdmin().then(done);
    }, 20000);

    describe('Destination level: Updates should be observable', function() {
        var iatas = ['FTY', 'PIU', 'FMM', 'MES', 'JVL', 'OZH'],
            Group;

        function DisableFilterWithinBlock(list) {
            return promise
                .map(list, function(FieldProvider) {
                    return FieldProvider()
                        .deselect()
                        .then(function() {
                            return FieldProvider;
                        });
                });
        }

        function SelectRandomValue(element) {
            var value;

            if (_.isFunction(element.options)) {
                return element
                    .options()
                    .then(function(options) {
                        value = _.chain(options)
                            .omit(function(option) {
                                return option === '';
                            })
                            .sample()
                            .value();

                        return value;
                    })
                    .then(element.select)
                    .then(function() {
                        return value;
                    });
            }

            if (element instanceof FlightProvidersSelect) {
                return ProvidersService
                    .get()
                    .then(function(providers) {
                        value = _.chain(providers)
                            .sample(_.random(1, providers.length))
                            .pluck('code')
                            .value();

                        return value;
                    })
                    .then(element.select)
                    .then(function() {
                        return value;
                    });
            }

            return element
                .select(iatas)
                .then(function() {
                    return iatas;
                });
        }

        function DestinationIteratee(DestinationFieldProvider) {
            var values = {};

            return SelectRandomValue(DestinationFieldProvider())
                .then(function(destinationFilterValue) {
                    values.destinationFilter = destinationFilterValue;
                })
                .then(function() {
                    return DisableFilterWithinBlock([
                            page.getFlightProvidersElement,
                            page.getFlightCategoryElement,
                            page.getFareTypeElement
                        ])
                        .then(function(actions) {
                            return promise
                                .map(actions, function(OptionalFieldProvider) {
                                    return SelectRandomValue(OptionalFieldProvider())
                                        .then(function(optionalFilterValue) {
                                            values.optionalFilter = optionalFilterValue;
                                        })
                                        .then(page.save)
                                        .then(loader.blinks)
                                        .then(modal.isOpen)
                                        .then(function(isOpen) {
                                            expect(isOpen).toBe(true);
                                        })
                                        .then(page.visit)
                                        .then(loader.blinks)
                                        .then(loader.blinks)
                                        .then(DestinationFieldProvider().value)
                                        .then(function(destination) {
                                            if (_.isArray(destination) && _.isArray(values.destinationFilter)) {
                                                expect(destination.sort()).toEqual(values.destinationFilter.sort());
                                            } else {
                                                expect(destination).toEqual(values.destinationFilter);
                                            }
                                        })
                                        .then(OptionalFieldProvider().value)
                                        .then(function(optional) {
                                            if (_.isArray(optional) && _.isArray(values.optionalFilter)) {
                                                expect(optional.sort()).toEqual(values.optionalFilter.sort());
                                            } else {
                                                expect(optional).toEqual(values.optionalFilter);
                                            }
                                        })
                                        .then(OptionalFieldProvider().deselect)
                                })
                                .then(DestinationFieldProvider().deselect)
                        });
                });
        }

        beforeAll(function(done) {
            Service
                .createAtDestinationLevel()
                .then(Service.getById)
                .then(function(group) {
                    Group = group;

                    return group.id;
                })
                .then(page.setId)
                .then(done);
        }, 10000);

        beforeEach(function(done) {
            page
                .visit()
                .then(loader.blinks)
                .then(loader.blinks)
                .then(done);
        }, 10000);

        it('Without changing hierarchy', function(done) {
            var DestinationFieldProviders = [
                page.getTaxZoneElement,
                page.getCountryElement,
                page.getFlightLengthElement,
                page.getDestinationIATAElement
            ];

            DisableFilterWithinBlock(DestinationFieldProviders)
                .then(function(actions) {
                    return promise.map(actions, DestinationIteratee);
                })
                .then(done);
        }, 1000000);

        it('Including changing hierarchy', function(done) {
            var DestinationFieldProviders = [
                page.getTaxZoneElement,
                page.getCountryElement,
                page.getFlightLengthElement,
                page.getDestinationIATAElement
            ];

            DisableFilterWithinBlock(DestinationFieldProviders)
                .then(function(actions) {
                    return promise.map(actions, function(action) {
                        var departures = _.chain(iatas).sample(_.random(1, iatas.length)).value();

                        page
                            .getDepartureIATAElement()
                            .select(departures)
                            .then(_.partial(DestinationIteratee, action))
                            .then(page.getDepartureIATAElement().value)
                            .then(function(actualDepartures) {
                                expect(actualDepartures.sort()).toEqual(departures.sort());
                            })
                            .then(page.getDepartureIATAElement().deselect);
                    });
                })
                .then(done);
        }, 1000000);

        afterAll(function(done) {
            Service.delete(Group.id).then(done);
        }, 10000);
    });

    describe('Destination level without any rules assigned', function() {
        var Group;

        beforeEach(function(done) {
            Service
                .createAtDestinationLevel()
                .then(Service.getById)
                .then(function(group) {
                    Group = group;

                    return page
                        .setId(group.id)
                        .visit()
                        .then(loader.blinks)
                        .then(loader.blinks)
                        .then(done);
                });
        }, 20000);

        it('Should allow to change the hierarchy level', function(done) {
            page
                .getDepartureIATAElement()
                .select(IATAList)
                .then(page.save)
                .then(loader.blinks)
                .then(modal.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(modal.getText)
                .then(function(text) {
                    expect(text).toContain(Group.name);
                })
                .then(done);
        }, 10000);

        afterEach(function(done) {
            Service.delete(Group.id).then(done);
        }, 10000);
    });

    describe('Destination level with rules assigned', function() {
        var Group;

        beforeEach(function(done) {
            Service
                .createAtDestinationLevel(true)
                .then(function(group) {
                    Group = group;

                    return page
                        .setId(group.id)
                        .visit()
                        .then(loader.blinks)
                        .then(loader.blinks)
                        .then(done);
                });
        }, 20000);

        it('Should not allow to change the hierarchy level', function(done) {
            page
                .getDepartureIATAElement()
                .select(IATAList)
                .then(page.save)
                .then(loader.blinks)
                .then(modal.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(modal.getText)
                .then(function(text) {
                    expect(text).toContain(i18n('notPossibleToChangeHierarchyLevel'));
                })
                .then(done);
        }, 10000);

        afterEach(function(done) {
            Service.delete(Group.id).then(done);
        }, 10000);
    });

    afterEach(function(done) {
        modal
            .isOpen()
            .then(function(isOpen) {
                if (isOpen) {
                    return modal.submit();
                }
            })
            .then(done);
    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});