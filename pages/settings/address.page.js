module.exports = require('../page.js').extend({
    url: 'settings#addressSettings',

    getAddressTable: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Settings.Addresses.fields.addressTable)[0],
            _.values(LOCATORS.Settings.Addresses.fields.addressTable)[0]
        )));
    },

    getAddressForm: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Settings.Addresses.fields.addressForm)[0],
            _.values(LOCATORS.Settings.Addresses.fields.addressForm)[0]
        )));
    },

    getVitoSelect: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Common.controls.vitoSelect)[0],
            _.values(LOCATORS.Common.controls.vitoSelect)[0]
        )));
    },

    getRowsAddresses: function() {
        return this.getAddressTable().findElements({css: 'tbody > tr'});
    },

    getEditButton: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.editButton);
    },

    getClickEditButton: function() {
        return this.getAddressTable().findElement(LOCATORS.Settings.Addresses.controls.editButton);
    },

    getReadonlyEditButton: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.editButtonReadOnly);
    },

    getClickDeleteButton: function() {
        return this.getAddressTable().findElement(LOCATORS.Settings.Addresses.controls.deleteButton);
    },

    getDeleteButton: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.deleteButton);
    },

    getReadonlyDeleteButton: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.deleteButtonReadOnly);
    },

    getAddButton: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.addAddress);
    },

    getAddButtonReadOnly: function() {
        return this.getAddressTable().findElements(LOCATORS.Settings.Addresses.controls.addAddressReadOnly);
    },

    getSubmitButton: function() {
        return this.driver.findElement(LOCATORS.Settings.Addresses.controls.buttonSubmit);
    },

    getCancelButton: function() {
        return this.driver.findElement(LOCATORS.Settings.Addresses.controls.buttonCancel);
    },

    getCityField: function() {
        return this.getAddressForm().findElement({id: 'dpct-address-city'});
    },

    getCityFieldText: function() {
        return this.getCityField().getAttribute('value');
    },

    setCity: function(city) {
        return this.getAddressForm().findElement({id: 'dpct-address-city'}).sendKeys(city);
    },

    getCityInTable: function() {
        return this.getAddressTable().findElement({css: 'tbody > tr > td:nth-child(4)'}).getText();
    },

    changeVito: function(val) {
        return this.getVitoSelect().findElement({css: 'option:nth-child(' + val + ')'}).click();
    }
});