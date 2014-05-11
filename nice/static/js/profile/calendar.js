function Cal_init() {
    if (CAL_INIT)
        return;
    CAL_INIT = true;
    var height = '410';//window.innerHeight * 0.6;
    Cal_options.height = height;
    Cal_options.header = false;
    Cal_options.columnFormat = {
        month: 'ddd',    // Mon
        week: 'ddd', // Mon
        day: 'dddd M/d'  // Monday 9/7
    }

    Cal_options.eventClick = function(calEvent, jsEvent, view) {
        if (calEvent.highlighted == true)
        {
            // TODO: fix this function. PopUp_giveFocusToID does not seem to work
            // PopUp_giveFocusToID(calEvent.id);
            return;
        }

        if (SHIFT_PRESSED)
        {
            Cal_highlightEvent(calEvent, true);
            //UI_pin(calEvent.id);
            var popUp = PopUp_insertPopUp(false);
            // PopUp_setToEventID(popUp, calEvent.id);
            PopUp_giveFocus(popUp);
            return;
        }

        var myCourseID = EventsMan_getEventByID(calEvent.id).course_id;
        $($("#calendarui").fullCalendar("clientEvents", function(calEvent) {
            return !UI_isPinned(calEvent.id)
        })).each( function(index) {
            var eventDict = EventsMan_getEventByID(this.id);
            if (eventDict.course_id != myCourseID)
            {
                Cal_unhighlightEvent(this, false);
            }
            else
            {
                Cal_highlightEvent(this, false);
            }
        });
        Cal_highlightEvent(calEvent, true);

        // we get the course_item with this course_id
        // then click on it
        var course_id = EventsMan_getEventByID(calEvent.id).course_id;
        CL_selectID(course_id);

        var popUp = PopUp_getMainPopUp();
        console.log(popUp);

        // PopUp_setToEventID(popUp, calEvent.id);
        PopUp_giveFocus(popUp);
    }

    $('#calendarui').fullCalendar(Cal_options);
    EventsMan_addUpdateListener(function(){
        Cal_reload();
    });

    PopUp_addCloseListener(function() {
        Cal_reload();
    });
}

function Cal_reload()
{
    LO_showLoading('cal loading');
    var eventIDs = EventsMan_getEnrolledEvents();
    Cal_eventSource.events = [];
    $.each(eventIDs, function(index){
        eventDict = EventsMan_getEventByID(this);
        var color = COURSE_COLOR_MAP[eventDict.course_id];
        if (!color)
            color = getUsableColor(eventDict.course_id);

        var shouldHighlight = UI_isPinned(this) || UI_isMain(this);
        color = colorLuminance(color, FACTOR_LUM);
        var rgba;
        if (shouldHighlight)
        {
            rgba = rgbToRgba(luminanceToRgb(color), 1.0);
        }
            else
        {
            rgba = rgbToRgba(luminanceToRgb(color), FACTOR_TRANS);
        }

        Cal_eventSource.events.push({
            id: eventDict.event_id,
            title: CourseMan_getCourseByID(eventDict.course_id).course_primary_listing,
            start: moment.unix(eventDict.event_start).tz(MAIN_TIMEZONE).toISOString(),
            end: moment.unix(eventDict.event_end).tz(MAIN_TIMEZONE).toISOString(),
            myColor: COURSE_COLOR_MAP[eventDict.course_id],
            textColor: shouldHighlight ? '#ffffff' : color,
            backgroundColor: rgba,
            borderColor: '#ffffff' //color //'#123456' 
        });
    });
    var start = moment.unix(CUR_SEM.start_date);
    start.week(start.week() + 1);
    $('#calendarui').fullCalendar('gotoDate', start.year(), start.month(), start.date());
    $("#calendarui").fullCalendar("refetchEvents");
    LO_hideLoading('cal loading');
}
