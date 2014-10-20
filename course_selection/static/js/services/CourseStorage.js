define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseStorage = (function () {
        function CourseStorage() {
            this.STORAGE_ID = 'nice-course-storage';
        }
        CourseStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };

        CourseStorage.prototype.put = function (courses) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(courses));
        };
        return CourseStorage;
    })();

    
    return CourseStorage;
});
