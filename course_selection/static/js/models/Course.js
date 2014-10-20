define(["require", "exports"], function(require, exports) {
    var Course = (function () {
        function Course(title, shown) {
            this.title = title;
            this.shown = shown;
        }
        return Course;
    })();

    
    return Course;
});
