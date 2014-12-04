define(["require", "exports"], function(require, exports) {
    var SelectOnClick = (function () {
        function SelectOnClick() {
        }
        SelectOnClick.link = function (scope, element) {
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
        };
        SelectOnClick.restrict = 'A';
        return SelectOnClick;
    })();

    
    return SelectOnClick;
});
//# sourceMappingURL=SelectOnClick.js.map
