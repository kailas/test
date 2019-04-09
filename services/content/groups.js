module.exports = serviceRequire('service').extend({
    getUri: 'contentgroup/flight',

    uri: 'contentgroup/flight/id',

    rulesService: serviceRequire('content/rules'),

    _namePrefix: 'FCG',

    initialize: function(driver) {
        this.rules = new this.rulesService(driver);

        _.bindAll(this, 'getById');
    },

    get: function(hierarchy, filter) {
        return this.request.get({
            uri: this.getUri,
            data: {
                hierarchy: hierarchy,
                limit: 20000,
                offset: 0,
                filter: filter
            }
        });
    },

    getAtDestinationLevel: function(filter) {
        return this.get('providerspecificdestination', filter);
    },

    getAtRouteLevel: function(filter) {
        return this.get('providerspecifichotelorflight', filter);
    },

    getById: function(id) {
        _.isObject(id) && (id = id.id);

        return this.request.get({
            uri: [this.uri, id].join('/')
        });
    },

    create: function(data, withRules) {
        var rulesAction = this.rules.create;

        return this.request.post({
            uri: this.uri,
            data: data
        }).then(function(response) {
            var result = _.extend(data, {id: response.GroupID});

            if (withRules) {
                return rulesAction(result, _.random(1, 5)).then(function(rules) {
                    result.rules = rules;

                    return result;
                });
            }

            return result;
        });
    },

    createAtDestinationLevel: function(withRules) {
        return this.create({
            name: mixing.generateUniqName(this._namePrefix),
            description: 'Was auto-created by Selenium test',
            destinationIATA: [232]
        }, withRules);
    },

    createAtRouteLevel: function(withRules) {
        return this.create({
            name: mixing.generateUniqName(this._namePrefix),
            description: 'Was auto-created by Selenium test',
            departureIATA: [232]
        }, withRules);
    }
});