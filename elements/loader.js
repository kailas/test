var modalOptions = ['locator', 'visibleTimeoutInterval', 'hiddenTimeoutInterval'];

function Loader(driver, options) {
    options || (options = {});
    this.driver = driver;

    _.extend(this, _.pick(options, modalOptions));

    _.bindAll(this, 'waitToBeShown', 'waitToBeHidden', 'isVisible', 'isHidden', 'blinks');
}

Loader.prototype = {
    locator: LOCATORS.Common.elements.loader,

    visibleTimeoutInterval: 5000,

    hiddenTimeoutInterval: 5000,

    getElement: function() {
        return this.driver.findElement(this.locator);
    },

    blinks: function() {
        return this.waitToBeShown().then(this.waitToBeHidden, this.waitToBeHidden);
    },

    waitToBeShown: function() {
        return this.driver.wait(this.isVisible, this.visibleTimeoutInterval);
    },

    waitToBeHidden: function() {
        return this.driver.wait(this.isHidden, this.hiddenTimeoutInterval);
    },

    isVisible: function() {
        return this.getState().then(function(display) {
            return display == 'block';
        });
    },

    isHidden: function() {
        return this.getState().then(function(display) {
            return display == 'none';
        });
    },

    getState: function() {
        return this.getElement().getCssValue('display');
    }
};

module.exports = Loader;