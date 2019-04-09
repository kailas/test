function Dialog(driver) {
    this.driver = driver;

    _.bindAll(this, 'selectAll', 'close');
}

Dialog.prototype = {
    getElement: function() {
        return this.driver.findElement(LOCATORS.Common.elements.legacyMultiSelectDialog);
    },

    getOptions: function() {
        return this.getElement().then(function(el) {
            return el
                .findElements(LOCATORS.Common.fields.legacyMultiSelectDialogOptions)
                .then(function(options) {
                    return promise.map(options, function(option) {
                        return option.getAttribute('data-value');
                    });
                });
        });
    },

    selectAll: function() {
        return this
            .getElement()
            .then(function(el) {
                return el
                    .findElement(LOCATORS.Common.controls.legacyMultiSelectDialogSelectAll)
                    .click();
            })
            .then(this.close);
    },

    close: function() {
        return this
            .getElement()
            .then(function(el) {
                return el
                    .findElement(LOCATORS.Common.controls.legacyMultiSelectDialogClose)
                    .click();
            });
    }
};

function MultiSelect(el) {
    this.el = el;

    this.dialogViewContainer = new Dialog(this.el.getDriver());

    _.bindAll(
        this,
        'select',
        'selectAll',
        'deselect',
        'value'
    );
}

MultiSelect.prototype = {
    openDialog: function() {
        return this.el.click();
    },

    select: function(value) {

    },

    selectAll: function() {
        return this.openDialog().then(this.dialogViewContainer.selectAll);
    },

    deselect: function() {

    },

    getAttribute: function() {
        return this.el.getAttribute.apply(this.el, arguments);
    },

    value: function() {
        return this.getAttribute('value');
    }
};

module.exports = MultiSelect;