var LoginPage = pageRequire('login.page.js'),
    GroupsPage = pageRequire('content/groups.page.js'),
    Loader = elementRequire('loader'),
    Modal = elementRequire('modal'),
    GroupsService = serviceRequire('content/groups');

describe('Content Groups List Page', function() {
    var driver,
        login,
        page,
        loader,
        modal,
        destination,
        route,
        Service,
        dGroup,
        dGroupWithRules,
        rGroup,
        rGroupWithRules;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new GroupsPage(driver);
        loader = new Loader(driver);
        modal = new Modal(driver);

        destination = page.getDestinationLevelExpander();
        route = page.getDestinationDepartureLevelExpander();

        Service = new GroupsService(driver);

        login.loginAsTTAdmin().then(done);
    }, 10000);

    beforeEach(function(done) {
        page
            .visit()
            .then(function() {
                return Promise.all([
                        Service.createAtDestinationLevel(),
                        Service.createAtDestinationLevel(true),
                        Service.createAtRouteLevel(),
                        Service.createAtRouteLevel(true)
                    ])
                    .then(function(results) {
                        dGroup = results[0];
                        dGroupWithRules = results[1];
                        rGroup = results[2];
                        rGroupWithRules = results[3];
                    });
            })
            .then(done);
    }, 10000);

    it('Page Subtitle should be \'Content Groups\'', function(done) {
        page
            .getSubTitle()
            .then(function(title) {
                expect(title.toLowerCase()).toContain(i18n('contentGroups'));
            })
            .then(done);
    }, 10000);

    it('Should open and close each expander individually', function(done) {
        destination
            .open()
            .then(function() {
                return Promise.all([
                        destination.isOpen(),
                        route.isOpen()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(true);
                        expect(status[1]).toBe(false);
                    });
            })
            .then(destination.close())
            .then(function() {
                return Promise.all([
                        destination.isOpen(),
                        route.isOpen()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                    });
            })
            .then(route.open())
            .then(function() {
                return Promise.all([
                        destination.isOpen(),
                        route.isOpen()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(true);
                    });
            })
            .then(route.close())
            .then(function() {
                return Promise.all([
                        destination.isOpen(),
                        route.isOpen()
                    ])
                    .then(function(status) {
                        expect(status[0]).toBe(false);
                        expect(status[1]).toBe(false);
                    });;
            })
            .then(done);
    }, 10000);

    it('\'Destination Level\' expander should show list of all groups within ProviderSpecificDestinationRules hierarchy level', function(done) {
        destination
            .open()
            .then(function() {
                return Promise.all([
                        destination.getContentRows(),
                        Service.getAtDestinationLevel()
                    ])
                    .then(function(results) {
                        expect(results[0].length).toEqual(results[1].length);
                    })
            })
            .then(done);
    }, 10000);

    it('\'Destination and Departure Level\' expander should show list of all groups within ProviderSpecificDestinationRules hierarchy level', function(done) {
        route
            .open()
            .then(function() {
                return Promise.all([
                    route.getContentRows(),
                    Service.getAtRouteLevel()
                ]);
            })
            .then(function(results) {
                expect(results[0].length).toEqual(results[1].length);
            })
            .then(done);
    }, 10000);

    it('General filter should search through all levels', function(done) {
        page
            .setGeneralFilter(dGroup.name)
            .then(loader.blinks)
            .then(function() {
                return Promise.all([
                        destination.isOpen(),
                        route.isOpen()
                    ])
                    .then(function(results) {
                        expect(results[0]).toBe(true);
                        expect(results[1]).toBe(true);
                    });
            })
            .then(destination.getFilterValue)
            .then(function(filter) {
                expect(filter).toEqual(dGroup.name);
            })
            .then(route.getFilterValue)
            .then(function(filter) {
                expect(filter).toEqual(dGroup.name);
            })
            .then(function() {
                return Promise.all([
                        destination.getContentRows(),
                        Service.getAtDestinationLevel(dGroup.name)
                    ])
                    .then(function(results) {
                        expect(results[0].length).toEqual(results[1].length);
                    });
            })
            .then(route.getContentRows)
            .then(function(rows) {
                expect(rows.length).toEqual(1);

                return rows[0]
                    .getAttribute('innerText')
                    .then(function(text) {
                        expect(text).toContain(i18n('noDataFound'));
                    });
            })
            .then(done)
    }, 10000);

    it('Should give the possibility to delete a group for user', function(done) {
        destination
            .open()
            .then(function() {
                return destination.getContentRows(dGroup.name);
            })
            .then(function(el) {
                return el[0]
                    .deleteButtonIsActive()
                    .then(function(isActive) {
                        expect(isActive).toBe(true);
                    })
                    .then(function() {
                        return el[0].getDeleteButton();
                    })
                    .then(function(deleteButton) {
                        return deleteButton.click();
                    });
            })
            .then(modal.isOpen)
            .then(function(isOpen) {
                expect(isOpen).toBe(true);
            })
            .then(modal.submit)
            .then(loader.blinks)
            .then(function() {
                return Promise.all([
                        destination.getContentRows(dGroup.name),
                        Service.getAtDestinationLevel(dGroup.name)
                    ])
                    .then(function(results) {
                        expect(_.isEmpty(results[0])).toBe(true);
                        expect(_.isEmpty(results[1])).toBe(true);

                        dGroup = undefined;
                    })
            })
            .then(done);
    });

    it('Should inform when user tries to delete a group without any rules assigned', function(done) {
        destination
            .open()
            .then(function() {
                return destination.getContentRows(dGroup.name);
            })
            .then(function(el) {
                return el[0].getDeleteButton()
                    .then(function(button) {
                        return button.click();
                    });
            })
            .then(modal.isOpen)
            .then(function(isOpen) {
                expect(isOpen).toBe(true);
            })
            .then(modal.getText)
            .then(function(text) {
                expect(text).toContain(i18n('contentGroupDeleteNotification'));
            })
            .then(done)
    }, 10000);

    it('Should inform when user tries to delete a group with rules assigned', function(done) {
        destination
            .open()
            .then(function() {
                return destination.getContentRows(dGroupWithRules.name);
            })
            .then(function(el) {
                return el[0].getDeleteButton()
                    .then(function(button) {
                        return button.click();
                    });
            })
            .then(modal.isOpen)
            .then(function(isOpen) {
                expect(isOpen).toBe(true);
            })
            .then(modal.getText)
            .then(function(text) {
                _.each(dGroupWithRules.rules, function(rule) {
                    expect(text).toContain(rule.name);
                });
            })
            .then(done)
    }, 10000);

    afterEach(function(done) {
        Service.delete(_.compact([
            dGroup,
            dGroupWithRules,
            rGroup,
            rGroupWithRules
        ])).then(done);
    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});