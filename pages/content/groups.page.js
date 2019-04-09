var Expander = elementRequire('expander');

module.exports = require('../page').extend({
    url: 'portfolio#contentGroups',

    initialize: function() {
        this.destination = new Expander(this.driver, {locator: LOCATORS.Content.Groups.fields.destinationLevelExpander});
        this.route = new Expander(this.driver, {locator: LOCATORS.Content.Groups.fields.destinationDepartureLevelExpander});
    },

    getDestinationLevelExpander: function() {
        return this.destination;
    },

    getDestinationDepartureLevelExpander: function() {
        return this.route;
    },

    getGeneralFilter: function() {
        return this.driver.findElement(LOCATORS.Content.Groups.fields.generalFilter);
    },

    setGeneralFilter: function(filter) {
        return this.getGeneralFilter().sendKeys(filter, KEY.ENTER);
    }
});