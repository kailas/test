var expanderOptions = ['locator', 'toggleTimeoutInterval'];

function ContentRow(el) {
    this.el = el;

    _.bindAll(this, 'remove', 'edit');
}

ContentRow.prototype = {
    findElement: function() {
        return this.el.findElement.apply(this.el, arguments);
    },

    findElements: function() {
        return this.el.findElements.apply(this.el, arguments);
    },

    getText: function() {
        return this.el.getText.apply(this.el, arguments);
    },

    getContent: function() {
        return this.el.getAttribute('innerText');
    },

    getAttribute: function() {
        return this.el.getAttribute.apply(this.el, arguments);
    },

    getDeleteButton: function() {
        return this.el.findElements(LOCATORS.Common.controls.deleteButton).then(function(els) {
            if (_.isEmpty(els)) {
                return undefined;
            }

            return els[0].getDriver().extention.ensureElementIsVisible(els[0]);
        });
    },

    remove: function() {
        return this.getDeleteButton().then(function(button) {
            return button.click();
        });
    },

    deleteButtonIsActive: function() {
        return this.getDeleteButton().then(function(el) {
            if (el) {
                return el.getAttribute('class').then(function(className) {
                    return className.split(' ').indexOf('readonly') === -1;
                });
            }

            return false;
        })
    },

    getEditButton: function() {
        return this.el.findElements(LOCATORS.Common.controls.editButton).then(function(els) {
            if (_.isEmpty(els)) {
                return undefined;
            }

            return els[0].getDriver().extention.ensureElementIsVisible(els[0]);
        });
    },

    edit: function() {
        return this.getEditButton().then(function(button) {
            return button.click();
        });
    }
};

function Expander(driver, options) {
    options || (options = {});
    this.driver = driver;

    _.extend(this, _.pick(options, expanderOptions));

    _.bindAll(
        this,
        'getFilterValue',
        'getContentRows',
        'clickAddButton',
        'open',
        'close',
        'isOpen',
        'isClosed',
        'waitUntilOpen',
        'waitUntilClosed'
    );
}

Expander.prototype = {
    locator: '',

    toggleTimeoutInterval: 6000,

    getElement: function() {
        return this.driver.findElement(this.locator);
    },

    getTitleElement: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.labels.expanderTitle);
        });
    },

    getTitle: function() {
        return this.getTitleElement().then(function(el) {
            return el.getText();
        });
    },

    getFilter: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.fields.expanderFilter);
        });
    },

    setFilter: function(filter) {
        return this.getFilter().then(function(el) {
            return el.sendKeys(filter, KEY.ENTER);
        });
    },

    getFilterValue: function() {
        return this.getFilter().then(function(el) {
            return el.getAttribute('value');
        });
    },

    getContentContainer: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.fields.expanderContentContainer);
        });
    },

    getContentRowsContainer: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.fields.expanderContentRowsContainer);
        });
    },

    getContentRows: function(byName) {
        var selector;

        if (_.isString(byName) && byName) {
            selector = mixing.locator.template(LOCATORS.Common.fields.expanderContentRowsByName, {name: byName});
        } else {
            selector = LOCATORS.Common.fields.expanderContentRows;
        }

        return this.getElement().then(function(el) {
            return el.findElements(selector)
                .then(function(rows) {
                    return promise.map(rows, function(row) {
                        return new ContentRow(row);
                    });
                });
        });
    },

    getAddButton: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.controls.expanderContentAddButton).then(function(el) {
                return el.getDriver().extention.ensureElementIsVisible(el);
            });
        });
    },

    clickAddButton: function() {
        return this.getAddButton().then(function(button) {
            return button.click();
        });
    },

    open: function() {
        return this.isClosed().then(_.bind(function(closed) {
            if (closed) {
                return this._toggle().then(this.waitUntilOpen);
            }

            return null;
        }, this));
    },

    close: function() {
        return this.isOpen().then(_.bind(function(open) {
            if (open) {
                return this._toggle().then(this.waitUntilClosed);
            }

            return null;
        }, this));
    },

    waitUntilOpen: function() {
        return this.driver.wait(this.isOpen, this.toggleTimeoutInterval);
    },

    waitUntilClosed: function() {
        return this.driver.wait(this.isClosed, this.toggleTimeoutInterval);
    },

    _toggle: function() {
        return this.getTitleElement().then(function(el) {
            return el.click();
        });
    },

    isOpen: function() {
        return this.getContentRows().then(function(data) {
            return data.length > 0;
        });
    },

    isClosed: function() {
        return this.getContentRows().then(function(data) {
            return data.length === 0;
        });
    }
};

module.exports = Expander;