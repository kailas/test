var dialogOptions = ['locator'];

function Dialog(driver, options) {
    options || (options = {});
    this.driver = driver;

    _.bindAll(
        this,
        'search',
        'deselect',
        'getSearchResultsContainer',
        'getSelectedItems',
        'value',
        'close',
        'waitToBeOpen',
        'waitToBeClosed',
        'isOpen',
        'isClose',
        '_search',
        '_isSearching',
        '_isIdling',
        '_waitToBeSearching',
        '_waitToBeIdling',
        '_waitForSearchResults'
    );

    _.extend(this, _.pick(options, dialogOptions));
}

Dialog.prototype = {
    searchTimeoutInterval: 10000,

    idleTimeoutInterval: 10000,

    openTimeoutInterval: 10000,

    closeTimeoutInterval: 10000,

    getElement: function() {
        return this.driver.findElement(this.locator);
    },

    getTitle: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.labels.smartSearchDialogTitle).getText();
        });
    },

    getFilter: function() {
        return this.getElement().then(function(el) {
            return el.findElement(LOCATORS.Common.fields.smartSearchDialogFilter);
        });
    },

    setFilter: function(filter) {
        return this.getFilter().then(function(el) {
            return el.clear().then(function() {
                return el.sendKeys(filter);
            });
        });
    },

    search: function(filter) {
        return this._search(filter).then(this.close);
    },

    deselect: function() {
        return this.getSelectedElements()
            .then(function(items) {
                return promise.map(items, function(item) {
                    return item.click();
                });
            })
            .then(this.close);
    },

    getSearchResultsContainer: function() {
        return this.getElement().findElement(LOCATORS.Common.fields.smartSearchDialogSearchResultsContainer);
    },

    getSelectedContainer: function() {
        return this.getElement().findElement(LOCATORS.Common.fields.smartSearchDialogSelectedContainer);
    },

    getSelectedElements: function() {
        return this.getSelectedContainer().then(function(el) {
            return el.findElements(LOCATORS.Common.fields.smartSearchDialogSelectedElement);
        });
    },

    getSelectedItems: function() {
        return promise.map(this.getSelectedElements(), function(el) {
            return el.getAttribute('innerText');
        });
    },

    value: function() {
        return promise.map(this.getSelectedElements(), function(el) {
            return el.getAttribute('innerText').then(function(text) {
                return text.split(' [')[0];
            });
        });
    },

    close: function() {
        return this.getElement()
            .then(function(el) {
                return el.findElement(LOCATORS.Common.controls.smartSearchDialogClose).click();
            })
            .then(this.waitToBeClosed);
    },

    waitToBeOpen: function() {
        return this.driver.wait(this.isOpen, this.openTimeoutInterval);
    },

    waitToBeClosed: function() {
        return this.driver.wait(this.isClose, this.closeTimeoutInterval);
    },

    isOpen: function() {
        return this.getState().then(function(display) {
            return display == 'block';
        });
    },

    isClose: function() {
        return this.isOpen().then(function(open) {
            return !open;
        });
    },

    getState: function() {
        return this.getElement().getCssValue('display');
    },

    _search: function(filter) {
        if (_.isArray(filter)) {
            return promise.map(filter, this._search);
        }

        return this
            .setFilter(filter)
            .then(this._waitForSearchResults)
            .then(this.getSearchResultsContainer)
            .then(function(el) {
                return el.getCssValue('display').then(function(display) {
                    if (display == 'block') {
                        return el.findElements(mixing.locator.template(
                            LOCATORS.Common.fields.smartSearchDialogSearchResultItem,
                            {
                                filter: filter
                            }
                        ));
                    }

                    return [];
                });
            })
            .then(function(results) {
                if (_.isEmpty(results)) {
                    return null;
                }

                return results[0].click();
            });
    },

    _waitForSearchResults: function() {
        return this._waitToBeSearching().then(this._waitToBeIdling);
    },

    _waitToBeSearching: function() {
        return this.driver.wait(this._isSearching, this.searchTimeoutInterval);
    },

    _waitToBeIdling: function() {
        return this.driver.wait(this._isIdling, this.idleTimeoutInterval);
    },

    _isSearching: function() {
        return this._getSearchState().then(function(className) {
            return className.indexOf('ui-autocomplete-loading') !== -1;
        });
    },

    _isIdling: function() {
        return this._isSearching().then(function(state) {
            return !state;
        })
    },

    _getSearchState: function() {
        return this.getFilter().then(function(el) {
            return el.getAttribute('class');
        });
    }
};

function Select(el) {
    this.el = el;

    this.readViewContainer = this.el.findElement(LOCATORS.Common.fields.smartSearchReadViewContainer);
    this.dialogViewContainer = new Dialog(this.el.getDriver(), {locator: _.result(this, 'dialogViewLocator')});

    _.bindAll(
        this,
        'openDialog',
        'select',
        'deselect',
        'getAllSelectedItems',
        'value',
        'isEnabled'
    );
}

Select.prototype = {
    openDialog: function() {
        return this.el.click().then(this.dialogViewContainer.waitToBeOpen);
    },

    select: function(value) {
        if (_.isUndefined(value)) {
            return null;
        }

        return this.openDialog().then(_.partial(this.dialogViewContainer.search, value));
    },

    deselect: function() {
        return this.isEnabled().then(_.bind(function(enabled) {
            if (enabled) {
                return this.openDialog().then(this.dialogViewContainer.deselect);
            }
        }, this));
    },

    getAllSelectedItems: function() {
        var selectedItems;

        return this
            .openDialog()
            .then(this.dialogViewContainer.getSelectedItems)
            .then(function(items) {
                selectedItems = items;
            })
            .then(this.dialogViewContainer.close)
            .then(function() {
                return selectedItems;
            })
    },

    value: function() {
        var selectedValues;

        return this
            .openDialog()
            .then(this.dialogViewContainer.value)
            .then(function(value) {
                selectedValues = value;
            })
            .then(this.dialogViewContainer.close)
            .then(function() {
                return selectedValues;
            });
    },

    isEnabled: function() {
        return this.readViewContainer.getAttribute('class').then(function(className) {
            return className.indexOf('smartDisabled') === -1;
        });
    }
};

module.exports = Select;