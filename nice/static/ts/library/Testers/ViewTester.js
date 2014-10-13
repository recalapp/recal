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
            var _this = this;
            var childView = new View($('<div>'));

            // check if append works
            this._view.append(childView);
            var childrenSet = new Set(this._view.children);
            this.assert(childrenSet.contains(childView), 'Appended view does not appear in the list of children');

            // check if parentView has been set
            this.assert(childView.parentView === this._view, 'parentView property does not reflect the change by append()');

            // check if a view can be added twice
            var passed = this.tryInvalidCommand(function () {
                _this._view.append(childView);
            });
            this.assert(passed, 'View does not check if a child view is already a children');

            // check if a view with parent can be added
            var childViewTwo = new View($('<div>'));
            var parentView = new View($('<div>'));
            parentView.append(childViewTwo);
            var passed = this.tryInvalidCommand(function () {
                _this._view.append(childViewTwo);
            });
            this.assert(passed, 'View does not check if a child view already has a parent');
        };

        ViewTester.prototype._testRemoveFromParent = function () {
            // assumes append() works
            var childView = new View($('<div>'));
            this._view.append(childView);

            // check if remove from parent works
            childView.removeFromParent();
            var childrenSet = new Set(this._view.children);
            this.assert(!childrenSet.contains(childView), 'Removed view appears in the list of children');
            this.assert(childView.parentView === null, 'parentView is not set to null after removing from parent');

            // check if an exception is thrown if a view without parent calls removeFromParent()
            var passed = this.tryInvalidCommand(function () {
                childView.removeFromParent();
            });
            this.assert(passed, 'An exception is not thrown when a view without parent calls removeFromParent()');
        };
        return ViewTester;
    })(Tester);

    
    return ViewTester;
});
