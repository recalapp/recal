/// <reference path="../../../../nice/static/ts/typings/tsd.d.ts" />

import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    // TODO: create a model for [start, end, isPreview]
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
        if (!courseIndices) {
            throw "trying to enroll in a section in course, but course is not found";
            return;
        }

        var isFound: number = -1;
        var emptySlotIdx = -1;
        for (var i = courseIndices.start; i <= courseIndices.end; i++) {
            var curr = this.myEventSources[i];
            if (!curr.id) {
                emptySlotIdx = i;
            } 
            else if (curr.section_type == section_type) {
                // remove all other eventSources for this course
                // with the same section type
                if (curr.id != sectionId) {
                    this.myEventSources[i] = <any>{};
                    emptySlotIdx = i;
                } else {
                    isFound = i;
                }
            }
        }

        // this section was already previewed
        if (isFound != -1) {
            this.highlightEventSource(this.myEventSources[i]);
            return;
        }

        // else, we didn't find this section, and need to add it manually
        var eventSources: IEventSource[] = this.backupEventSources[courseId];
        for (var j = 0; j < eventSources.length; j++) {
            if (eventSources[j].id == sectionId) {
                this.myEventSources[emptySlotIdx] = eventSources[j];
                this.highlightEventSource(this.myEventSources[emptySlotIdx]);
                return;
            }
        }
    }

    private highlightEventSource(sectionEventSource: IEventSource) {
        // TODO: finish this
    }

    // add all sections back
    public previewAllCourseSection(courseId: number, section_type: string): void {
        var courseIndices = this.courseIdToIndices[courseId];
        if (!courseIndices) {
            throw "trying to preview " + section_type + " in course, but course is not found";
            return;
        }

        // first remove all sections of this type
        for (var i = courseIndices.start; i <= courseIndices.end; i++) {
            var curr = this.myEventSources[i];
            if (curr.section_type == section_type) {
                this.myEventSources[i] = <any>{};
            }
        }

        // then add all back
        var eventSources: IEventSource[] = this.backupEventSources[courseId];
        i = courseIndices.start;
        for (var j = 0; j < eventSources.length; j++) {
            if (eventSources[j].section_type == section_type) {
                // add this eventSource back
                while (this.myEventSources[i].id && i <= courseIndices.end) {
                    i++;
                }

                this.myEventSources[i] = eventSources[j];
            }
        }
    }
}

export = CompositeEventSources;
