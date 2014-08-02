var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/AbstractMethodException', '../../library/CoreUI/ViewController'], function(require, exports, AbstractMethodException, ViewController) {
    var CalendarViewController = (function (_super) {
        __extends(CalendarViewController, _super);
        function CalendarViewController() {
            _super.apply(this, arguments);
        }
        CalendarViewController.prototype.getCalendarViewEvents = function () {
            throw new AbstractMethodException();
        };
        return CalendarViewController;
    })(ViewController);

    
    return CalendarViewController;
});
