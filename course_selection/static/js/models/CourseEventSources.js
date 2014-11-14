define(["require", "exports", './SectionEventSource'], function(require, exports, SectionEventSource) {
    var CourseEventSources = (function () {
        function CourseEventSources(course) {
            this.myCourse = course;
            this.id = course.id;
        }
        CourseEventSources.prototype.initSectionEventSources = function () {
            var sections = this.myCourse.sections;
            var sectionEventSources = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var sectionEventSource = new SectionEventSource(section, this.myCourse);
                sectionEventSources.push(sectionEventSource);
            }

            this.sectionEventSources = sectionEventSources;
        };

        CourseEventSources.prototype.getEventSources = function () {
            return this.sectionEventSources;
        };
        return CourseEventSources;
    })();

    
    return CourseEventSources;
});
