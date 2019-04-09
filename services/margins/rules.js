module.exports = serviceRequire('content/rules').extend({
    getUri: 'marginrules/flight',

    uri: 'marginrules/flight/id',

    _namePrefix: 'FMR',

    _getUniqRequestDataPart: function() {
        return {
            firstFixedMargin: 0,
            relativeMargin: _.random(0, 90000) / 1000,
            secondFixedMargin: _.random(-10000, 10000) / 100
        };
    },
});