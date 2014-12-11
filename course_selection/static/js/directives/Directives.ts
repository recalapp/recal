import Module = require('../Module');

var niceDirectives = new Module('niceDirectives', []);

niceDirectives.addDirective('selectOnClick', [function() {
    return {
        restrict: 'A',
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

// TODO: this is not really autofocus; still requires focus="true" in the html
niceDirectives.addDirective('autoFocus', ['$timeout', ($timeout) => {
    return {
        scope : {
            trigger : '@focus'
        },
        link : (scope, element) => {
            scope.$watch('trigger', (trigger) => {
                if (trigger) {
                    $timeout(() => {
                        element[0].focus();
                    });
                }
            });
        }
    };
}]);

export = niceDirectives;
