require('chromedriver');

var Jasmine = require('jasmine'),
    JReporter = require('jasmine-console-reporter'),
    j = new Jasmine(),
    webdriver = require('selenium-webdriver'),
    argParser = require('minimist'),
    _ = require('underscore'),
    argv = argParser(process.argv.slice(2)),
    fs = require('fs'),
    DriverExtention,
    localConf,
    localUsers,
    specs,
    _require;

j.DEFAULT_TIMEOUT_INTERVAL = 250000;

_require = function(dir, file) {
    return require([dir, file].join('/'));
};

global.__pagesDir = './pages';
global.__libsDir = './libs';
global.__elementsDir = './elements';
global.__servicesDir = './services';

global.pageRequire = function(page) {
    !(/\.page(\.js)?$/.test(page)) && (page = [page, 'page'].join('.'));

    return _require(__pagesDir, page);
};

global.libRequire = function(lib) {
    return _require(__libsDir, lib);
};

global.elementRequire = function(element) {
    return _require(__elementsDir, element);
};

global.serviceRequire = function(service) {
    return _require(__servicesDir, service);
};

libRequire('extend');
DriverExtention = libRequire('driverExtention');

global._ = _;
global.ARGPARSER = argParser;
global.BY = webdriver.By;
global.UNTIL = webdriver.until;
global.Condition = webdriver.Condition;
global.KEY = webdriver.Key;
global.promise = webdriver.promise;
global.LOCATORS = require('./spec/support/locators.json');
global.LOCALE = require('./spec/support/locale.json');
global.request = require('request');
global.mixing = libRequire('mixing');
global._colors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    blue: '\x1b[34m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m'
};

global.getDriver = function() {
    var driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.manage().window().maximize();

    return DriverExtention(driver);
};

global.i18n = function(key) {
    return LOCALE[key][language];
};

try {
    localConf = require('./local.json');
} catch (e) {
    console.log(_colors.cyan, 'No local settings were found. Default Env is in use.');
}

global.URLROOT = !_.isUndefined(localConf.URLROOT) ? localConf.URLROOT : '';
global.LOGINURL = !_.isUndefined(localConf.LOGINURL) ? localConf.LOGINURL : URLROOT + '/main';
global.BASEURL = !_.isUndefined(localConf.BASEURL) ? localConf.BASEURL : URLROOT + '/dpct';
global.VITO = !_.isUndefined(localConf.VITO) ? localConf.VITO : undefined;
global.fancyConsoleReporter = !_.isUndefined(localConf.fancyConsoleReporter) ? localConf.fancyConsoleReporter : false;
global.language = !_.isUndefined(localConf.language) ? localConf.language : 'de';
global.leaveOpened = !_.isUndefined(localConf.leaveOpened) ? localConf.leaveOpened : false;

global.USERS = require('./spec/support/users.json');

try {
    localUsers = _(require('./localUsers.json')).pick(['TT_ADMIN', 'TT_USER', 'VITO_SUPERVISOR', 'VITO_USER']);
} catch (e) {
    console.log(_colors.cyan, 'No local users were found. Default Users are in use.');
}

_.extend(USERS, localUsers);

j.loadConfigFile('./spec/support/jasmine.json');

if (fancyConsoleReporter) {
    j.env.clearReporters();
    j.addReporter(new JReporter({
        cleanStack: 3,
        activity: true
    }));
}

if (argv.vito) {
    VITO = argv.vito;
}

if (!_.isEmpty(argv._) || !_.isEmpty(argv.dir)) {
    specs = _(argv._).map(function(spec) {
        return './spec/' + spec + '.spec.js';
    });

    if (_.isArray(argv.dir)) {
        specs.push.apply(specs, _(argv.dir).map(function(dir) {
            return './spec/' + dir + '/**/*.spec.js';
        }));
    } else {
        specs.push('./spec/' + argv.dir + '/**/*.spec.js');
    }

    j.execute(specs);
} else {
    j.execute();
}