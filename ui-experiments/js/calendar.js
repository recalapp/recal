CAL_INIT = false;

$(document).ready(function() {
    Cal_init();
});

function Cal_init() {
    if (CAL_INIT)
        return;
    height = window.innerHeight - $(".navbar").height() - 50;
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
        eventSources: [{
            events: [
                {
                    id: "1",
                    title: "item 1",
                    start: 1396114200,
                    end: 1396117200
                }, {
                    id: "2",
                    title: "item 2",
                    start: 1396009800,
                    end: 1396012800
                }, {
                    id: "3",
                    title: "item 3",
                    start: 1396018800,
                    end: 1396023600
                }, {
                    id: "4",
                    title: "item 4",
                    start: 1396027800,
                    end: 1396032600
                }, {
                    id: "5",
                    title: "item 5",
                    start: 1395928800,
                    end: 1395931800
                }, {
                    id: "6",
                    title: "item 6",
                    start: 1395941400,
                    end: 1395944400
                }, {
                    id: "7",
                    title: "item 7",
                    start: 1395860400,
                    end: 1395865200
                }, {
                    id: "8",
                    title: "item 8",
                    start: 1395759600,
                    end: 1395764400
                }, {
                    id: "9",
                    title: "item 9",
                    start: 1395765000,
                    end: 1395768000
                }, {
                    id: "10",
                    title: "item 10",
                    start: 1395768600,
                    end: 1395773400
                }, {
                    id: "11",
                    title: "item 11",
                    start: 1395669600,
                    end: 1395674400
                }, {
                    id: "12",
                    title: "item 12",
                    start: 1395673200,
                    end: 1395678000
                }
            ]
        }],
        eventClick: function(calEvent, jsEvent, view) {
            if (calEvent.highlighted == true)
            {
                PopUp_giveFocus($(".popup").find("#"+calEvent.id).parent());
                return;
            }

            if (SHIFT_PRESSED)
            {
                Cal_highlightEvent(calEvent, true);
                calEvent.pinned = true;
                var popUp = PopUp_insertPopUp(null, false);
                PopUp_setID(popUp, calEvent.id);
                PopUp_setTitle(popUp, calEvent.title);
                PopUp_giveFocus(popUp);
                return;
            }

            $($("#calendarui").fullCalendar("clientEvents", function(calEvent) {
                return calEvent.pinned != true;
            })).each( function(index) {
                Cal_unhighlightEvent(this, false);
            });
            Cal_highlightEvent(calEvent, true);

            var popUp = PopUp_getMainPopUp(function() {
                calEvent.pinned = true;
            });
            PopUp_setID(popUp, calEvent.id);
            PopUp_setTitle(popUp, calEvent.title);
            PopUp_giveFocus(popUp);
        }
    });
    CAL_INIT = true;
    $(".tab-pane").each(function(index){
        if (this.id == "calendar")
        {
            $(this).bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function(e) {
                $($("#calendarui").fullCalendar("clientEvents")).each(function(index){
                    Cal_unhighlightEvent(this, false);
                });
                PopUp_map(function(popUp, isMain){
                    $($("#calendarui").fullCalendar("clientEvents", PopUp_getID(popUp))).each(function(index){
                        Cal_highlightEvent(this, false);
                        this.pinned = !isMain;
                    });
                });
                Cal_render();
            });
        }
    });
    PopUp_addCloseListener(function(id){
        $($("#calendarui").fullCalendar("clientEvents", id)).each(function (index){
            this.pinned = false;
            Cal_unhighlightEvent(this, true);
        });
    });
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

