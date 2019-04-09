function Select(el) {
    this.el = el;

    _.bindAll(this, 'select', 'deselect', 'isEnabled', 'getAttribute', 'value', 'options');
}

Select.prototype = {
    select: function(value, byText) {
        var selector;

        if (_.isUndefined(value)) {
            return promise.fulfilled();
        }

        if (byText) {
            selector = {xpath: 'option[text()="' + value + '"]'};
        } else {
            selector = {css: 'option[value="' + value + '"]'};
        }

        return this.el.findElements(selector).then(function(elements) {
            if (_.isEmpty(elements)) {
                return false;
            }

            return elements[0].click().then(function() {
                return true;
            });
        });
    },

    deselect: function() {
        return this.el.findElement({css: 'option:first-of-type'}).click();
    },

    isEnabled: function() {
        return this.el.isEnabled.apply(this.el, arguments);
    },

    getAttribute: function() {
        return this.el.getAttribute.apply(this.el, arguments);
    },

    value: function() {
        return this.el.getAttribute('value');
    },

    options: function() {
        return this.el.findElements({css: 'option'}).then(function(options) {
            return promise.map(options, function(option) {
                return option.getAttribute('value');
            });
        });
    }
};

module.exports = Select;