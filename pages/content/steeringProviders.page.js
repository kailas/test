module.exports = require('../common.page.js').extend({
    url: 'portfolio#providerSteering',

    getDefaultSettingsTable: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Content.Steering.fields.defaultTable)[0],
            _.values(LOCATORS.Content.Steering.fields.defaultTable)[0]
        )));
    },

    getProvidersSettingsTable: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Content.Steering.fields.providersTable)[0],
            _.values(LOCATORS.Content.Steering.fields.providersTable)[0]
        )));
    },

    firstTravelPeriodDefaultPackageTick: function() {
        return this.getDefaultSettingsTable().findElement({css: 'tr:nth-child(2) > td:nth-child(2) > span > a'});
    },
});