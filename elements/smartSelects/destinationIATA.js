module.exports = require('../smartSelect').extend({
    dialogViewLocator: mixing.locator.template(
        LOCATORS.Common.elements.smartSearchDialog,
        {
            title: i18n('destinationIATACode')
        }
    )
});