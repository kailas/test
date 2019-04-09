module.exports = require('./page.js').extend({
    urlRoot: LOGINURL,

    getLogin: function() {
        return this.driver.findElement(LOCATORS.Login.fields.login);
    },

    getPassword: function() {
        return this.driver.findElement(LOCATORS.Login.fields.password);
    },

    getSubmit: function() {
        return this.driver.findElement(LOCATORS.Login.controls.loginButton);
    },

    loginAs: function(login, password) {
        this._open();

        this.driver.actions()
            .click(this.getLogin())
            .sendKeys(login)
            .click(this.getPassword())
            .sendKeys(password)
            .click(this.getSubmit())
            .perform();

        return this._waitForPageToLoad()
            .then(_.partial(this.selectVito, VITO));
    },

    loginAsTTAdmin: function() {
        return this.loginAs(USERS.TT_ADMIN.login, USERS.TT_ADMIN.password);
    },

    loginAsTTUser: function() {
        return this.loginAs(USERS.TT_USER.login, USERS.TT_USER.password);
    },

    loginAsVitoSupervisor: function() {
        return this.loginAs(USERS.VITO_SUPERVISOR.login, USERS.VITO_SUPERVISOR.password);
    },

    loginAsVitoUser: function() {
        return this.loginAs(USERS.VITO_USER.login, USERS.VITO_USER.password);
    },

    logout: function() {
        return this.driver.findElement(LOCATORS.Login.controls.logoutButton).click();
    }
});