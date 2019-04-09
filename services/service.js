var Request = libRequire('request');

function Service(driver) {
    this.request = new Request(driver);

    _.bindAll(this, 'delete');

    this.initialize.apply(this, arguments);
}

Service.prototype = {
    initialize: _.noop,

    delete: function(id) {
        if (_.isArray(id)) {
            return Promise.all(_(id).map(this.delete));
        }

        _.isObject(id) && (id = id.id);

        return this.request.delete({uri: [this.uri, id].join('/')});
    }
};

module.exports = Service;