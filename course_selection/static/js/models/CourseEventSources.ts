import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');
import ICourse = require('../interfaces/ICourse');
import IColorPalette = require('../interfaces/IColorPalette');
import SectionEventSource = require('./SectionEventSource');

class CourseEventSources implements IEventSources {
    private myCourse: ICourse;
    private myColors: IColorPalette;
    private sectionEventSources: IEventSource[];
    public isPreview: boolean;
    public id: number;

    constructor(course: ICourse, colors: IColorPalette, isPreview?: boolean) {
        this.myCourse = course;
        this.id = course.id;
        this.myColors = colors;
        this.initEventSources();
        this.isPreview = isPreview ? isPreview : false;
    }

    // create course event sources by looping over all sections
    // create a sectionEventSource using each section
    private initEventSources() {
        var sections = this.myCourse.sections;
        var eventSources = [];
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var eventSource: SectionEventSource = new SectionEventSource(section, this.myCourse, this.myColors.light);
            eventSources.push(eventSource);
        }

        this.sectionEventSources = eventSources;
    }

    public getEventSources(): IEventSource[] {
        return this.sectionEventSources;
    }
}

export = CourseEventSources;
