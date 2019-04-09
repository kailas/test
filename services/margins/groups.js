module.exports = serviceRequire('content/groups').extend({
    getUri: 'margingroup/flight',

    uri: 'margingroup/flight/id',

    rulesService: serviceRequire('margins/rules'),

    _namePrefix: 'FMG'
});