var LoginPage = pageRequire('login.page.js'),
    RulesPage = pageRequire('margins/rules.page.js'),
    Loader = elementRequire('loader'),
    Modal = elementRequire('modal'),
    RuleForm = elementRequire('modals/marginsRule'),
    RulesService = serviceRequire('margins/rules'),
    GroupsService = serviceRequire('margins/groups');

describe('Margins Rules List Page', function() {
    var driver,
        login,
        page,
        loader,
        modal,
        ruleForm,
        destination,
        route,
        Service,
        GService,
        dRule,
        rRule,
        dGroup,
        rGroup;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new RulesPage(driver);
        loader = new Loader(driver);
        modal = new Modal(driver);
        ruleForm = new RuleForm(driver);

        destination = page.getDestinationLevelExpander();
        route = page.getDestinationAndDepartureLevelExpander();

        Service = new RulesService(driver);
        GService = new GroupsService(driver);

        login
            .loginAsTTAdmin()
            .then(function() {
                return Promise.all([
                        GService.createAtDestinationLevel(),
                        GService.createAtRouteLevel()
                    ])
                    .then(function(results) {
                        dGroup = results[0];
                        rGroup = results[1];
                    });
            })
            .then(done);
    }, 10000);

    beforeEach(function(done) {
        page
            .visit()
            .then(function() {
                return Promise.all([
                        Service.create(dGroup.id),
                        Service.create(rGroup.id)
                    ])
                    .then(function(results) {
                        dRule = results[0];
                        rRule = results[1];
                    });
            })
            .then(done);
    }, 10000);

    it('Page Subtitle should be \'Rules\'', function(done) {
        page
            .getSubTitle()
            .then(function(title) {
                expect(title.toLowerCase()).toContain(i18n('rules'));
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

    it('\'Destination Level\' expander should show list of all rules within ProviderSpecificDestinationRules hierarchy level', function(done) {
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

    it('\'Destination and Departure Level\' expander should show list of all rules within ProviderSpecificDestinationRules hierarchy level', function(done) {
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

    it('Should give the possibility to delete a rule for user', function(done) {
        destination
            .open()
            .then(function() {
                return destination.getContentRows(dRule.name);
            })
            .then(function(rows) {
                return rows[0]
                    .deleteButtonIsActive()
                    .then(function(deleteButtonIsActive) {
                        expect(deleteButtonIsActive).toBe(true);
                    })
                    .then(function() {
                        return rows[0];
                    });
            })
            .then(function(row) {
                return row.remove();
            })
            .then(modal.isOpen)
            .then(function(isOpen) {
                expect(isOpen).toBe(true);
            })
            .then(modal.submit)
            .then(loader.blinks)
            .then(function() {
                return destination.getContentRows(dRule.name);
            })
            .then(function(rows) {
                expect(_.isEmpty(rows)).toBe(true);

                dRule = undefined;
            })
            .then(done)
    }, 10000);

    it('Rules within expander should be sorted by their order', function(done) {
        var testGroup;

        Service
            .getAtRouteLevel()
            .then(function(rules) {
                if (rules.length < 2) {
                    return GService
                        .createAtRouteLevel(true)
                        .then(function(group) {
                            testGroup = group

                            return Service.getAtRouteLevel();
                        });
                }

                return rules;
            })
            .then(function(rules) {
                return route
                    .open()
                    .then(route.getContentRows)
                    .then(function(rows) {
                        return {
                            rows: rows,
                            rules: rules
                        };
                    });
            })
            .then(function(data) {
                var sorted = _.sortBy(data.rules, 'priority');

                return promise.map(data.rows, function(row, i) {
                    return row
                        .getContent()
                        .then(function(content) {
                            expect(content).toContain(data.rules[i].name);
                        })
                });
            })
            .then(function() {
                if (!_.isUndefined(testGroup)) {
                    return GService.delete(testGroup.id);
                }
            })
            .then(done);
    }, 10000);

    describe('Create', function() {
        describe('No groups within hierarchy level', function() {
            beforeEach(function(done) {
                GService
                    .getAtRouteLevel()
                    .then(GService.delete)
                    .then(function() {
                        rGroup = undefined;
                        rRule = undefined;
                    })
                    .then(done);
            }, 10000);

            it('Should notify if there is no group within hierarchy level to create a rule for', function(done) {
                route
                    .open()
                    .then(route.clickAddButton)
                    .then(loader.blinks)
                    .then(modal.isOpen)
                    .then(function(isOpen) {
                        expect(isOpen).toBe(true);
                    })
                    .then(modal.getTitle)
                    .then(function(title) {
                        expect(title.toLowerCase()).toContain(i18n('notification'));
                    })
                    .then(modal.getText)
                    .then(function(text) {
                        expect(text).toContain(i18n('pleaseCreateMarginGroup'));
                    })
                    .then(done);
            }, 10000);

            afterEach(function(done) {
                GService
                    .createAtRouteLevel()
                    .then(function(group) {
                        rGroup = group;
                    })
                    .then(done);
            }, 10000);
        });

        it('Should create at Destination level', function(done) {
            var name = mixing.generateUniqName('FMDR');

            destination
                .open()
                .then(destination.clickAddButton)
                .then(loader.blinks)
                .then(ruleForm.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(_.partial(ruleForm.typeName, name))
                .then(_.partial(ruleForm.typeDescription, mixing.generateUniqName('Description')))
                .then(ruleForm.toggleActive)
                .then(_.partial(ruleForm.selectMarginGroup, dGroup.id))
                .then(ruleForm.selectTravelPeriodsAll)
                .then(_.partial(ruleForm.typeRelativeMargin, 12.345))
                .then(_.partial(ruleForm.typeSecondFixedMargin, 12.34))
                .then(ruleForm.submit)
                .then(loader.blinks)
                .then(_.partial(destination.getContentRows, name))
                .then(function(rows) {
                    expect(rows.length).toBeGreaterThan(0);

                    return rows[0]
                        .remove()
                        .then(modal.isOpen)
                        .then(function(isOpen) {
                            expect(isOpen).toBe(true);
                        })
                        .then(modal.submit)
                        .then(loader.blinks);
                })
                .then(done);
        }, 10000);

        it('Should create at Route level', function(done) {
            var name = mixing.generateUniqName('FMRR');

            route
                .open()
                .then(route.clickAddButton)
                .then(loader.blinks)
                .then(ruleForm.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(_.partial(ruleForm.typeName, name))
                .then(_.partial(ruleForm.typeDescription, mixing.generateUniqName('Description')))
                .then(ruleForm.toggleActive)
                .then(_.partial(ruleForm.selectMarginGroup, rGroup.id))
                .then(ruleForm.selectTravelPeriodsAll)
                .then(_.partial(ruleForm.typeRelativeMargin, 12.345))
                .then(_.partial(ruleForm.typeSecondFixedMargin, 12.34))
                .then(ruleForm.submit)
                .then(loader.blinks)
                .then(_.partial(route.getContentRows, name))
                .then(function(rows) {
                    expect(rows.length).toBeGreaterThan(0);

                    return rows[0]
                        .remove()
                        .then(modal.isOpen)
                        .then(function(isOpen) {
                            expect(isOpen).toBe(true);
                        })
                        .then(modal.submit)
                        .then(loader.blinks);
                })
                .then(done);
        }, 10000);

        it('Should properly calculate available priorities', function(done) {
            route
                .open()
                .then(route.clickAddButton)
                .then(loader.blinks)
                .then(ruleForm.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(function() {
                    return promise.all([
                        Service.getAtRouteLevel(),
                        ruleForm
                            .getPriorityElement()
                            .then(function(priorities) {
                                return priorities.options();
                            })
                    ]);
                })
                .then(function(results) {
                    expect(results[0].length + 1).toEqual(results[1].length);
                })
                .then(done);
        }, 10000);
    });

    describe('Edit', function() {
        beforeEach(function(done) {
            promise
                .all([
                    Service
                        .getAtRouteLevel()
                        .then(function(rules) {
                            rRule = _.find(rules, function(rule) {
                                return rule.id == rRule.id;
                            });

                            return rRule;
                        }),
                    route
                        .open()
                        .then(_.partial(route.getContentRows, rRule.name))
                        .then(function(rows) {
                            return rows[0].edit();
                        })
                        .then(loader.blinks)
                ])
                .then(done);
        }, 10000);

        it('Should properly display rule\'s data', function(done) {
            ruleForm
                .getNameElementValue()
                .then(function(name) {
                    expect(name).toEqual(rRule.name);
                })
                .then(ruleForm.getDescriptionElementValue)
                .then(function(description) {
                    expect(description).toEqual(rRule.description);
                })
                .then(ruleForm.getActiveElementValue)
                .then(function(active) {
                    expect(active).toEqual(rRule.active);
                })
                .then(ruleForm.getPriorityElementValue)
                .then(function(priority) {
                    expect(priority == rRule.priority).toBeTruthy();
                })
                .then(ruleForm.getMarginGroupElementValue)
                .then(function(group) {
                    expect(group == rRule.group.id).toBeTruthy();
                })
                .then(ruleForm.getTravelPeriodsElementValue)
                .then(function(periods) {
                    periods = expect(JSON.stringify(periods));

                    _.chain(rRule.travelPeriods).pluck('id').each(periods.toContain.bind(periods));
                })
                .then(ruleForm.getRelativeMarginElementValue)
                .then(function(relative) {
                    expect(relative == rRule.relativeMargin).toBeTruthy();
                })
                .then(ruleForm.getSecondFixedMarginElementValue)
                .then(function(second) {
                    expect(second == rRule.secondFixedMargin).toBeTruthy();
                })
                .then(done);
        }, 10000);

        it('Changes should be applied', function(done) {
            var newName = mixing.generateUniqName('Name was changed by test');

            ruleForm
                .typeName(newName)
                .then(ruleForm.submit)
                .then(loader.blinks)
                .then(_.partial(route.getContentRows, rRule.name))
                .then(function(rows) {
                    expect(_.isEmpty(rows)).toBe(true);
                })
                .then(_.partial(route.getContentRows, newName))
                .then(function(rows) {
                    return rows[0]
                        .getContent()
                        .then(function(content) {
                            expect(content).toContain(newName);
                        });
                })
                .then(done);
        }, 10000);
    });

    describe('Validation', function() {
        beforeEach(function(done) {
            route
                .open()
                .then(route.clickAddButton)
                .then(loader.blinks)
                .then(ruleForm.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(done);
        }, 10000);

        it('Should properly validate required fields', function(done) {
            promise
                .map([ruleForm.typeRelativeMargin, ruleForm.typeSecondFixedMargin], function(action) {
                    return action('');
                })
                .then(ruleForm.submit)
                .then(function() {
                    return Promise.all([
                        ruleForm.getNameElementError(),
                        ruleForm.getMarginGroupElementError(),
                        ruleForm.getTravelPeriodsElementError(),
                        ruleForm.getRelativeMarginElementError(),
                        ruleForm.getSecondFixedMarginElementError()
                    ]);
                })
                .then(function(errors) {
                    _.each(errors, function(error) {
                        expect(error).toContain(i18n('fieldIsRequiredError'));
                    });
                })
                .then(done);
        });

        it('Should properly validate relative margin acceptable range (min: 0, max: 90, digits after comma: up to 3)', function(done) {
            ruleForm
                .typeRelativeMargin('string')
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, -1))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, -0.999))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0.1))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0.12))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0.123))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0.1234))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 0))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 90))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 90.000))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 90.1))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, 91))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, '12,345'))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, '-01'))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeRelativeMargin, '0001'))
                .then(ruleForm.getRelativeMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(done);
        });

        it('Should properly validate second fixed margin acceptable range (min: -100, max: 100, digits after comma: up to 2)', function(done) {
            ruleForm
                .typeSecondFixedMargin('string')
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, -101))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, -100.01))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, -100.00))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, -100))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 99.1))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 99.12))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 99.123))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 100))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 100.00))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, 100.01))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, '-45,67'))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, '-01'))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(_.partial(ruleForm.typeSecondFixedMargin, '0001'))
                .then(ruleForm.getSecondFixedMarginElementError)
                .then(function(error) {
                    expect(error).not.toContain(i18n('valueValidationError'));
                })
                .then(done);
        });
    });

    afterEach(function(done) {
        Service.delete(_.compact([
            dRule,
            rRule
        ])).then(done);
    }, 10000);

    afterAll(function(done) {
        GService
            .delete(_.compact([
                dGroup,
                rGroup
            ]))
            .then(function() {
                page.quit().then(done);
            });
    }, 10000);
});