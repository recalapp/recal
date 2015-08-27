define(["require", "exports"], function (require, exports) {
    var Schedule = (function () {
        function Schedule() {
        }
        Schedule.compare = function (a, b) {
            return a.id - b.id;
        };
        return Schedule;
    })();
    return Schedule;
});
//# sourceMappingURL=Schedule.js.map