define(["require", "exports", './SectionEventSource'], function (require, exports, SectionEventSource) {
    var CourseEventSources = (function () {
        function CourseEventSources(course, colors, isPreview, netid) {
            this.myCourse = course;
            this.id = netid ? course.id + netid : course.id + username;
            this.myColors = colors;
            this.initEventSources();
            this.isPreview = isPreview ? isPreview : false;
        }
        CourseEventSources.prototype.initEventSources = function () {
            var sections = this.myCourse.sections;
            this.allSections = [];
            this.mySections = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var eventSource = new SectionEventSource(section, this.myCourse, this.myColors);
                this.allSections.push(eventSource);
                this.mySections.push(eventSource);
            }
        };
        CourseEventSources.prototype.getEventSources = function () {
            return this.mySections;
        };
        return CourseEventSources;
    })();
    return CourseEventSources;
});
