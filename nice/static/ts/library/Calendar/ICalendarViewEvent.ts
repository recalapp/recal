import DateTime = require('../../library/DateTime/DateTime');

interface ICalendarViewEvent
{
    uniqueId: string;
    title: string;
    start: DateTime;
    end: DateTime;
    highlighted: boolean;
    sectionColor: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
}

export = ICalendarViewEvent;
