import Module = require('../Module');

var niceDirectives = new Module('niceDirectives', []);

niceDirectives.addDirective('selectOnClick', [function() {
    return {
        restrict : 'A',
        link(scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    }
}]);

export = niceDirectives;
