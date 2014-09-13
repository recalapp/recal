import DateTime = require('../../../library/DateTime/DateTime');

export interface EventsModelConstructorArguments
{
    eventId: string;
    title: string;
    description: string;
    sectionId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
}

export interface IEventsModel
{
    eventId: string;
    title: string;
    description: string;
    sectionId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
}
