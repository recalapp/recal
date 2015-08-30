define(["require", "exports"], function (require, exports) {
    var Semester = (function () {
        function Semester(name, active, current, term_code) {
            this.name = name;
            this.active = active;
            this.current = current;
            this.term_code = term_code;
        }
        Semester.compare = function (a, b) {
            return a.term_code - b.term_code;
        };
        return Semester;
    })();
    return Semester;
});
