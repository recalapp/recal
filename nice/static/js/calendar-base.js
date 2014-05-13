// REQUIRES FullCalendar plugin
var CAL_LOADING = false;
var FACTOR_LUM = 0.2;
var FACTOR_TRANS = 0.7;

CAL_INIT = false;
// event source for FullCalendar
Cal_eventSource = {
    events:[],
}
// default options
Cal_options = {
    defaultView: "agendaWeek",
    slotMinutes: 30,
    firstHour: 8,
    minTime: 8,
    maxTime: 23,
    eventDurationEditable: false,
    eventStartEditable: false,
    eventBackgroundColor: "#74a2ca",
    eventBorderColor: "#428bca",
    allDayDefault: false,
    eventSources: [Cal_eventSource],
    ignoreTimezone: false,
    allDaySlot: false,
    slotEventOverlap: true,
};
function Cal_init(){};

function Cal_highlightEvent(calEvent, update)
{
    if (!calEvent.highlighted)
    {
        calEvent.backgroundColor = setOpacity(calEvent.backgroundColor, 1.0);
        calEvent.textColor = '#ffffff';
    }
    calEvent.highlighted = true;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).addClass("event-selected");
}
function Cal_unhighlightEvent(calEvent, update)
{
    // delete calEvent["backgroundColor"];
    if (calEvent.highlighted)
    {
        calEvent.textColor = calEvent.myColor;
        calEvent.backgroundColor = setOpacity(calEvent.backgroundColor, FACTOR_TRANS);
    }
    calEvent.highlighted = false;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).removeClass("event-selected");
}

