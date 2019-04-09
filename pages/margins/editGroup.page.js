var pageOptions = ['id'];

module.exports = require('./group.page').extend({
    urlBase: 'margins#marginGroups/edit/flight/',

    url: function() {
        return [this.urlBase, this.id].join('');
    },

    id: null,

    initialize: function(driver, options) {
        options || (options = {});

        this.constructor.__parent__.initialize.apply(this, arguments);

        _.extend(this, _.pick(options, pageOptions));

        _.bindAll(this, 'setId');
    },

    setId: function(id) {
        this.id = id;

        return this;
    }
});