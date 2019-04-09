module.exports = require('../page.js').extend({
    url: 'configurations',

    waitForTable: function() {
        return this.driver.wait(UNTIL.elementLocated(LOCATORS.Configurations.TravelPeriods.divs.table),
            2000, 'TravelPeriod table not found!');
    },

    getAllRows: function() {
        return this.waitForTable().findElements({css: 'tbody > tr'});
    },

    getRow: function (index) {
        return this.waitForTable().findElement({css: 'tbody > tr:nth-child(' + (index + 1) + ')'});
    },

    getId: function (row) {
        return row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.nameSpan).getAttribute('data-travel-period-id');
    },

    getName: function (row) {
        return row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.nameSpan).getText();
    },

    getStartDate: function (row) {
        return row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.startDate).getAttribute('value');
    },

    isCreateButtonReadOnly: function () {
        return this.waitForTable().findElements(LOCATORS.Configurations.TravelPeriods.controls.createButtonReadOnly).then(function (buttonCount) {
            return (buttonCount.length == 1);
        });
    },

    isDeleteButtonHidden: function (row) {
        return row.findElements(LOCATORS.Configurations.TravelPeriods.controls.deleteButtonHidden).then(function (buttonCount) {
            return (buttonCount.length == 1);
        });
    },

    isRowGrayedOut: function(row) {
        return row.getAttribute('class').then(function (cssClass) {
            return (cssClass.trim() == 'grayed');
        });
    },

    isInfoBoxVisible: function() {
        return this.driver.findElement(LOCATORS.Configurations.TravelPeriods.divs.infoBox).isDisplayed();
    },

    clickToOpenCreateForm: function () {
        return this.waitForTable().findElement(LOCATORS.Configurations.TravelPeriods.controls.createButton).click();
    },

    clickToOpenDeleteForm: function (row) {
        return row.findElement(LOCATORS.Configurations.TravelPeriods.controls.deleteButton).click();
    },

    editName: function (id, name) {
        return this.findRowById(id).then(_.bind(function(row) {
            this.driver.actions()
                .doubleClick(row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.nameSpan))
                .perform();
            var inputField = row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.nameInput);
            inputField.clear();
            inputField.sendKeys(name, KEY.ENTER);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }, this));
    },

    editStartDate: function (id, date) {
        return this.findRowById(id).then(_.bind(function(row) {
            this.driver.actions()
                .click(row.findElement(LOCATORS.Configurations.TravelPeriods.fields.editing.startDate))
                .sendKeys(Array(8).fill(KEY.BACK_SPACE), date.split('.').join(''), KEY.ENTER)
                .perform();
            return new Promise(resolve => setTimeout(resolve, 1000));
        }, this));
    },

    findRowById: function(id) {
        var index;
        return this.getAllRows().then(_.bind(function (rows) {
            return promise.consume(_.bind(function* () {
                for (var i = 0; i < rows.length; i++) {
                    yield this.getId(rows[i]).then(function (currentId) {
                        if (currentId == id) {
                            index = i;
                            return;
                        }
                    });
                }
            }, this)).then(_.bind(function() {
                return rows[index];
            }, this));
        }, this));
    },

    findNewestRow: function () {
        var idList = [];
        return this.getAllRows().then(_.bind(function (rows) {
            return promise.consume(_.bind(function* () {
                for (var i = 0; i < rows.length; i++) {
                    yield this.getId(rows[i]).then(function (currentId) {
                        idList.push(parseInt(currentId));
                    });
                }
            }, this)).then(_.bind(function() {
                return this.findRowById(Math.max.apply(null, idList));
            }, this));
        }, this));
    },
});