var LoginPage = pageRequire('login'),
    EditGroupPage = pageRequire('content/editGroup'),
    GroupsPage = pageRequire('content/groups'),
    Modal = elementRequire('modal'),
    Loader = elementRequire('loader');
    GroupsService = serviceRequire('content/groups');

describe('Edit Content Group Page', function() {
    var driver,
        login,
        page,
        groupsPage,
        modal,
        loader,
        Service,
        IATAList;

    beforeAll(function(done) {
        driver = getDriver();
        login = new LoginPage(driver);
        page = new EditGroupPage(driver);
        groupsPage = new GroupsPage(driver);
        modal = new Modal(driver);
        loader = new Loader(driver, {
            visibleTimeoutInterval: 2000,
            hiddenTimeoutInterval: 10000
        });
        Service = new GroupsService(driver);

        IATAList = ['JFK', 'FRA', 'CDG', 'LHR'];

        login.loginAsTTAdmin().then(done);
    }, 20000);

    describe('Destination level without any rules assigned', function() {
        var Group;

        beforeEach(function(done) {
            Service
                .createAtDestinationLevel()
                .then(function(group) {
                    Group = group;

                    return page
                        .setId(group.id)
                        .visit()
                        .then(loader.blinks)
                        .then(loader.blinks)
                        .then(done);
                });
        }, 20000);

        it('Should allow to change the hierarchy level', function(done) {
            page
                .getDepartureIATAElement()
                .select(IATAList)
                .then(page.save)
                .then(loader.blinks)
                .then(modal.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(modal.getText)
                .then(function(text) {
                    expect(text).toContain(Group.name);
                })
                .then(done);
        }, 10000);

        afterEach(function(done) {
            Service.delete(Group.id).then(done);
        }, 10000);
    });

    describe('Destination level with rules assigned', function() {
        var Group;

        beforeEach(function(done) {
            Service
                .createAtDestinationLevel(true)
                .then(function(group) {
                    Group = group;

                    return page
                        .setId(group.id)
                        .visit()
                        .then(loader.blinks)
                        .then(loader.blinks)
                        .then(done);
                });
        }, 20000);

        it('Should not allow to change the hierarchy level', function(done) {
            page
                .getDepartureIATAElement()
                .select(IATAList)
                .then(page.save)
                .then(loader.blinks)
                .then(modal.isOpen)
                .then(function(isOpen) {
                    expect(isOpen).toBe(true);
                })
                .then(modal.getText)
                .then(function(text) {
                    expect(text).toContain(i18n('notPossibleToChangeHierarchyLevel'));
                })
                .then(done);
        }, 10000);

        afterEach(function(done) {
            Service.delete(Group.id).then(done);
        }, 10000);
    });

    afterEach(function(done) {
        modal
            .isOpen()
            .then(function(isOpen) {
                if (isOpen) {
                    return modal.submit();
                }
            })
            .then(done);
    }, 10000);

    afterAll(function(done) {
        page.quit().then(done);
    }, 10000);
});