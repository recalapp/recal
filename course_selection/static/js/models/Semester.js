define(["require", "exports"], function(require, exports) {
    var Semester = (function () {
        function Semester(title, active, current, term_code) {
            this.title = title;
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
