var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../DataStructures/Set', '../CoreUI/View', './Tester'], function(require, exports, Set, View, Tester) {
    var ViewTester = (function (_super) {
        __extends(ViewTester, _super);
        function ViewTester(prefixMessage, view) {
            _super.call(this, prefixMessage);
            this._view = view;
        }
        ViewTester.prototype.run = function () {
            this._testAppend();
        };

        ViewTester.prototype._testAppend = function () {
            var childView = new View($('<div>'));

            // check if append works
            this._view.append(childView);
            var childrenSet = new Set(this._view.children);
            if (childrenSet.contains(childView)) {
                this.fails('Appended view does not appear in the list of children');
            }
        };
        return ViewTester;
    })(Tester);

    
    return ViewTester;
});
