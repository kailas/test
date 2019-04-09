var Cookies = require('./cookies'),
    RequestBuilder = require('request'),
    Request;

Request = function(driver) {
    this.driver = driver;
    this.cookies = new Cookies(this.driver);

    this._requestBuilder = RequestBuilder;

    _.bindAll(this, '_initRequest');
};

Request.prototype = {
    get: function(options) {
        options || (options = {});

        return this._request(_.extend({}, options, {method: 'GET'}));
    },

    post: function(options) {
        options || (options = {});

        return this._request(_.extend({}, options, {method: 'POST'}));
    },

    put: function(options) {
        options || (options = {});

        return this._request(_.extend({}, options, {method: 'PUT'}));
    },

    delete: function(options) {
        options || (options = {});

        return this._request(_.extend({}, options, {method: 'DELETE'}));
    },

    _request: function(options) {
        var requestOptions;

        options || (options = {});

        requestOptions = _.extend({}, _.pick(options, 'uri', 'method'));

        try {
            if (requestOptions.method === 'GET') {
                requestOptions.qs = options.data
            } else {
                requestOptions.body = JSON.stringify(options.data);
            }
        } catch (e) {
            console.log(_colors.cyan, 'Can\'t parse the request data');
            throw e;
        }

        return this._createRequest().then(function(request) {
            return new Promise(function(done, fail) {
                request(requestOptions, function(error, response, body) {
                    if (!_.isNull(error)) {
                        _.isFunction(fail) && fail(error);

                        return ;
                    }

                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        console.log(_colors.cyan, 'Can\'t parse the response');
                        throw e;
                    }

                    _.isFunction(done) && done(body);
                });
            });
        });
    },

    _createRequest: function() {
        return this.cookies.get().then(this._initRequest);
    },

    _initRequest: function(cookies) {
        return this._requestBuilder.defaults({
            baseUrl: BASEURL,
            headers: {
                'Cookie': cookies
            }
        });
    }
};

module.exports = Request;