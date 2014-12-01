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
            this.allSections = [];
            this.mySections = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var eventSource = new SectionEventSource(section, this.myCourse, this.myColors);
                this.allSections.push(eventSource);
                this.mySections.push(eventSource);
            }
        };

        // public removeEventSourcesByType(type: string): void {
        //     this.mySections.filter((sectionEventSource) => {
        //         return sectionEventSource.section_type == type;
        //     });
        // }
        // public addEventSourceById(id: number): void {
        //     for (var i = 0; i < this.allSections.length; i++) {
        //         if (this.allSections[i].id == id) {
        //             this.mySections.push(this.allSections[i]);
        //         }
        //     }
        // }
        CourseEventSources.prototype.getEventSources = function () {
            return this.mySections;
        };
        return CourseEventSources;
    })();

    
    return CourseEventSources;
});
