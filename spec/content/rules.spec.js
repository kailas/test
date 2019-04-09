var LoginPage = pageRequire('login.page.js'),
    RulesPage = pageRequire('content/rules.page.js');
    Request = libRequire('request'),
    Loader = elementRequire('loader'),
    Modal = elementRequire('modals/contentRuleModal');

describe('Content Rules List Page', function () {
    var driver,
        login,
        page,
        request,
        loader,
        modal,
        destinationExpander,
        departureExpander,
        optionsDestinationRules,
        optionsDepartureRules,
        optionsDestinationContentGroups,
        optionsDepartureContentGroups;

    optionsDestinationRules = {
        uri: 'contentrules/flight',
        data: {
            hierarchy: 'providerspecificdestination',
            limit: 10000,
            offset: 0,
            filter: ''
        }
    };
    optionsDepartureRules = {
        uri: 'contentrules/flight',
        data: {
            hierarchy: 'providerspecifichotelorflight',
            limit: 10000,
            offset: 0,
            filter: ''
        }
    };
    optionsDestinationContentGroups = {
        uri: 'contentgroup/flight',
        data: {
            hierarchy: 'providerspecificdestination',
            limit: 10000,
            offset: 0,
            filter: ''
        }
    };
    optionsDepartureContentGroups = {
        uri: 'contentgroup/flight',
        data: {
            hierarchy: 'providerspecifichotelorflight',
            limit: 10000,
            offset: 0,
            filter: ''
        }
    };

    beforeAll(function (done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new RulesPage(driver);
        request = new Request(driver);
        loader = new Loader(driver);
        modal = new Modal(driver);

        destinationExpander = page.getDestinationLevelExpander();
        departureExpander = page.getDestinationAndDepartureLevelExpander();

        login.loginAsTTAdmin().then(done);
    }, 10000);

    beforeEach(function (done) {
        page.visit().then(function () {
            loader.waitToBeHidden().then(function () {
                done();
            });
        });
    }, 10000);

    it('Page Subtitle should be \'Rules\'', function (done) {
        page.getSubTitle().then(function (title) {
            expect(title.toLowerCase()).toContain(i18n('rules'));
            done();
        });
    }, 10000);

    it('Click on \'Destination Level\' should open first rules layer', function (done) {
        destinationExpander.open().then(function () {
            return Promise.all([
                destinationExpander.isOpen(),
                departureExpander.isClosed()
            ]).then(function (status) {
                expect(status[0]).toBeTruthy()
                expect(status[1]).toBeTruthy()
            });
        }).then(destinationExpander.close()).then(function () {
            return Promise.all([
                destinationExpander.isClosed(),
                departureExpander.isClosed()
            ]).then(function (status) {
                expect(status[0]).toBeTruthy()
                expect(status[1]).toBeTruthy()
            });
        }).then(done);
    }, 10000);

    it('Click on \'Destination and Departure Level\' should open second rules layer', function (done) {
        departureExpander.open().then(function () {
            return Promise.all([
                destinationExpander.isClosed(),
                departureExpander.isOpen()
            ]).then(function (status) {
                expect(status[0]).toBeTruthy()
                expect(status[1]).toBeTruthy()
            });
        }).then(departureExpander.close()).then(function () {
            return Promise.all([
                destinationExpander.isClosed(),
                departureExpander.isClosed()
            ]).then(function (status) {
                expect(status[0]).toBeTruthy()
                expect(status[1]).toBeTruthy()
            });
        }).then(done);
    }, 10000);

    it('The number of rows on \'Destination Level\' retrieved from middleware should match the number of rows on the page', function (done) {
        destinationExpander.open().then(function () {
            return Promise.all([request.get(optionsDestinationRules), page.getAllRows(destinationExpander)]).then(function (data) {
                if (data[0].length > 0) {
                    expect(data[0].length).toBe(data[1].length);
                } else {
                    expect(data[1].length).toBe(1);
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('The number of rows on \'Destination and Departure Level\' retrieved from middleware should match the number of rows on the page', function (done) {
        departureExpander.open().then(function () {
            return Promise.all([request.get(optionsDepartureRules), page.getAllRows(departureExpander)]).then(function (data) {
                if (data[0].length > 0) {
                    expect(data[0].length).toBe(data[1].length);
                } else {
                    expect(data[1].length).toBe(1);
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to create a new \'Destination Level\' rule', function (done) {
        destinationExpander.open().then(function () {
            page.clickToOpenCreateForm(destinationExpander).then(function () {
                loader.waitToBeHidden().then(function () {
                    modal.isOpen().then(function (open) {
                        expect(open).toBeTruthy();
                    });
                });
            }).then(function () {
                modal.getTitle().then(function (title) {
                    request.get(optionsDestinationContentGroups).then(function (groups) {
                        if (groups.length != 0) {
                            expect(title.toLowerCase()).toContain(i18n('editRule'));
                        } else {
                            expect(title.toLowerCase()).toContain(i18n('notification'));
                        }
                    });
                });
            }).then(function () {
                modal.cancel().then(function () {
                    modal.isClosed().then(function (closed) {
                        expect(closed).toBeTruthy();
                    });
                });
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to create a new \'Destination and Departure Level\' rule', function (done) {
        departureExpander.open().then(function () {
            page.clickToOpenCreateForm(departureExpander).then(function () {
                loader.waitToBeHidden().then(function () {
                    modal.isOpen().then(function (open) {
                        expect(open).toBeTruthy();
                    });
                });
            }).then(function () {
                modal.getTitle().then(function (title) {
                    request.get(optionsDepartureContentGroups).then(function (groups) {
                        if (groups.length != 0) {
                            expect(title.toLowerCase()).toContain(i18n('editRule'));
                        } else {
                            expect(title.toLowerCase()).toContain(i18n('notification'));
                        }
                    });
                });
            }).then(function () {
                modal.cancel().then(function () {
                    modal.isClosed().then(function (closed) {
                        expect(closed).toBeTruthy();
                    });
                });
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to edit the first \'Destination Level\' rule', function (done) {
        destinationExpander.open().then(function () {
            request.get(optionsDestinationRules).then(function (rules) {
                if (rules.length > 0) {
                    page.getRow(destinationExpander, 0).then(function (row) {
                        page.clickToOpenEditForm(row).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.isOpen().then(function (open) {
                                    expect(open).toBeTruthy();
                                });
                            });
                        });
                    }).then(function () {
                        modal.getTitle().then(function (title) {
                            expect(title.toLowerCase()).toContain(i18n('editRule'));
                        });
                    }).then(function () {
                        modal.cancel().then(function () {
                            modal.isClosed().then(function (closed) {
                                expect(closed).toBeTruthy();
                            });
                        });
                    });
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to edit the first \'Destination and Departure Level\' rule', function (done) {
        departureExpander.open().then(function () {
            request.get(optionsDepartureRules).then(function (rules) {
                if (rules.length > 0) {
                    page.getRow(departureExpander, 0).then(function (row) {
                        page.clickToOpenEditForm(row).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.isOpen().then(function (open) {
                                    expect(open).toBeTruthy();
                                });
                            });
                        });
                    }).then(function () {
                        modal.getTitle().then(function (title) {
                            expect(title.toLowerCase()).toContain(i18n('editRule'));
                        });
                    }).then(function () {
                        modal.cancel().then(function () {
                            modal.isClosed().then(function (closed) {
                                expect(closed).toBeTruthy();
                            });
                        });
                    });
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to delete the first \'Destination Level\' rule', function (done) {
        destinationExpander.open().then(function () {
            request.get(optionsDestinationRules).then(function (rules) {
                if (rules.length > 0) {
                    page.getRow(destinationExpander, 0).then(function (row) {
                        page.clickToOpenDeleteForm(row).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.isOpen().then(function (open) {
                                    expect(open).toBeTruthy();
                                });
                            });
                        });
                    }).then(function () {
                        modal.getTitle().then(function (title) {
                            expect(title.toLowerCase()).toContain(i18n('deleteRule'));
                        });
                    }).then(function () {
                        modal.cancel().then(function () {
                            modal.isClosed().then(function (closed) {
                                expect(closed).toBeTruthy();
                            });
                        });
                    });
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('Should open the correct modal window, if the user is going to delete the first \'Destination and Departure Level\' rule', function (done) {
        departureExpander.open().then(function () {
            request.get(optionsDepartureRules).then(function (rules) {
                if (rules.length > 0) {
                    page.getRow(departureExpander, 0).then(function (row) {
                        page.clickToOpenDeleteForm(row).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.isOpen().then(function (open) {
                                    expect(open).toBeTruthy();
                                });
                            });
                        });
                    }).then(function () {
                        modal.getTitle().then(function (title) {
                            expect(title.toLowerCase()).toContain(i18n('deleteRule'));
                        });
                    }).then(function () {
                        modal.cancel().then(function () {
                            modal.isClosed().then(function (closed) {
                                expect(closed).toBeTruthy();
                            });
                        });
                    });
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('Created rule on \'Destination Level\' appears in the expander list', function (done) {
        var testName = 'SELENIUM single test', testDescription = 'created destination rule';

        destinationExpander.open().then(function () {
            request.get(optionsDestinationContentGroups).then(function (groups) {
                if (groups.length != 0) {
                    request.get(optionsDestinationRules).then(function (rules) {
                        page.clickToOpenCreateForm(destinationExpander).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.createRule(testName, testDescription, 0, 'all', 1, true, true).then(function () {
                                    modal.isClosed().then(function (closed) {
                                        expect(closed).toBeTruthy();
                                    });
                                });
                            });
                        }).then(function () {
                            loader.waitToBeHidden().then(function () {
                                page.getAllRows(destinationExpander).then(function (newRows) {
                                    expect(newRows.length).toBe(rules.length + 1);
                                });
                            });
                        });
                    });
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('Created rule on \'Destination and Departure Level\' appears in the expander list', function (done) {
        var testName = 'SELENIUM single test', testDescription = 'created departure rule';

        departureExpander.open().then(function () {
            request.get(optionsDepartureContentGroups).then(function (groups) {
                if (groups.length != 0) {
                    request.get(optionsDepartureRules).then(function (rules) {
                        page.clickToOpenCreateForm(departureExpander).then(function () {
                            loader.waitToBeHidden().then(function () {
                                modal.createRule(testName, testDescription, 0, 'all', 1, true, true).then(function () {
                                    modal.isClosed().then(function (closed) {
                                        expect(closed).toBeTruthy();
                                    });
                                });
                            });
                        }).then(function () {
                            loader.waitToBeHidden().then(function () {
                                page.getAllRows(departureExpander).then(function (newRows) {
                                    expect(newRows.length).toBe(rules.length + 1);
                                });
                            });
                        });
                    });
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('After deleting the first rule at \'Destination Level\', one less entry should be shown and first rule should have gotten priority 1', function (done) {
        var testName = 'SELENIUM single test', testDescription = 'created destination rule';

        destinationExpander.open().then(function () {
            request.get(optionsDestinationRules).then(function (oldRules) {
                if (oldRules.length > 0) {
                    page.getRow(destinationExpander, 0).then(function (row) {
                        page.clickToOpenDeleteForm(row).then(function () {
                            modal.deleteRule().then(function () {
                                loader.waitToBeHidden().then(function () {
                                    request.get(optionsDestinationRules).then(function (newRules) {
                                        expect(newRules.length).toBe(oldRules.length - 1);
                                    });
                                });
                            });
                        });
                    }).then(function () {
                        if (oldRules.length > 1) {
                            page.getRow(destinationExpander, 0).then(function (row) {
                                Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row)]).then(function (data) {
                                    expect(data[0]).not.toEqual(testName);
                                    expect(data[1]).not.toEqual(testDescription);
                                    expect(data[2]).toEqual('1');
                                });
                            });
                        }
                    });
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('After deleting the first rule at \'Destination and Departure Level\', one less entry should be shown and first rule should have gotten priority 1', function (done) {
        var testName = 'SELENIUM single test', testDescription = 'created departure rule';

        departureExpander.open().then(function () {
            request.get(optionsDepartureRules).then(function (oldRules) {
                if (oldRules.length > 0) {
                    page.getRow(departureExpander, 0).then(function (row) {
                        page.clickToOpenDeleteForm(row).then(function () {
                            modal.deleteRule().then(function () {
                                loader.waitToBeHidden().then(function () {
                                    request.get(optionsDepartureRules).then(function (newRules) {
                                        expect(newRules.length).toBe(oldRules.length - 1);
                                    });
                                });
                            });
                        });
                    }).then(function () {
                        if (oldRules.length > 1) {
                            page.getRow(departureExpander, 0).then(function (row) {
                                Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row)]).then(function (data) {
                                    expect(data[0]).not.toEqual(testName);
                                    expect(data[1]).not.toEqual(testDescription);
                                    expect(data[2]).toEqual('1');
                                });
                            });
                        }
                    });
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    it('Editing last rule on \'Destination Level\' should change attributes of displayed rule, the same for revert changes', function (done) {
        var testName = 'SELENIUM edit test', testDescription = 'edited destination rule', testActive = false, testPackaged = false;
        var oldName, oldDescription, oldActive, oldPackaged;

        destinationExpander.open().then(function () {
            request.get(optionsDestinationRules).then(function (rules) {

                if (rules.length > 0) {
                    page.getRow(destinationExpander, rules.length - 1).then(function (row) {
                        return Promise.all([page.getName(row), page.getDescription(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                            oldName = data[0];
                            oldDescription = data[1];
                            oldActive = data[2];
                            oldPackaged = data[3];
                        }).then(function() {
                            return page.clickToOpenEditForm(row).then(function () {
                                return loader.waitToBeHidden().then(function () {
                                    return modal.editRule(testName, testDescription, null, null, 1, testActive, testPackaged).then(function() {
                                        return loader.waitToBeHidden();
                                    });
                                });
                            });
                        });
                    }).then(function() {
                        page.getRow(destinationExpander, 0).then(function (row) {
                            return Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                                expect(data[0]).toEqual(testName);
                                expect(data[1]).toEqual(testDescription);
                                expect(data[2]).toEqual(String(1));
                                expect(data[3]).toBe(testActive);
                                expect(data[4]).toBe(testPackaged);
                            });
                        });
                    }).then(function() {
                        page.getRow(destinationExpander, 0).then(function (row) {
                            page.clickToOpenEditForm(row).then(function () {
                                loader.waitToBeHidden().then(function () {
                                    modal.editRule(oldName, oldDescription, null, null, rules.length, oldActive, oldPackaged).then(function() {
                                        loader.waitToBeHidden();
                                    });
                                });
                            });
                        });
                    }).then(function() {
                        page.getRow(destinationExpander, rules.length - 1).then(function (row) {
                            return Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                                expect(data[0]).toEqual(oldName);
                                expect(data[1]).toEqual(oldDescription);
                                expect(data[2]).toEqual(String(rules.length));
                                expect(data[3]).toBe(oldActive);
                                expect(data[4]).toBe(oldPackaged);
                            });
                        });
                    });
                }
            });
        }).then(destinationExpander.close()).then(done);
    }, 10000);

    it('Editing last rule on \'Destination and Departure Level\' should change attributes of displayed rule, the same for revert changes', function (done) {
        var testName = 'SELENIUM edit test', testDescription = 'edited departure rule', testActive = false, testPackaged = false;
        var oldName, oldDescription, oldActive, oldPackaged;

        departureExpander.open().then(function () {
            request.get(optionsDepartureRules).then(function (rules) {

                if (rules.length > 0) {
                    page.getRow(departureExpander, rules.length - 1).then(function (row) {
                        return Promise.all([page.getName(row), page.getDescription(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                            oldName = data[0];
                            oldDescription = data[1];
                            oldActive = data[2];
                            oldPackaged = data[3];
                        }).then(function() {
                            return page.clickToOpenEditForm(row).then(function () {
                                return loader.waitToBeHidden().then(function () {
                                    return modal.editRule(testName, testDescription, null, null, 1, testActive, testPackaged).then(function() {
                                        return loader.waitToBeHidden();
                                    });
                                });
                            });
                        });
                    }).then(function() {
                        page.getRow(departureExpander, 0).then(function (row) {
                            return Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                                expect(data[0]).toEqual(testName);
                                expect(data[1]).toEqual(testDescription);
                                expect(data[2]).toEqual(String(1));
                                expect(data[3]).toBe(testActive);
                                expect(data[4]).toBe(testPackaged);
                            });
                        });
                    }).then(function() {
                        page.getRow(departureExpander, 0).then(function (row) {
                            page.clickToOpenEditForm(row).then(function () {
                                loader.waitToBeHidden().then(function () {
                                    modal.editRule(oldName, oldDescription, null, null, rules.length, oldActive, oldPackaged).then(function() {
                                        loader.waitToBeHidden();
                                    });
                                });
                            });
                        });
                    }).then(function() {
                        page.getRow(departureExpander, rules.length - 1).then(function (row) {
                            return Promise.all([page.getName(row), page.getDescription(row), page.getPriority(row), page.getActive(row), page.getPackaged(row)]).then(function (data) {
                                expect(data[0]).toEqual(oldName);
                                expect(data[1]).toEqual(oldDescription);
                                expect(data[2]).toEqual(String(rules.length));
                                expect(data[3]).toBe(oldActive);
                                expect(data[4]).toBe(oldPackaged);
                            });
                        });
                    });
                }
            });
        }).then(departureExpander.close()).then(done);
    }, 10000);

    // TODO
    // 0.) test travelPeriods with only a few selected (needs to be implemented)
    // 1.) test that priority is only selectable from 1 to numOfRules
    // 2.) implement negative tests (empty rule, ...)

    afterAll(function (done) {
        page.quit().then(done);
    }, 10000);
});