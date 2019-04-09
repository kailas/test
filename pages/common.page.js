module.exports = require('./page.js').extend({

    getTitle: function() {
        return this.driver.findElement(LOCATORS.Common.labels.pageTitle).getText();
    },

    getSubTitle: function() {
        return this.driver.findElement(LOCATORS.Common.labels.pageSubTitle).getText();
    },

    waitForModalWindowToAppear: function() {
        return this.driver.wait(UNTIL.elementLocated(LOCATORS.Common.elements.modalWindow),
            2000, 'Modal window was not present, when it should have appeared!');
    },

    waitForModalWindowToDisappear: function() {
        return this.driver.wait(function(driver) {
            return driver.findElements(LOCATORS.Common.elements.modalWindow).then(function (elements) {
                return (elements.length == 0);
            });
        }, 2000, 'Modal window was still present, when it should have disappeared!');
    },

    getModalWindowTitle: function() {
        return this.waitForModalWindowToAppear().findElement({css: '.ttDataGridHeadlineCenter > span'}).getText();
    },

    clickToCancelModalWindow: function(modal) {
        modal || (modal = this.waitForModalWindowToAppear());
        return modal.findElement(LOCATORS.Common.controls.modalWindowCancel).click().then(_.bind(function() {
            this.waitForModalWindowToDisappear();
        }, this));
    },

    clickToConfirmModalWindow: function(modal) {
        modal || (modal = this.waitForModalWindowToAppear());
        return modal.findElement(LOCATORS.Common.controls.modalWindowConfirm).click().then(_.bind(function() {
            this.waitForModalWindowToDisappear();
        }, this));
    },

    findModalWindow: function() {
        return this.waitForModalWindowToAppear().getCssValue('display');
    },

    doNotFindModalWindow: function() {
        return this.driver.findElements({css: '.dpct-modal-window'});
    }
});