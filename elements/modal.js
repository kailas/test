var modalOptions = ['locator'];

function ModalElement(el) {
    this.el = el;
}

ModalElement.prototype = {
    findElement: function() {
        return this.el.findElement.apply(this.el, arguments);
    },

    findElements: function() {
        return this.el.findElements.apply(this.el, arguments);
    },

    getTitle: function() {
        return this.el.findElement(LOCATORS.Common.labels.modalWindowTitle).getText();
    },

    getText: function() {
        return this.el.findElement(LOCATORS.Common.fields.modalWindowText).getText();
    },

    submit: function() {
        return this._clickButton(1);
    },

    cancel: function() {
        return this._clickButton(0);
    },

    _clickButton: function(index) {
        return this._getButtons().then(function(buttons) {
            if (_.isEmpty(buttons)) {
                return false;
            }

            if (buttons[index]) {
                return buttons[index].click();
            }

            return buttons[0].click();
        });
    },

    _getButtons: function() {
        return this.el.findElements(LOCATORS.Common.controls.modalWindowButtons);
    }
};

function Modal(driver, options) {
    options || (options = {});
    this.driver = driver;

    this._instancesNumber = 0;

    _.extend(this, _.pick(options, modalOptions));

    _.bindAll(
        this,
        '_get',
        '_getInstanceNumber',
        'getText',
        'getTitle',
        'isOpen',
        'isClosed',
        'submit'
    );

    this.initialize.apply(this, arguments);
}

Modal.prototype = {
    locator: LOCATORS.Common.elements.modalWindow,

    modalElement: ModalElement,

    initialize: _.noop,

    getElement: function() {
        return this.driver.findElements(this.locator).then(this._get);
    },

    _get: function(modals) {
        this._instancesNumber = modals.length;

        if (this._instancesNumber) {
            return new this.modalElement(modals[0]);
        }

        return undefined;
    },

    getInstancesNumber: function() {
        return this.getElement().then(this._getInstanceNumber);
    },

    _getInstanceNumber: function() {
        return this._instancesNumber;
    },

    getTitle: function() {
        return this.getElement().then(function(modal) {
            return modal.getTitle();
        });
    },

    getText: function() {
        return this.getElement().then(function(modal) {
            return modal.getText();
        });
    },

    submit: function() {
        return this.getElement().then(function(modal) {
            return modal.submit();
        });
    },

    cancel: function() {
        return this.getElement().then(function(modal) {
            return modal.cancel();
        });
    },

    isOpen: function() {
        return this.getInstancesNumber().then(function(number) {
            if (number) {
                return true;
            }

            return false;
        });
    },

    isClosed: function() {
        return this.isOpen().then(function(open) {
            return !open;
        })
    }
};

module.exports = Modal;