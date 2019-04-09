module.exports = require('../page.js').extend({
    url: 'settings#generalProviderSettings',

    getDefaultSettingsTable: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Settings.General.fields.providerTable)[0],
            _.values(LOCATORS.Settings.General.fields.providerTable)[0]
        )));
    },

    getReleaseDaySelect: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Settings.General.controls.releaseDaySelect)[0],
            _.values(LOCATORS.Settings.General.controls.releaseDaySelect)[0]
        )));
    },

    getFirstFlightProviderReleaseSelect: function() {
        return this.getReleaseDaySelect().getAttribute('value');
    },

    setFirstFlightProviderReleaseSelect: function(val) {
        return this.getReleaseDaySelect().findElement({css: 'option:nth-child(' + val + ')'}).click();
    },

    firstFlightProviderActiveTick: function() {
        return this.getDefaultSettingsTable().findElement({css: 'tr:nth-child(1) > td:nth-child(4) > span > a'});
    },

    getRowsProvider: function() {
        return this.getDefaultSettingsTable().findElements({css: 'tbody > tr'});
    },

    getFilterField: function() {
        return this.driver.findElement(LOCATORS.Settings.General.controls.filterField);
    },

    fillAndsubmitFilterField: function() {
        return this.driver.actions()
            .click(this.getFilterField())
            .sendKeys('A')
            .sendKeys(KEY.ENTER)
            .perform();
    }
});