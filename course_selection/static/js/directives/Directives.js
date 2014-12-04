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

    
    return niceDirectives;
});
//# sourceMappingURL=Directives.js.map
