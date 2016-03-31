/// <reference path="../../ts/typings/tsd.d.ts" />

import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    // TODO: create a model for [start, end, isPreview]
    private static NOT_FOUND: number = 1;
    private courseIdToIndices: { [id: number]: any};
    private myEventSources: IEventSource[];
    private backupEventSources: {[id: number]: IEventSource[]};
    public isPreview: boolean;
    public id: number;

    constructor() {
        this.isPreview = false;
        this.id =  -1;
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

    public removeEventSources(courseId: number, isPreview: boolean): void {
        var indices = this.courseIdToIndices[courseId];
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

        delete this.courseIdToIndices[courseId];
    }
    
    public enrollInCourseSection(courseId: number, sectionType: string, sectionId: number): void {
        this.removeAllCourseSection(courseId, sectionType);

        // now we add the section back
        var eventSources: IEventSource[] = this.backupEventSources[courseId];
        var courseIndices = this.courseIdToIndices[courseId];
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

    private removeAllCourseSection(courseId: number, section_type: string): void {
        var courseIndices = this.courseIdToIndices[courseId];
        if (!courseIndices) {
            throw "trying to remove " + section_type + " in course, but course is not found";
            //return; // unreachable
        }

        for (var i = courseIndices.start; i <= courseIndices.end; i++) {
            var curr = this.myEventSources[i];
            if (curr.section_type == section_type) {
                this.myEventSources[i] = <any>{};
            }
        }
    }

    private highlightEventSource(sectionEventSource: IEventSource) {
        sectionEventSource.backgroundColor = sectionEventSource.borderColor;
        sectionEventSource.textColor = 'white';
    }

    // add all sections of type section_type back
    public previewAllCourseSection(courseId: number, section_type: string): void {
        this.removeAllCourseSection(courseId, section_type);

        var eventSources = this.backupEventSources[courseId];
        var courseIndices = this.courseIdToIndices[courseId];
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
