/// <reference path="../../ts/typings/tsd.d.ts" />
define(["require", "exports"], function (require, exports) {
    var CompositeEventSources = (function () {
        function CompositeEventSources() {
            this.isPreview = false;
            this.id = -1 + username;
            this.courseIdToIndices = {};
            this.myEventSources = [];
            this.backupEventSources = {};
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
            this.backupEventSources[eventSources.id] = angular.copy(eventSources.getEventSources());
            this.courseIdToIndices[eventSources.id] = {
                start: start,
                end: end,
                isPreview: eventSources.isPreview
            };
        };
        CompositeEventSources.prototype.removeEventSources = function (key, isPreview) {
            var indices = this.courseIdToIndices[key];
            if (!indices || indices.isPreview != isPreview) {
                return;
            }
            if (isPreview) {
                this.myEventSources.splice(indices.start, indices.end - indices.start + 1);
            }
            else {
                for (var i = indices.start; i <= indices.end; i++) {
                    this.myEventSources[i] = {};
                }
            }
            delete this.courseIdToIndices[key];
        };
        CompositeEventSources.prototype.enrollInCourseSection = function (courseId, sectionType, sectionId) {
            var eventSourceKey = courseId + username;
            this._removeAllCourseSection(eventSourceKey, sectionType);
            var eventSources = this.backupEventSources[eventSourceKey];
            var courseIndices = this.courseIdToIndices[eventSourceKey];
            for (var i = 0; i < eventSources.length; i++) {
                if (eventSources[i].id == sectionId) {
                    var newEventSources = angular.copy(eventSources[i]);
                    newEventSources.className = 'cal-confirmed';
                    this.myEventSources.splice(courseIndices.start + i, 1, newEventSources);
                    return;
                }
            }
        };
        CompositeEventSources.prototype._removeAllCourseSection = function (eventSourceKey, section_type) {
            var courseIndices = this.courseIdToIndices[eventSourceKey];
            if (!courseIndices) {
                throw "trying to remove " + section_type + " in course, but course is not found";
                return;
            }
            for (var i = courseIndices.start; i <= courseIndices.end; i++) {
                var curr = this.myEventSources[i];
                if (curr.section_type == section_type) {
                    this.myEventSources[i] = {};
                }
            }
        };
        CompositeEventSources.prototype.previewAllCourseSection = function (courseId, section_type) {
            var eventSourceKey = courseId + username;
            this._removeAllCourseSection(eventSourceKey, section_type);
            var eventSources = this.backupEventSources[eventSourceKey];
            var courseIndices = this.courseIdToIndices[eventSourceKey];
            for (var i = 0; i < eventSources.length; i++) {
                if (eventSources[i].section_type == section_type) {
                    var newEventSources = angular.copy(eventSources[i]);
                    this.myEventSources[courseIndices.start + i] = newEventSources;
                }
            }
        };
        CompositeEventSources.NOT_FOUND = 1;
        return CompositeEventSources;
    })();
    return CompositeEventSources;
});
