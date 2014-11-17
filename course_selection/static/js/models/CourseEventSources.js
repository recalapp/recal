define(["require", "exports", './SectionEventSource'], function(require, exports, SectionEventSource) {
    var CourseEventSources = (function () {
        function CourseEventSources(course, colors, isPreview) {
            this.myCourse = course;
            this.id = course.id;
            this.myColors = colors;
            this.initEventSources();
            this.isPreview = isPreview ? isPreview : false;
        }
        // create course event sources by looping over all sections
        // create a sectionEventSource using each section
        CourseEventSources.prototype.initEventSources = function () {
            var sections = this.myCourse.sections;
            var eventSources = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var eventSource = new SectionEventSource(section, this.myCourse, this.myColors.light);
                eventSources.push(eventSource);
            }

            this.sectionEventSources = eventSources;
        };

        CourseEventSources.prototype.getEventSources = function () {
            return this.sectionEventSources;
        };
        return CourseEventSources;
    })();

    
    return CourseEventSources;
});
