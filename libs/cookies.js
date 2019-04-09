var Cookies = function(driver) {
    this.driver = driver;
};

Cookies.prototype.get = function() {
    return this.driver.manage().getCookies().then(function(cookies) {
        return _(cookies).map(function(cookie) {
            return [cookie.name, cookie.value].join('=');
        }).join('; ');
    });
};

module.exports = Cookies;