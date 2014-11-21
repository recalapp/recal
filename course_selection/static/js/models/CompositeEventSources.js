define(["require", "exports"], function(require, exports) {
    var CompositeEventSources = (function () {
        function CompositeEventSources() {
            this.isPreview = false;
            this.id = -1;
            this.courseIdToIndices = {};
            this.myEventSources = [];
            this.backupEventSources = [];
        }
        CompositeEventSources.prototype.getEventSources = function () {
            return this.myEventSources;
        };

        CompositeEventSources.prototype.addEventSources = function (eventSources) {
            if (this.courseIdToIndices[eventSources.id]) {
                this.removeEventSources(eventSources.id, true);
            }

            var start = this.myEventSources.length;
            var length = eventSources.getEventSources().length;
            var end = start + length - 1;
            this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
            this.backupEventSources[eventSources.id] = eventSources.getEventSources();
            this.courseIdToIndices[eventSources.id] = {
                start: start,
                end: end,
                isPreview: eventSources.isPreview
            };
        };

        CompositeEventSources.prototype.removeEventSources = function (courseId, isPreview) {
            var indices = this.courseIdToIndices[courseId];

            if (!indices || indices.isPreview != isPreview) {
                return;
            }

            for (var i = indices.start; i <= indices.end; i++) {
                this.myEventSources[i] = {};
            }

            delete this.courseIdToIndices[courseId];
        };

        CompositeEventSources.prototype.enrollInCourseSection = function (courseId, section_type, sectionId) {
            var courseIndices = this.courseIdToIndices[courseId];
            if (!courseIndices) {
                throw "trying to enroll in a section in course, but course is not found";
                return;
            }

            var isFound = false;
            var emptySlotIdx = -1;
            for (var i = courseIndices.start; i <= courseIndices.end; i++) {
                var curr = this.myEventSources[i];
                if (!curr.id) {
                    emptySlotIdx = i;
                } else if (curr.section_type == section_type) {
                    if (curr.id != sectionId) {
                        this.myEventSources[i] = {};
                        emptySlotIdx = i;
                    } else {
                        isFound = true;
                    }
                }
            }

            if (isFound) {
                return;
            }

            var eventSources = this.backupEventSources[courseId];
            for (var j = 0; j < eventSources.length; j++) {
                if (eventSources[j].id == sectionId) {
                    this.myEventSources[emptySlotIdx] = eventSources[j];
                    return;
                }
            }
        };

        CompositeEventSources.prototype.previewAllCourseSection = function (courseId, section_type) {
            var courseIndices = this.courseIdToIndices[courseId];
            if (!courseIndices) {
                throw "trying to preview " + section_type + " in course, but course is not found";
                return;
            }

            for (var i = courseIndices.start; i <= courseIndices.end; i++) {
                var curr = this.myEventSources[i];
                if (curr.section_type == section_type) {
                    this.myEventSources[i] = {};
                }
            }

            var eventSources = this.backupEventSources[courseId];
            i = courseIndices.start;
            for (var j = 0; j < eventSources.length; j++) {
                if (eventSources[j].section_type == section_type) {
                    while (this.myEventSources[i].id && i <= courseIndices.end) {
                        i++;
                    }

                    this.myEventSources[i] = eventSources[j];
                }
            }
        };
        return CompositeEventSources;
    })();

    
    return CompositeEventSources;
});
//# sourceMappingURL=CompositeEventSources.js.map
