module.exports = serviceRequire('service').extend({
    getUri: 'contentrules/flight',

    uri: 'contentrules/flight/id',

    _namePrefix: 'FCR',

    travelPeriodsService: serviceRequire('configurations/travelPeriods'),

    initialize: function(driver) {
        this.travelPeriods = new this.travelPeriodsService(driver);

        _.bindAll(this, '_create', 'create');
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

    create: function(cgId, n) {
        var action;

        _.isObject(cgId) && (cgId = cgId.id);

        action = _.partial(this._create, cgId);

        return this.travelPeriods.getIDList().then(function(periods) {
            var seq = [],
                i = 0;

            if (_.isNumber(n)) {
                for (i; i < n; i++) {
                    seq.push(action(periods));
                }

                return Promise.all(seq);
            }

            return action(periods);
        });
    },

    _create: function(cgId, periods) {
        var data = this._prepareRequestData(cgId, periods);

        return this.request.post({
            uri: this.uri,
            data: data
        }).then(function(rule) {
            return _.extend(data, {id: rule.id});
        });
    },

    _getUniqRequestDataPart: function() {
        return {
            packaged: !!_.random(0, 1)
        };
    },

    _prepareRequestData: function(cgId, periods) {
        var base = {
            name: mixing.generateUniqName(this._namePrefix),
            description: 'Was auto-created by Selenium test',
            group: cgId,
            active: !!_.random(0, 1),
            priority: 9999,
            travelPeriods: _.sample(periods, _.random(1, periods.length))
        };

        return _.extend(base, this._getUniqRequestDataPart());
    }
});