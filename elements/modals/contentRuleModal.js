module.exports = require('../modal.js').extend({

    isNameWarningShown: function () {
        return this.getElement().then(function (el) {
            return el.findElement(LOCATORS.Content.Rules.warnings.name).getCssValue('display').then(function (state) {
                return (state == 'inline-block');
            });
        });
    },

    isContentGroupWarningShown: function () {
        return this.getElement().then(function (el) {
            return el.findElement(LOCATORS.Content.Rules.warnings.contentGroup).getCssValue('display').then(function (state) {
                return (state == 'inline-block');
            });
        });
    },

    isTravelPeriodWarningShown: function () {
        return this.getElement().then(function (el) {
            return el.findElement(LOCATORS.Content.Rules.warnings.travelPeriods).getCssValue('display').then(function (state) {
                return (state == 'inline-block');
            });
        });
    },

    enterName: function (name) {
        if (name != null) {
            return this.getElement().then(function (el) {
                var nameField = el.findElement(LOCATORS.Content.Rules.fields.name);
                nameField.clear();
                nameField.sendKeys(name);
            });
        }

        return Promise.resolve();
    },

    enterDescription: function (description) {
        if (description != null) {
            return this.getElement().then(function (el) {
                var nameField = el.findElement(LOCATORS.Content.Rules.fields.description);
                nameField.clear();
                nameField.sendKeys(description);
            });
        }

        return Promise.resolve();
    },

    setPriority: function (priority) {
        if (priority != null) {
            return this.getElement().then(function (el) {
                return el.findElement(LOCATORS.Content.Rules.fields.priority).then(function (select) {
                    return select.findElement({css: 'option:nth-child(' + (priority) + ')'}).click();
                });
            });
        }

        return Promise.resolve();
    },

    selectContentGroup: function (index) {
        if (index != null) {
            return this.getElement().then(function (el) {
                return el.findElement(LOCATORS.Content.Rules.fields.contentGroup).then(function (select) {
                    return select.findElement({css: 'option:nth-child(' + (index + 2) + ')'}).click();
                });
            });
        }

        return Promise.resolve();
    },

    selectTravelPeriods: function (indices) {
        if (indices != null) {
            return this.getElement().then(_.bind(function (el) {
                el.findElement(LOCATORS.Content.Rules.fields.travelPeriods).click();

                if (indices === 'all') {
                    this.driver.findElement(LOCATORS.Content.Rules.widget.travelPeriods.selectAll).click();
                } else {
                    this.driver.findElement(LOCATORS.Content.Rules.widget.travelPeriods.selectItems).then(function (items) {
                        //TODO
                    });
                }

                return this.driver.findElement(LOCATORS.Content.Rules.widget.travelPeriods.confirmButton).click();
            }, this));
        }

        return Promise.resolve();
    },

    tickActive: function (active) {
        if (active) {
            return this.getElement().then(function (el) {
                return el.findElement(LOCATORS.Content.Rules.fields.activeCheckbox).click();
            });
        }

        return Promise.resolve();
    },

    tickPackaged: function (packaged) {
        if (packaged) {
            return this.getElement().then(function (el) {
                return el.findElement(LOCATORS.Content.Rules.fields.packagedCheckbox).click();
            });
        }

        return Promise.resolve();
    },

    createRule: function (name, description, groupIndex, tpIndices, priority, active, packaged) {
        return this.waitToAppear().then(_.bind(function () {
            this.enterName(name).then(_.bind(function () {
                this.enterDescription(description).then(_.bind(function () {
                    this.tickActive(active).then(_.bind(function () {
                        this.setPriority(priority).then(_.bind(function () {
                            this.selectContentGroup(groupIndex).then(_.bind(function () {
                                this.selectTravelPeriods(tpIndices).then(_.bind(function () {
                                    this.tickPackaged(packaged).then(_.bind(function () {
                                        this.submit();
                                    }, this));
                                }, this));
                            }, this));
                        }, this));
                    }, this));
                }, this));
            }, this));
        }, this)).then(_.bind(function () {
            this.waitToDisappear();
        }, this));
    },

    editRule: function (name, description, groupIndex, tpIndices, priority, active, packaged) {
        return this.createRule(name, description, groupIndex, tpIndices, priority, active, packaged);
    },

    deleteRule: function () {
        return this.waitToAppear().then(_.bind(function () {
            this.submit();
            return this.waitToDisappear();
        }, this));
    },

    submitAndWait: function (time) {
        return this.submit().then(function () {
            return new Promise(resolve => setTimeout(resolve, time));
        });
    }
});