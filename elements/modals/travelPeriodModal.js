module.exports = require('../modal.js').extend({

    isNameWarningShown: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Configurations.TravelPeriods.warnings.name).getCssValue('display').then(function(state) {
                return (state == 'inline-block');
            });
        });
    },

    isStartDateWarningShown: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Configurations.TravelPeriods.warnings.date).getCssValue('display').then(function(state) {
                return (state == 'inline-block');
            });
        });
    },

    isCopyWarningShown: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Configurations.TravelPeriods.warnings.copyTP).getCssValue('display').then(function(state) {
                return (state == 'inline-block');
            });
        });
    },

    enterName: function(name) {
        return this.getElement().then(function (el) {
            var nameField = el.findElement(LOCATORS.Configurations.TravelPeriods.fields.creating.name);
            nameField.clear();
            nameField.sendKeys(name);
        });
    },

    enterStartDate: function (date) {
        return this.getElement().then(_.bind(function (el) {
            var dateField = el.findElement(LOCATORS.Configurations.TravelPeriods.fields.creating.startDate);
            this.driver.actions()
                .click(dateField)
                .sendKeys(Array(8).fill(KEY.BACK_SPACE), date.split('.').join(''))
                .perform();
            return new Promise(resolve => setTimeout(resolve, 100)).then(function() {
                return el.findElement(LOCATORS.Common.labels.modalWindowTitle).click(); // click to close calendarWidget
            });
        }, this));
    },

    selectTravelPeriodToCopyFrom: function (copyIndex) {
        return this.getElement().then(function (el) {
            return el.findElement(LOCATORS.Configurations.TravelPeriods.fields.creating.copyTravelPeriod).then(function(select) {
                return select.findElement({css: 'option:nth-child(' + (copyIndex + 2) + ')'}).click();
            });
        });
    },

    tickCopyProviderLevel: function (copyProviderLevel) {
        if (copyProviderLevel) {
            return this.getElement().then(function (el) {
                return el.findElement(LOCATORS.Configurations.TravelPeriods.fields.creating.copyProviderLevelCheckBox).click();
            });
        }

        return Promise.resolve();
    },

    createTP: function (name, date, copyIndex, copyProviderLevel) {
        return this.waitToAppear().then(_.bind(function() {
            this.enterName(name).then(_.bind(function () {
                this.enterStartDate(date).then(_.bind(function () {
                    this.selectTravelPeriodToCopyFrom(copyIndex).then(_.bind(function () {
                        this.tickCopyProviderLevel(copyProviderLevel).then(_.bind(function () {
                            this.submit();
                        }, this));
                    }, this));
                }, this));
            }, this));
        }, this)).then(_.bind(function() {
            this.waitToDisappear();
        }, this));
    },

    deleteTP: function() {
        return this.waitToAppear().then(_.bind(function() {
            this.submit();
        }, this)).then(_.bind(function() {
            return this.waitToDisappear();
        }, this));
    },

    submitAndWait: function(time) {
        return this.submit().then(function() {
            return new Promise(resolve => setTimeout(resolve, time));
        });
    },

    waitToAppear: function() {
        return this.driver.wait(this.isOpen, 2000, 'Modal window was not present, when it should have appeared!');
    },

    waitToDisappear: function() {
        return this.driver.wait(this.isClosed, 2000, 'Modal window was still present, when it should have disappeared!');
    }
});