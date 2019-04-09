module.exports = serviceRequire('service').extend({
    getUri: 'travelperiods/index',

    uri: 'travelperiods/index/id',

    get: function() {
        return this.request.get({uri: this.getUri});
    },

    getIDList: function() {
        return this.get().then(function(periods) {
            return _.pluck(periods, 'id');
        });
    }
});