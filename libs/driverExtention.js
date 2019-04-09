function DriverExtention(Driver) {
    var extention = {
        ensureElementIsVisible: function(el) {
            if (_.isUndefined(el)) {
                return el;
            }

            return Driver.executeScript(function(el) {
                el.scrollIntoView();

                return el;
            }, el);
        },

        getCurrentLocation: function() {
            return Driver.getCurrentUrl().then(function(url) {
                var matcher = /\/(([^\/]+?)(?:#(.+?))*)$/,
                    matched = url.match(matcher);

                return {
                    url: matched[1],
                    module: matched[2],
                    route: matched[3].split('/')
                };
            });
        }
    };

    Driver.extention = extention;

    return Driver;
}

module.exports = DriverExtention;