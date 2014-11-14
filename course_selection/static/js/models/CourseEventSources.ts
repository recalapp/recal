import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');
import ICourse = require('../interfaces/ICourse');
import SectionEventSource = require('./SectionEventSource');

class CourseEventSources implements IEventSources {
    private myCourse: ICourse;
    private sectionEventSources: IEventSource[];
    public id: number;

    constructor(course: ICourse) {
        this.myCourse = course;
        this.id = course.id;
    }

    private initSectionEventSources() {
        var sections = this.myCourse.sections;
        var sectionEventSources = [];
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionEventSource = new SectionEventSource(section, this.myCourse);
            sectionEventSources.push(sectionEventSource);
        }

        this.sectionEventSources = sectionEventSources;
    }

    public getEventSources(): IEventSource[] {
        return this.sectionEventSources;
    }
}

export = CourseEventSources;
