var Select = elementRequire('select');

function Vito(driver) {
    this.driver = driver;
}

Vito.prototype = {
    locator: LOCATORS.Common.controls.vitoSelect,

    getVitoSelect: function() {
        return new Select(this.driver.findElement(this.locator));
    },

    select: function(value) {
        return this.getVitoSelect().select(value, _.isNaN(+value));
    },

    isEnabled: function() {
        return this.getVitoSelect().isEnabled();
    },

    value: function() {
        return this.getVitoSelect().value();
    },

    options: function() {
        return this.getVitoSelect().options();
    }
};

module.exports = Vito;