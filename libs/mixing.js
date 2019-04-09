module.exports = {
    generateUniqName: function(prefix) {
        return [
            prefix,
            (new Date()).getTime(),
            ((new Date()).getTime() * _.random(1, 256)).toString(36).substr(2, 5)
        ].join('#');
    },

    locator: {
        template: function(locatorObject, data) {
            var matcher = /\{\{(.+?)\}\}/g,
                locator = _.pairs(locatorObject);

            data || (data = {});

            locator[0][1] = locator[0][1].replace(matcher, function(match, placeholder) {
                return data[placeholder] || '';
            });

            return _.object(locator);
        }
    }
};