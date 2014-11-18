/// <reference path="../../../../nice/static/ts/typings/tsd.d.ts" />

import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    // TODO: create a model for [start, end, isPreview]
    private courseIdToIndices: { [id: number]: any};
    private myEventSources: IEventSource[];
    public isPreview: boolean;
    public id: number;

    constructor() {
        this.isPreview = false;
        this.id =  -1;
        this.courseIdToIndices = {};
        this.myEventSources = [];
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
            this.myEventSources[i] = <any>[];
        }

        delete this.courseIdToIndices[courseId];
    }
    
    public enrollInCourseSection(courseId: number, section_type: string, sectionId: number) {
        //var courseEventSources = this.myChildren[courseId];
        //courseEventSources.removeEventSourcesByType(section_type);
        //courseEventSources.addEventSourceById(sectionId);
        // courseEventSources.isPreview should be false
        //this.removeEventSources(courseId, courseEventSources.isPreview);
        // create a new courseEventSources
        // remove by section type
        // add by id
        // add courseEventSources back
    }
}

export = CompositeEventSources;
