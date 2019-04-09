var Expander = elementRequire('expander');

module.exports = require('../page.js').extend({
    url: 'portfolio#rules',

    initialize: function() {
        this.destination = new Expander(this.driver, {locator: LOCATORS.Content.Rules.divs.destinationLevelExpander});
        this.departure = new Expander(this.driver, {locator: LOCATORS.Content.Rules.divs.destinationDepartureLevelExpander});
    },

    getDestinationLevelExpander: function() {
        return this.destination;
    },

    getDestinationAndDepartureLevelExpander: function() {
        return this.departure;
    },

    getTable: function(expander) {
        return expander.getElement().then(function(el) {
            return el.findElement(LOCATORS.Content.Rules.divs.table);
        });
    },

    getAllRows: function(expander) {
        return this.getTable(expander).then(function(table) {
            return table.findElements({css: 'tbody > tr'});
        });
    },

    getRow: function(expander, index) {
        return this.getTable(expander).then(function(table) {
            return table.findElement({css: 'tbody > tr:nth-child(' + (index + 1) + ')'});
        });
    },

    getName: function(row) {
        return row.findElement(LOCATORS.Content.Rules.labels.name).getText();
    },

    getDescription: function(row) {
        return row.findElement(LOCATORS.Content.Rules.labels.description).getText();
    },

    getPriority: function(row) {
        return row.findElement(LOCATORS.Content.Rules.labels.priority).getText();
    },

    getContentGroupName: function(row) {
        return row.findElement(LOCATORS.Content.Rules.labels.contentGroup).getText();
    },

    getTravelPeriodNames: function(row) {
        return row.findElement(LOCATORS.Content.Rules.labels.travelPeriods).getText();
    },

    getActive: function(row) {
        return row.findElements(LOCATORS.Content.Rules.labels.activeEnabled).then(function(elements) {
            return (elements.length == 1);
        });
    },

    getPackaged: function(row) {
        return row.findElements(LOCATORS.Content.Rules.labels.packagedEnabled).then(function(elements) {
            return (elements.length == 1);
        });
    },

    clickToOpenCreateForm: function(expander) {
        return this.getTable(expander).then(function(table) {
            return table.findElement(LOCATORS.Content.Rules.controls.createButton).click();
        });
    },

    clickToOpenEditForm: function(row) {
        return row.findElement(LOCATORS.Content.Rules.controls.editButton).click();
    },

    clickToOpenDeleteForm: function(row) {
        return row.findElement(LOCATORS.Content.Rules.controls.deleteButton).click();
    }
});