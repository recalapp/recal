import Color = require('../../../library/Color/Color');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import EventsModel = require('./EventsModel');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import Set = require('../../../library/DataStructures/Set');
import UserProfiles = require('../UserProfiles/UserProfiles');

import IEventsModel = Events.IEventsModel;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class EventsModificationsManager
{
    private _addedEventsCount = 0;
    private get addedEventsCount(): number { return this._addedEventsCount; }
    private set addedEventsCount(value: number) { this._addedEventsCount = value; }

    private _modifiedEventIds: Set<string> = null;
    private get modifiedEventIds(): Set<string> { return this._modifiedEventIds; }

    private set modifiedEventIds(value: Set<string>)
    {
        this._modifiedEventIds = value;
    }

    private _eventsStoreCoordinator: EventsStoreCoordinator = null;
    private get eventsStoreCoordinator(): EventsStoreCoordinator { return this._eventsStoreCoordinator; }

    constructor(dependencies: Events.EventsModificationsManagerDependencies)
    {
        this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
        this.clearModificationsHistory();
    }

    /**
     * Clear out the history of modified events.
     */
    public clearModificationsHistory()
    {
        this.modifiedEventIds = new Set<string>();
    }

    /**
     * returns true if there are modified events
     */
    public hasModifiedEvents()
    {
        return this.modifiedEventIds && this.modifiedEventIds.size() > 0;
    }

    /**
     * Tells the events module that an event has been modified to be
     * modifiedEventsModel
     */
    public commitModifiedEvent(modifiedEventsModel: IEventsModel): void
    {
        this.modifiedEventIds.add(modifiedEventsModel.eventId);
        this.eventsStoreCoordinator.addLocalEvents([modifiedEventsModel]);
    }

    public getModifiedEvents(): IEventsModel[]
    {
        return this.modifiedEventIds.toArray().map((eventId: string)=>{
            return this.eventsStoreCoordinator.getEventById(eventId);
        });
    }

    /**
     * Creates a new event
     */
    public createNewEventsModelForUser(user: IUserProfilesModel): IEventsModel
    {
        var eventId = (++this.addedEventsCount * -1).toString();
        var sectionId = '-1';
        var courseId = '-1';
        var color = new Color();
        if (user.enrolledCoursesModels.length > 0)
        {
            var course = user.enrolledCoursesModels[0];
            courseId = course.courseId;
            sectionId = course.sectionsModels[0].sectionId;
            color = course.sectionsModels[0].color;
        }
        var eventTypeCode = 'LE';
        if (user.eventTypes.allKeys().length > 0)
        {
            eventTypeCode = user.eventTypes.allKeys()[0];
        }
        var startDate = new DateTime();
        if (startDate.hours == 23)
        {
            startDate.hours = 18;
        }
        startDate.seconds = 0;
        var endDate = new DateTime(startDate);
        endDate.minutes += 50;
        return new EventsModel({
            eventId: eventId,
            title: 'Title',
            description: 'Add a description...',
            location: 'Location',
            sectionId: sectionId,
            courseId: courseId,
            eventTypeCode: eventTypeCode,
            startDate: startDate,
            endDate: endDate,
            lastEdited: new DateTime(),
            eventGroupId: eventId,
            sectionColor: color,
            revisionId: eventId,
        });
    }

}

export = EventsModificationsManager;
