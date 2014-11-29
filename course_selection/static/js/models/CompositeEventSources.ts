/// <reference path="../../../../nice/static/ts/typings/tsd.d.ts" />

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
        this.backupEventSources = [];
    }

    // returns an array of IEventSource
    public getEventSources(): IEventSource[] {
        return this.myEventSources;
    }

    public addEventSources(eventSources: IEventSources): void {
        if (this.courseIdToIndices[eventSources.id]) {
            // this means we are updating an eventSources
            // should first remove it
            this.removeEventSources(eventSources.id, true);
        }

        var start: number = this.myEventSources.length;
        var length: number = eventSources.getEventSources().length;
        var end = start + length - 1;
        this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
        this.backupEventSources[eventSources.id] = eventSources.getEventSources();
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

        for (var i = indices.start; i <= indices.end; i++) {
            this.myEventSources[i] = <any>{};
        }

        delete this.courseIdToIndices[courseId];
        // TODO: should we remove backup?
    }
    
    public enrollInCourseSection(courseId: number, section_type: string, sectionId: number): void {
        var courseIndices = this.courseIdToIndices[courseId];
        this.removeAllCourseSection(courseId, section_type);

        // now we add the section back
        var eventSources: IEventSource[] = this.backupEventSources[courseId];
        for (var j = 0; j < eventSources.length; j++) {
            if (eventSources[j].id == sectionId) {
                this.myEventSources[courseIndices.start + j] = eventSources[j];
                return;
            }
        }
    }

    private removeAllCourseSection(courseId: number, section_type: string): void {
        var courseIndices = this.courseIdToIndices[courseId];
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

    private highlightEventSource(sectionEventSource: IEventSource) {
        sectionEventSource.backgroundColor = sectionEventSource.borderColor;
        sectionEventSource.textColor = 'white';
    }

    // add all sections of type section_type back
    public previewAllCourseSection(courseId: number, section_type: string): void {
        this.removeAllCourseSection(courseId, section_type);

        var eventSources = this.backupEventSources[courseId];
        var courseIndices = this.courseIdToIndices[courseId];
        for (var j = 0; j < eventSources.length; j++) {
            if (eventSources[j].section_type == section_type) {
                // add this eventSource back
                this.myEventSources[courseIndices.start + j] = eventSources[j];
            }
        }
    }
}

export = CompositeEventSources;
