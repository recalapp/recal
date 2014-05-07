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
    var height = window.innerHeight - $(".navbar").height() - 50;

    EventsMan_addUpdateListener(function(){
        if (Cal_active())
            Cal_reload();
    });
    $('#'+SE_id).on('close', function(ev){
        //if (Cal_active())
        Cal_reload();
    });

    Cal_options.height = height;
    Cal_options.eventClick = function(calEvent, jsEvent, view) {
        if (calEvent.highlighted == true)
        {
            PopUp_giveFocusToID(calEvent.id);
            return;
        }

        if (SHIFT_PRESSED)
        {
            Cal_highlightEvent(calEvent, true);
            //UI_pin(calEvent.id);
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

        var popUp = PopUp_getMainPopUp();

        PopUp_setToEventID(popUp, calEvent.id);
        PopUp_giveFocus(popUp);
    }
    Cal_options.windowResize = function(view){
        var height = window.innerHeight - $(".navbar").height() - 50;
        $('#calendarui').fullCalendar('option', 'height', height);
    };

    $("#calendarui").fullCalendar(Cal_options);
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
            Cal_unhighlightEvent(this, true);
        });
    });
    if (Cal_active())
        Cal_reload();
}
function Cal_active()
{
    return $('#calendar').hasClass('active');
}
function Cal_reload()
{
    if (CAL_LOADING)
        return;
    CAL_LOADING = true;
    var eventIDs = EventsMan_getAllEventIDs();
    Cal_eventSource.events = [];
    setTimeout(function(){
        LO_show();
        try {
            $.each(eventIDs, function(index){
                eventDict = EventsMan_getEventByID(this);
                if (!eventDict)
                    return;
                if (!CAL_FILTER.contains(eventDict.event_type))
                    return;
                if (eventDict.course_id in COURSE_FILTER_BLACKLIST)
                    return;
                var shouldHighlight = UI_isPinned(this) || UI_isMain(this);
                var isHidden = EventsMan_eventIsHidden(this);
                // TODO(Dyland) distinguish between hidden and non-hidden events
                color = SECTION_COLOR_MAP[eventDict.section_id]['color'];
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
                    title: eventDict.event_title,
                    start: moment.unix(eventDict.event_start).tz(MAIN_TIMEZONE).toISOString(),
                    end: moment.unix(eventDict.event_end).tz(MAIN_TIMEZONE).toISOString(),
                    highlighted: shouldHighlight,
                    myColor: SECTION_COLOR_MAP[eventDict.section_id]['color'],
                    textColor: shouldHighlight ? '#ffffff' : SECTION_COLOR_MAP[eventDict.section_id]['color'],
                    backgroundColor: rgba,
                    borderColor: '#ffffff'
                });
            });
            $("#calendarui").fullCalendar("refetchEvents");
            CAL_LOADING = false;
        }
        catch(err){
            CAL_LOADING = false;
        }
        LO_hide();
    }, 10);
}

function Cal_render() {
    $("#calendarui").fullCalendar("render");
}
