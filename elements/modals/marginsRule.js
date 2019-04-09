var Select = elementRequire('select'),
    MultiSelect = elementRequire('legacyMultiSelect');

module.exports = require('../modal.js').extend({
    initialize: function() {
        _.bindAll(
            this,
            'getNameElementValue',
            'getDescriptionElementValue',
            'getActiveElementValue',
            'getPriorityElementValue',
            'getMarginGroupElementValue',
            'getTravelPeriodsElementValue',
            'getRelativeMarginElementValue',
            'getSecondFixedMarginElementValue',
            'typeName',
            'typeDescription',
            'toggleActive',
            'selectPriority',
            'selectMarginGroup',
            'selectTravelPeriods',
            'selectTravelPeriodsAll',
            'typeRelativeMargin',
            'typeSecondFixedMargin',
            'getNameElementError',
            'getMarginGroupElementError',
            'getTravelPeriodsElementError',
            'getRelativeMarginElementError',
            'getSecondFixedMarginElementError'
        );
    },

    getNameElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Margins.Rules.fields.name);
        });
    },

    getDescriptionElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Margins.Rules.fields.description);
        });
    },

    getActiveElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Margins.Rules.fields.active);
        });
    },

    getPriorityElement: function() {
        return this.getElement().then(function(el) {
            return new Select(el.findElement(LOCATORS.Margins.Rules.fields.priority));
        });
    },

    getMarginGroupElement: function() {
        return this.getElement().then(function(el) {
            return new Select(el.findElement(LOCATORS.Margins.Rules.fields.marginGroup));
        });
    },

    getTravelPeriodsElement: function() {
        return this.getElement().then(function(el) {
            return new MultiSelect(el.findElement(LOCATORS.Margins.Rules.fields.travelPeriods));
        });
    },

    getRelativeMarginElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Margins.Rules.fields.relativeMargin);
        });
    },

    getSecondFixedMarginElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Margins.Rules.fields.secondFixedMargin);
        });
    },

    getNameElementValue: function() {
        return this.getNameElement().then(function(el) {
            return el.getAttribute('value');
        });
    },

    getDescriptionElementValue: function() {
        return this.getDescriptionElement().then(function(el) {
            return el.getAttribute('value');
        });
    },

    getActiveElementValue: function() {
        return this.getActiveElement().then(function(el) {
            return el.isSelected();
        });
    },

    getPriorityElementValue: function() {
        return this.getPriorityElement().then(function(el) {
            return el.value();
        });
    },

    getMarginGroupElementValue: function() {
        return this.getMarginGroupElement().then(function(el) {
            return el.value();
        });
    },

    getTravelPeriodsElementValue: function() {
        return this.getTravelPeriodsElement().then(function(el) {
            return el.getAttribute('data-value').then(function(stringValue) {
                return stringValue.split(',');
            });
        });
    },

    getRelativeMarginElementValue: function() {
        return this.getRelativeMarginElement().then(function(el) {
            return el.getAttribute('value');
        });
    },

    getSecondFixedMarginElementValue: function() {
        return this.getSecondFixedMarginElement().then(function(el) {
            return el.getAttribute('value');
        });
    },

    typeName: function(name) {
        return this.getNameElement().then(function(el) {
            return el.clear().then(function() {
                return el.sendKeys(name);
            });
        });
    },

    typeDescription: function(description) {
        return this.getDescriptionElement().then(function(el) {
            return el.clear().then(function() {
                return el.sendKeys(description);
            });
        });
    },

    toggleActive: function(state) {
        return this.getActiveElement().then(function(el) {
            return el.isSelected().then(function(selected) {
                if (!_.isBoolean(state) || selected ^ state) {
                    return el.click();
                }
            });
        });
    },

    selectPriority: function(priority) {
        return this.getPriorityElement().then(function(el) {
            return el.select(priority);
        });
    },

    selectMarginGroup: function(group) {
        return this.getMarginGroupElement().then(function(el) {
            return el.select(group);
        });
    },

    selectTravelPeriods: function(periods) {
        return this.getTravelPeriodsElement().then(function(el) {
            return el.select(periods);
        });
    },

    selectTravelPeriodsAll: function() {
        return this.getTravelPeriodsElement().then(function(el) {
            return el.selectAll();
        });
    },

    typeRelativeMargin: function(margin) {
        return this._typeMargin(this.getRelativeMarginElement(), margin);
    },

    typeSecondFixedMargin: function(margin) {
        return this._typeMargin(this.getSecondFixedMarginElement(), margin);
    },

    _typeMargin: function(ThenableElement, value) {
        return ThenableElement.then(function(el) {
            return el.clear().then(function() {
                return el.sendKeys(KEY.BACK_SPACE, value);
            });
        });
    },

    getNameElementError: function() {
        return this._getErrorLabelText(LOCATORS.Margins.Rules.labels.nameError);
    },

    getMarginGroupElementError: function() {
        return this._getErrorLabelText(LOCATORS.Margins.Rules.labels.marginGroupError);
    },

    getTravelPeriodsElementError: function() {
        return this._getErrorLabelText(LOCATORS.Margins.Rules.labels.travelPeriodsError);
    },

    getRelativeMarginElementError: function() {
        return this._getErrorLabelText(LOCATORS.Margins.Rules.labels.relativeMarginError);
    },

    getSecondFixedMarginElementError: function() {
        return this._getErrorLabelText(LOCATORS.Margins.Rules.labels.secondFixedMarginError);
    },

    _getErrorLabelText: function(locator) {
        return this.getElement().then(function(el) {
            return el.findElements(locator).then(function(elements) {
                if (_.isEmpty(elements)) {
                    return undefined;
                }

                return elements[0].getText();
            });
        });
    }
});