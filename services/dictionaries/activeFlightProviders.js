module.exports = serviceRequire('service').extend({
    getUri: 'dictionaries/getvitoflightproviders',

    get: function() {
        return this.request.get({uri: this.getUri});
    }
});