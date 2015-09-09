/// <reference path="../../ts/typings/tsd.d.ts" />

import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

declare var username: string;

interface ICourseIndex {
    start: number;
    end: number;
    isPreview: boolean;
}

type EventSourceKey = string;

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    private static NOT_FOUND: number = 1;
    private courseIdToIndices: { [id: string]: ICourseIndex};
    private myEventSources: IEventSource[];
    private backupEventSources: {[id: string]: IEventSource[]};
    public isPreview: boolean;
    public id: string;

    constructor() {
        this.isPreview = false;
        this.id = -1 + username;
        this.courseIdToIndices = {};
        this.myEventSources = [];
        this.backupEventSources = {};
    }

    // returns an array of IEventSource
    public getEventSources(): IEventSource[] {
        return this.myEventSources;
    }

    public addEventSources(eventSources: IEventSources): void {
        if (this.courseIdToIndices[eventSources.id]) {
            // this means we are updating a previewed eventSources
            // should first remove it
            this.removeEventSources(eventSources.id, true);
        }

        var start: number = this.myEventSources.length;
        var length: number = eventSources.getEventSources().length;
        var end = start + length - 1;
        this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
        this.backupEventSources[eventSources.id] = angular.copy(eventSources.getEventSources());
        this.courseIdToIndices[eventSources.id] = {
            start: start,
            end: end,
            isPreview: eventSources.isPreview
        };
    }

    public removeEventSources(key: EventSourceKey, isPreview: boolean): void {
        var indices = this.courseIdToIndices[key];
        // only remove if isPreview matches
        if (!indices || indices.isPreview != isPreview) {
            return;
        }

        // if this course is previewed, then we know it is at
        // the end of myEventSources, we can safely splice them
        if (isPreview) {
            this.myEventSources.splice(indices.start, indices.end - indices.start + 1);
        }
        else {
            for (var i = indices.start; i <= indices.end; i++) {
                this.myEventSources[i] = <any>{};
            }
        }

        delete this.courseIdToIndices[key];
    }

    public enrollInCourseSection(courseId: number, sectionType: string, sectionId: number): void {
        var eventSourceKey = courseId + username;
        this._removeAllCourseSection(eventSourceKey, sectionType);

        // now we add the section back
        var eventSources: IEventSource[] = this.backupEventSources[eventSourceKey];
        var courseIndices = this.courseIdToIndices[eventSourceKey];
        for (var i = 0; i < eventSources.length; i++) {
            if (eventSources[i].id == sectionId) {
                var newEventSources = angular.copy(eventSources[i]);
                // newEventSources.textColor = 'white';
                // newEventSources.backgroundColor = newEventSources.borderColor;
                newEventSources.className = 'cal-confirmed';
                this.myEventSources.splice(courseIndices.start + i, 1, newEventSources);
                return;
            }
        }
    }

    private _removeAllCourseSection(eventSourceKey: EventSourceKey, section_type: string): void {
        var courseIndices = this.courseIdToIndices[eventSourceKey];
        if (!courseIndices) {
            throw "trying to remove " + section_type + " in course, but course is not found";
            return;
        }

        for (var i = courseIndices.start; i <= courseIndices.end; i++) {
            var curr = this.myEventSources[i];
            if (curr.section_type == section_type) {
                this.myEventSources[i] = <any>{};
            }
        }
    }

    // private highlightEventSource(sectionEventSource: IEventSource) {
    //     sectionEventSource.backgroundColor = sectionEventSource.borderColor;
    //     sectionEventSource.textColor = 'white';
    // }

    // add all sections of type section_type back
    public previewAllCourseSection(courseId: number, section_type: string): void {
        var eventSourceKey = courseId + username;
        this._removeAllCourseSection(eventSourceKey, section_type);

        var eventSources = this.backupEventSources[eventSourceKey];
        var courseIndices = this.courseIdToIndices[eventSourceKey];
        for (var i = 0; i < eventSources.length; i++) {
            if (eventSources[i].section_type == section_type) {
                // add this eventSource back
                var newEventSources = angular.copy(eventSources[i]);
                this.myEventSources[courseIndices.start + i] = newEventSources;
            }
        }
    }
}

export = CompositeEventSources;
