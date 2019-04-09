var LoginPage = pageRequire('login.page.js'),
    TravelPeriodPage = pageRequire('configurations/travelPeriods.page.js'),
    Request = libRequire('request'),
    Loader = elementRequire('loader'),
    Modal = elementRequire('modals/travelPeriodModal');

describe('Travel Period Page', function () {
    var driver,
        login,
        page,
        request,
        loader,
        modal,
        optionsTravelPeriods;

    optionsTravelPeriods = {
        uri: 'travelperiods/index',
    };

    beforeAll(function (done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new TravelPeriodPage(driver);
        request = new Request(driver);
        loader = new Loader(driver);
        modal = new Modal(driver);

        login.loginAsTTAdmin().then(done);
    }, 10000);

    beforeEach(function (done) {
        page.visit().then(function () {
            page.waitForTable().then(function () {
                loader.waitToBeHidden().then(done);
            });
        });
    }, 10000);

    it('The number of travel periods retrieved from middleware should match the number of rows on the page', function (done) {
        Promise.all([request.get(optionsTravelPeriods), page.getAllRows()]).then(function (data) {
            expect(data[0].length).toEqual(data[1].length);
            done();
        });
    }, 10000);

    it('Should open a modal window, when the user is going to create a new travel period', function (done) {
        page.getAllRows().then(function (rows) {
            modal.isClosed().then(function (closed) {
                expect(closed).toBeTruthy();

                if (rows.length < 12) {
                    page.clickToOpenCreateForm().then(function () {
                        modal.isOpen().then(function (open) {
                            expect(open).toBeTruthy();

                            modal.cancel().then(function () {
                                modal.isClosed().then(function (closed) {
                                    expect(closed).toBeTruthy();
                                });
                            })
                        });
                    });
                }
            });
        }).then(done);
    });

    it('Should notify the user at the attempt to delete a travel period', function (done) {
        page.getAllRows().then(function (rows) {
            modal.isClosed().then(function (closed) {
                expect(closed).toBeTruthy();

                if (rows.length > 1) {
                    page.clickToOpenDeleteForm(rows[0]).then(function () {
                        modal.isOpen().then(function (open) {
                            expect(open).toBeTruthy();

                            modal.cancel().then(function () {
                                modal.isClosed().then(function (closed) {
                                    expect(closed).toBeTruthy();
                                });
                            });
                        });
                    });
                }
            });
        }).then(done);
    });

    it('After creating a travel period, a new entry with correct name and start-date should be displayed', function (done) {
        var createName = 'SELENIUM single test', createDate = '11.11.2015';

        page.getAllRows().then(function (oldRows) {
            page.clickToOpenCreateForm().then(function () {
                modal.createTP(createName, createDate, 0, true).then(function () {
                    loader.waitToBeHidden().then(function () {
                        page.getAllRows().then(function (newRows) {
                            expect(newRows.length).toBe(oldRows.length + 1);

                            page.findNewestRow().then(function (row) {
                                Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                                    expect(data[0]).toEqual(createName);
                                    expect(data[1]).toEqual(createDate);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    }, 10000);

    it('After deleting a travel period, one less entry should be shown and latest entry should\'t contain the previous name and start-date anymore', function (done) {
        var deleteName = 'SELENIUM single test', deleteDate = '11.11.2015';

        page.getAllRows().then(function (oldRows) {
            page.findNewestRow().then(function (row) {
                page.clickToOpenDeleteForm(row).then(function () {
                    modal.deleteTP().then(function () {
                        loader.waitToBeHidden().then(function () {
                            page.getAllRows().then(function (newRows) {
                                expect(newRows.length).toBe(oldRows.length - 1);

                                page.findNewestRow().then(function (row) {
                                    Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                                        expect(data[0]).not.toEqual(deleteName);
                                        expect(data[1]).not.toEqual(deleteDate);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }, 10000);

    it('The name and the start-date of a travel period should be editable', function (done) {
        var editName = 'SELENIUM edit test', editDate = '06.12.2016';
        var oldName, oldDate;

        page.getRow(0).then(function (row) {
            Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                oldName = data[0];
                oldDate = data[1];
            }).then(function() {
                page.getId(row).then(function (id) {
                    page.editName(id, editName);
                    page.editStartDate(id, editDate);
                    page.findRowById(id).then(function (row) {
                        return Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                            expect(data[0]).toEqual(editName);
                            expect(data[1]).toEqual(editDate);
                        });
                    });
                    page.editName(id, oldName);
                    page.editStartDate(id, oldDate);
                    page.findRowById(id).then(function (row) {
                        return Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                            expect(data[0]).toEqual(oldName);
                            expect(data[1]).toEqual(oldDate);
                            done();
                        });
                    });
                });
            });
        });
    }, 10000);

    it('It shouldn\'t be able to create a 13th travel period, surrounded by creating and deleting necessary travel periods', function (done) {
        var testName = 'SELENIUM 13th test', testDate = '01.01.20';

        page.getAllRows().then(function (rows) {
            var numberOfMissingTPs = 12 - rows.length;

            promise.consume(function* () {
                for (var i = 0; i < numberOfMissingTPs; i++) {
                    var iName = testName + ' (' + i + ')';
                    var iDate = testDate + String("0" + i).slice(-2);

                    yield page.clickToOpenCreateForm().then(function () {
                        return modal.createTP(iName, iDate, 0, true).then(function () {
                            return loader.waitToBeHidden();
                        });
                    });
                }
            }).then(function () {
                page.isCreateButtonReadOnly().then(function(readOnly) {
                    expect(readOnly).toBeTruthy();

                    page.clickToOpenCreateForm().then(function() {
                        modal.isClosed().then(function(closed) {
                            expect(closed).toBeTruthy();
                        });
                    })
                });
            }).then(function () {
                promise.consume(function* () {
                    for (var i = 0; i < numberOfMissingTPs; i++) {
                        yield page.findNewestRow().then(function (row) {
                            return page.clickToOpenDeleteForm(row).then(function () {
                                return modal.deleteTP().then(function () {
                                    return loader.waitToBeHidden();
                                });
                            });
                        });
                    }
                });
            });
        }).then(done);
    }, 60000);

    it('It shouldn\'t be able to delete the last travel period, surrounded by deleting and creating necessary travel periods', function (done) {
        var nameList = [], dateList = [];

        page.getAllRows().then(function (rows) {
            var numberOfSuperfluousTPs = rows.length - 1;

            promise.consume(function* () {
                for (var i = numberOfSuperfluousTPs; i > 0; i--) {
                    yield page.getRow(i).then(function (row) {
                        return Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                            nameList.push(data[0]);
                            dateList.push(data[1]);

                            return page.clickToOpenDeleteForm(row).then(function () {
                                return modal.deleteTP().then(function () {
                                    return loader.waitToBeHidden();
                                });
                            });
                        });
                    });
                }
            }).then(function () {
                page.getRow(0).then(function (row) {
                    page.isDeleteButtonHidden(row).then(function(hidden) {
                        expect(hidden).toBeTruthy();
                    });
                });
            }).then(function () {
                promise.consume(function* () {
                    for (var i = 0; i < numberOfSuperfluousTPs; i++) {
                        yield page.clickToOpenCreateForm().then(function () {
                            return modal.createTP(nameList[i], dateList[i], 0, true).then(function () {
                                return loader.waitToBeHidden();
                            });
                        });
                    }
                });
            });
        }).then(done);
    }, 60000);

    it('It shouldn\'t be able to edit the start-date or delete the current travel period, if no previous travel periods exist', function (done) {
        var secondName = 'SELENIUM no gaps test (2nd)', secondDate = '06.01.2100';
        var pastDate = '06.01.2000', futureDate = '06.01.2200';
        var nameList = [], dateList = [];

        // PRECONDITION 1:

        promise.consume(function* () {
            var deleteToDo = true;

            while (deleteToDo) {
                yield page.getRow(0).then(function (row) {
                    return page.isRowGrayedOut(row).then(function(grayedOut) {
                        if(grayedOut) {
                            return Promise.all([page.getName(row), page.getStartDate(row)]).then(function (data) {
                                nameList.push(data[0]);
                                dateList.push(data[1]);

                                return page.clickToOpenDeleteForm(row).then(function () {
                                    return modal.deleteTP().then(function () {
                                        return loader.waitToBeHidden();
                                    });
                                });
                            });
                        } else {
                            deleteToDo = false;
                            return;
                        }
                    });
                });
            }
        }).then(function () {
            // PRECONDITION 2:

            page.getAllRows().then(function (rows) {
                if (rows.length == 1) {
                    page.clickToOpenCreateForm().then(function () {
                        modal.createTP(secondName, secondDate, 0, false).then(function () {
                            loader.waitToBeHidden();
                        });
                    });
                }
            });
        }).then(function () {
            // START OF ACTUAL TEST CASE:

            page.getAllRows().then(function(rows) {
                page.clickToOpenDeleteForm(rows[0]).then(function () {
                    modal.deleteTP().then(function () {
                        loader.waitToBeHidden().then(function () {
                            page.isInfoBoxVisible().then(function (visible) {
                                expect(visible).toBeTruthy();

                                page.getAllRows().then(function (newRows) {
                                    expect(rows.length).toBe(newRows.length);
                                });
                            });
                        });
                    });
                });
            }).then(function() {
                page.getRow(0).then(function(firstRow) {
                    page.getId(firstRow).then(function(id) {
                        page.editStartDate(id, futureDate).then(function() {
                            loader.waitToBeHidden().then(function () {
                                page.isInfoBoxVisible().then(function (visible) {
                                    expect(visible).toBeTruthy();
                                });
                            });
                        });
                    });
                });
            }).then(function() {
                page.getRow(0).then(function(firstRow) {
                    page.getStartDate(firstRow).then(function(date) {
                        page.getId(firstRow).then(function (id) {
                            page.editStartDate(id, pastDate).then(function () {
                                loader.waitToBeHidden().then(function () {
                                    page.isInfoBoxVisible().then(function (visible) {
                                        expect(visible).not.toBeTruthy();
                                    });
                                });
                            }).then(function() {
                                page.editStartDate(id, date).then(function() {
                                    loader.waitToBeHidden();
                                });
                            });
                        });
                    });
                });
            });
        }).then(function () {
            // TEAR DOWN 2:

            page.getAllRows().then(function (rows) {
                if (rows.length == 2) {
                    page.clickToOpenDeleteForm(rows[1]).then(function () {
                        modal.deleteTP().then(function () {
                            loader.waitToBeHidden();
                        });
                    });
                }
            });
        }).then(function () {
            // TEAR DOWN 1:

            promise.consume(function* () {
                for (var i = 0; i < nameList.length; i++) {
                    yield page.clickToOpenCreateForm().then(function () {
                        return modal.createTP(nameList[i], dateList[i], 0, true).then(function () {
                            return loader.waitToBeHidden();
                        });
                    });
                }
            });
        }).then(done);
    }, 30000);

    it('It shouldn\'t be possible to create a second travel period with exactly the same name', function (done) {
        var testDate = '30.12.2000';

        page.getAllRows().then(function(rows) {
            page.getName(rows[0]).then(function(sameName) {
                page.clickToOpenCreateForm().then(function () {
                    modal.enterName(sameName);
                    modal.enterStartDate(testDate);
                    modal.selectTravelPeriodToCopyFrom(0);

                    modal.isNameWarningShown().then(function(warning) {
                        expect(warning).toBeTruthy();
                    }).then(function() {
                        modal.submitAndWait(1000).then(function() {
                            modal.isOpen().then(function (open) {
                                expect(open).toBeTruthy();
                            });
                        });
                    }).then(function() {
                        modal.cancel().then(function() {
                            loader.waitToBeHidden().then(function() {
                                page.getAllRows().then(function(newRows) {
                                    expect(rows.length).toBe(newRows.length);
                                });
                            });
                        });
                    });
                });
            });
        }).then(done);
    }, 10000);

    it('It shouldn\'t be possible to create a second travel period with exactly the same date', function (done) {
        var testName = 'SELENIUM same TP-date test';

        page.getAllRows().then(function(rows) {
            page.getStartDate(rows[0]).then(function(sameDate) {
                page.clickToOpenCreateForm().then(function () {
                    modal.enterName(testName);
                    modal.enterStartDate(sameDate);
                    modal.selectTravelPeriodToCopyFrom(0);

                    modal.isStartDateWarningShown().then(function(warning) {
                        expect(warning).toBeTruthy();
                    }).then(function() {
                        modal.submitAndWait(1000).then(function() {
                            modal.isOpen().then(function (open) {
                                expect(open).toBeTruthy();
                            });
                        });
                    }).then(function() {
                        modal.cancel().then(function() {
                            loader.waitToBeHidden().then(function() {
                                page.getAllRows().then(function(newRows) {
                                    expect(rows.length).toBe(newRows.length);
                                });
                            });
                        });
                    });
                });
            });
        }).then(done);
    }, 10000);

    it('It shouldn\'t be possible to create a empty travel period with no data', function (done) {
        page.getAllRows().then(function(rows) {
            page.getStartDate(rows[0]).then(function(sameDate) {
                page.clickToOpenCreateForm().then(function () {
                    modal.enterStartDate('');
                    modal.submitAndWait(1000).then(function () {
                        return Promise.all([modal.isNameWarningShown(), modal.isStartDateWarningShown(), modal.isCopyWarningShown()]).then(function (warnings) {
                            expect(warnings[0]).toBeTruthy();
                            expect(warnings[1]).toBeTruthy();
                            expect(warnings[2]).toBeTruthy();
                        });
                    }).then(function () {
                        modal.isOpen().then(function (open) {
                            expect(open).toBeTruthy();
                        });
                    }).then(function () {
                        modal.cancel().then(function () {
                            loader.waitToBeHidden().then(function () {
                                page.getAllRows().then(function (newRows) {
                                    expect(rows.length).toBe(newRows.length);
                                });
                            });
                        });
                    });
                });
            });
        }).then(done);
    }, 10000);

    afterAll(function (done) {
        //page.quit().then(done);
        done();
    }, 10000);
});