CAL_INIT = false;
Cal_eventSource = {
    events:[],
}

$(document).ready(function() {
    //Cal_init();
});

//eventSources: [{
//    events: [{
//            id: "1",
//            title: "item 1",
//            start: 1396114200,
//            end: 1396117200
//        }]
//}],


function Cal_init() {
    if (CAL_INIT)
        return;
    height = window.innerHeight - $(".navbar").height() - 50;

    EventsMan_addUpdateListener(function(){
        Cal_reload();
    });

    $("#calendarui").fullCalendar({
        "defaultView": "agendaWeek",
        "slotMinutes": 30,
        "firstHour": 8,
        "minTime": 8,
        "maxTime": 23,
        "height": height,
        eventDurationEditable: false,
        eventStartEditable: false,
        eventBackgroundColor: "#74a2ca",
        eventBorderColor: "#428bca",
        allDayDefault: false,
        eventSources: [Cal_eventSource],
        eventClick: function(calEvent, jsEvent, view) {
            if (calEvent.highlighted == true)
            {
                PopUp_giveFocusToID(calEvent.id);
                return;
            }

            if (SHIFT_PRESSED)
            {
                Cal_highlightEvent(calEvent, true);
                UI_pin(calEvent.id);
                var popUp = PopUp_insertPopUp(false);
                PopUp_setToEventID(popUp, calEvent.id);
                PopUp_giveFocus(popUp);
                return;
            }

            $($("#calendarui").fullCalendar("clientEvents", function(calEvent) {
                return !UI_isPinned(calEvent.id)
            })).each( function(index) {
                Cal_unhighlightEvent(this, false);
            });
            Cal_highlightEvent(calEvent, true);
            UI_setMain(calEvent.id);

            var popUp = PopUp_getMainPopUp();
            PopUp_setFirstDrag(popUp, function() {
                UI_pin(calEvent.id);
            })

            PopUp_setToEventID(popUp, calEvent.id);
            PopUp_giveFocus(popUp);
        }
    });
    CAL_INIT = true;
    $(".tab-pane").each(function(index){
        if (this.id == "calendar")
        {
            $(this).bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function(e) {
                if ($(this).hasClass('in'))
                {
                    Cal_render();
                    Cal_reload();
                }
            });
        }
    });
    PopUp_addCloseListener(function(id){
        $($("#calendarui").fullCalendar("clientEvents", id)).each(function (index){
            UI_unpin(this.id)
            Cal_unhighlightEvent(this, true);
        });
    });
}
function Cal_reload()
{
    var endDate = moment().add('months', 3).unix();
    var startDate = moment().subtract('months', 3).unix();
    var eventIDs = EventsMan_getEventIDForRange(startDate, endDate);
    Cal_eventSource.events = [];
    $.each(eventIDs, function(index){
        eventDict = EventsMan_getEventByID(this);
        var shouldHighlight = UI_isPinned(this) || UI_isMain(this);
        Cal_eventSource.events.push({
            id: eventDict.event_id,
            title: eventDict.event_title,
            start: eventDict.event_start,
            end: eventDict.event_end,
            highlighted: shouldHighlight,
            backgroundColor: shouldHighlight ? '#428be8' : '#74a2ca'
        });
    });
    $("#calendarui").fullCalendar("refetchEvents");
}

function Cal_render() {
    $("#calendarui").fullCalendar("render");
}

function Cal_highlightEvent(calEvent, update)
{
    calEvent.backgroundColor = "#428be8";
    calEvent.highlighted = true;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).addClass("event-selected");
}
function Cal_unhighlightEvent(calEvent, update)
{
    delete calEvent["backgroundColor"];
    calEvent.highlighted = false;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).removeClass("event-selected");
}

