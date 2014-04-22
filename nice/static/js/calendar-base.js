CAL_INIT = false;
Cal_eventSource = {
    events:[],
}
Cal_options = {
    "defaultView": "agendaWeek",
    "slotMinutes": 30,
    "firstHour": 8,
    "minTime": 8,
    "maxTime": 23,
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
