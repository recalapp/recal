/// <reference path="../../../../nice/static/ts/typings/tsd.d.ts" />
define(["require", "exports"], function(require, exports) {
    var CompositeEventSources = (function () {
        function CompositeEventSources() {
            this.isPreview = false;
            this.id = -1;
            this.courseIdToIndices = {};
            this.myEventSources = [];
        }
        // returns an array of IEventSource
        CompositeEventSources.prototype.getEventSources = function () {
            return this.myEventSources;
        };

        CompositeEventSources.prototype.addEventSources = function (eventSources) {
            if (this.courseIdToIndices[eventSources.id]) {
                // this means we are updating an eventSources
                // should first remove it
                this.removeEventSources(eventSources.id, true);
            }

            var start = this.myEventSources.length;
            var length = eventSources.getEventSources().length;
            var end = start + length - 1;
            this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
            this.courseIdToIndices[eventSources.id] = {
                start: start,
                end: end,
                isPreview: eventSources.isPreview
            };
        };

        CompositeEventSources.prototype.removeEventSources = function (courseId, isPreview) {
            var indices = this.courseIdToIndices[courseId];

            // only remove if isPreview matches
            if (!indices || indices.isPreview != isPreview) {
                return;
            }

            for (var i = indices.start; i <= indices.end; i++) {
                this.myEventSources[i] = [];
            }

            delete this.courseIdToIndices[courseId];
        };

        CompositeEventSources.prototype.enrollInCourseSection = function (courseId, section_type, sectionId) {
            //var courseEventSources = this.myChildren[courseId];
            //courseEventSources.removeEventSourcesByType(section_type);
            //courseEventSources.addEventSourceById(sectionId);
            // courseEventSources.isPreview should be false
            //this.removeEventSources(courseId, courseEventSources.isPreview);
            // create a new courseEventSources
            // remove by section type
            // add by id
            // add courseEventSources back
        };
        return CompositeEventSources;
    })();

    
    return CompositeEventSources;
});
