var Vito = elementRequire('vito'),
    Loader = elementRequire('loader');

function Page(driver) {
    this.driver = driver;

    this.vito = new Vito(this.driver);
    this.loader = new Loader(this.driver);

    this.initialize.apply(this, arguments);

    _.bindAll(this, 'visit', 'selectVito');
}

Page.prototype = {
    initialize: _.noop,

    visit: function() {
        this._open();

        return this._waitForPageToLoad();
    },

    getTitle: function() {
        return this.driver.findElement(LOCATORS.Common.labels.pageTitle).getText();
    },

    getSubTitle: function() {
        return this.driver.findElement(LOCATORS.Common.labels.pageSubTitle).getText();
    },

    quit: function() {
        if (leaveOpened) {
            return Promise.resolve();
        }

        return this.driver.quit();
    },

    selectVito: function(vito) {
        if (_.isUndefined(vito)) {
            return ;
        }

        return this.vito
            .select(vito)
            .then(function(status) {
                if (!status) {
                    console.log(_colors.red, 'VITO: ' + vito + ' can\'t be selected');
                    process.exit(1);
                }
            })
            .then(this.loader.blinks);
    },

    _open: function() {
        var url = this.urlRoot ? this.urlRoot : [BASEURL, _.result(this, 'url')].join('/');

        return this.driver.get(url);
    },

    _waitForPageToLoad: function() {
        return this.driver.wait(UNTIL.elementLocated(new BY(
            _.keys(LOCATORS.Common.labels.pageSubTitle)[0],
            _.values(LOCATORS.Common.labels.pageSubTitle)[0]
        )), 10000, 'Page loading takes too long');
    }
};

module.exports = Page;