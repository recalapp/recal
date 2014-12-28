define(["require", "exports", '../Module'], function(require, exports, Module) {
    var niceDirectives = new Module('niceDirectives', []);

    niceDirectives.addDirective('selectOnClick', [function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
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
            };
        }]);

    niceDirectives.addDirective('autoFocus', [
        '$timeout', function ($timeout) {
            return {
                scope: {
                    trigger: '@focus'
                },
                link: function (scope, element) {
                    scope.$watch('trigger', function (trigger) {
                        if (trigger) {
                            $timeout(function () {
                                element[0].focus();
                            });
                        }
                    });
                }
            };
        }]);

    
    return niceDirectives;
});
//# sourceMappingURL=Directives.js.map
