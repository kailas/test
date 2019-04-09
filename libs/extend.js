var extend = function(props) {
    var parent = this;
    var child = function() {
        return parent.apply(this, arguments);
    };

    _.extend(child, parent);

    var Surrogate = function() {
        this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    if (props) {
        _.extend(child.prototype, props);
    }

    child.__parent__ = parent.prototype;

    return child;
};

Function.prototype.extend = extend;