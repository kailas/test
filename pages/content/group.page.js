var Select = elementRequire('select'),
    FlightProvidersSelect = elementRequire('smartSelects/flightProviders'),
    DestinationIATASelect = elementRequire('smartSelects/destinationIATA'),
    DepartureIATASelect = elementRequire('smartSelects/departureIATA');

module.exports = require('../page').extend({
    url: 'portfolio#contentGroups/new/flight',

    initialize: function() {
        _.bindAll(
            this,
            'getNameElement',
            'getDescriptionElement',
            'getFlightProvidersElement',
            'getFlightCategoryElement',
            'getFareTypeElement',
            'getTaxZoneElement',
            'getCountryElement',
            'getFlightLengthElement',
            'getDestinationIATAElement',
            'getDepartureIATAElement',
            'save',
            'typeName',
            'selectFlightProviders',
            'deselectFlightProviders',
            'selectFlightCategory',
            'deselectFlightCategory',
            'selectFareType',
            'deselectFareType',
            'selectTaxZone',
            'deselectTaxZone',
            'selectCountry',
            'deselectCountry',
            'selectFlightLength',
            'deselectFlightLength',
            'selectDestinationIATACode',
            'deselectDestinationIATACode',
            'selectDepartureIATACode',
            'deselectDepartureIATACode',
            'nameElementErrorIsShown',
            'filterIsMissingErrorIsShown'
        );
    },

    getNameElement: function() {
        return this.driver.findElement(LOCATORS.Content.Group.fields.name);
    },

    getDescriptionElement: function() {
        return this.driver.findElement(LOCATORS.Content.Group.fields.description);
    },

    getFlightProvidersElement: function() {
        return new FlightProvidersSelect(this.driver.findElement(LOCATORS.Content.Group.fields.flightProviders));
    },

    getFlightCategoryElement: function() {
        return new Select(this.driver.findElement(LOCATORS.Content.Group.fields.flightCategory));
    },

    getFareTypeElement: function() {
        return new Select(this.driver.findElement(LOCATORS.Content.Group.fields.fareType));
    },

    getTaxZoneElement: function() {
        return new Select(this.driver.findElement(LOCATORS.Content.Group.fields.taxZone));
    },

    getCountryElement: function() {
        return new Select(this.driver.findElement(LOCATORS.Content.Group.fields.country));
    },

    getFlightLengthElement: function() {
        return new Select(this.driver.findElement(LOCATORS.Content.Group.fields.flightLength));
    },

    getDestinationIATAElement: function() {
        return new DestinationIATASelect(this.driver.findElement(LOCATORS.Content.Group.fields.destinationIATA));
    },

    getDepartureIATAElement: function() {
        return new DepartureIATASelect(this.driver.findElement(LOCATORS.Content.Group.fields.departureIATA));
    },

    getSaveButton: function() {
        return this.driver.findElement(LOCATORS.Content.Group.controls.saveButton);
    },

    getCancelButton: function() {
        return this.driver.findElement(LOCATORS.Content.Group.controls.cancelButton);
    },

    save: function() {
        return this.getSaveButton().click();
    },

    cancel: function() {
        return this.getCancelButton().click();
    },

    getNameElementError: function() {
        return this.driver.findElements(LOCATORS.Content.Group.labels.nameError);
    },

    getFilterIsMissingError: function() {
        return this.driver.findElement(LOCATORS.Content.Group.labels.filterIsMissingError);
    },

    getNameValue: function() {
        return this.getNameElement().getAttribute('value');
    },

    typeName: function(name) {
        return this.getNameElement().then(function(el) {
            return el.clear().then(function() {
                return el.sendKeys(name);
            });
        });
    },

    selectFlightProviders: function(providers) {
        return this.getFlightProvidersElement().then(function(el) {
            return el.select(providers);
        });
    },

    deselectFlightProviders: function() {
        return this.getFlightProvidersElement().then(function(el) {
            return el.deselect();
        });
    },

    selectFlightCategory: function(category) {
        return this.getFlightCategoryElement().then(function(el) {
            return el.select(category);
        });
    },

    deselectFlightCategory: function() {
        return this.getFlightCategoryElement().then(function(el) {
            return el.deselect();
        });
    },

    selectFareType: function(fareType) {
        return this.getFareTypeElement().then(function(el) {
            return el.select(fareType);
        });
    },

    deselectFareType: function() {
        return this.getFareTypeElement().then(function(el) {
            return el.deselect();
        });
    },

    selectTaxZone: function(zone) {
        return this.getTaxZoneElement().select(zone);
    },

    deselectTaxZone: function() {
        return this.getTaxZoneElement().deselect();
    },

    selectCountry: function(country) {
        return this.getCountryElement().select(country);
    },

    deselectCountry: function() {
        return this.getCountryElement().deselect();
    },

    selectFlightLength: function(length) {
        return this.getFlightLengthElement().select(length);
    },

    deselectFlightLength: function() {
        return this.getFlightLengthElement().deselect();
    },

    selectDestinationIATACode: function(iatas) {
        return this.getDestinationIATAElement().select(iatas);
    },

    deselectDestinationIATACode: function() {
        return this.getDestinationIATAElement().deselect();
    },

    selectDepartureIATACode: function(iatas) {
        return this.getDepartureIATAElement().select(iatas);
    },

    deselectDepartureIATACode: function() {
        return this.getDepartureIATAElement().deselect();
    },

    nameElementErrorIsShown: function() {
        return this.getNameElementError().then(function(elements) {
            if (_.isEmpty(elements)) {
                return false;
            }

            return elements[0].getCssValue('display').then(function(display) {
                return display == 'inline-block';
            });
        });
    },

    filterIsMissingErrorIsShown: function() {
        return this.getFilterIsMissingError().then(function(el) {
            return el.getCssValue('display').then(function(display) {
                return display == 'inline';
            });
        });
    }
});