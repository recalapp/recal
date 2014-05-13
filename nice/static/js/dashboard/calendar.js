/***************************************************
 * Calendar Module
 * requires: Calendar-base module
 *           UI module (UI_isPinned, UI_isMain),
 *           PopUp module
 *           Events Manager module
 **************************************************/


// sample event source:
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

    // customizing options
    var height = window.innerHeight - $(".navbar").height() - 50;

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
        var popUp = PopUp_getMainPopUp();

        var success = PopUp_setToEventID(popUp, calEvent.id, function(){
            PopUp_giveFocus(popUp);
            $($("#calendarui").fullCalendar("clientEvents", function(calEvent) {
                return !UI_isPinned(calEvent.id)
            })).each( function(index) {
                Cal_unhighlightEvent(this, false);
            });
            Cal_highlightEvent(calEvent, true);
        });
        if (!success)
            return;
        PopUp_giveFocus(popUp);

        $($("#calendarui").fullCalendar("clientEvents", function(calEvent) {
            return !UI_isPinned(calEvent.id)
        })).each( function(index) {
            Cal_unhighlightEvent(this, false);
        });
        Cal_highlightEvent(calEvent, true);

    }
    Cal_options.windowResize = function(view){
        Cal_adjustHeight();
    };

    $("#calendarui").fullCalendar(Cal_options);
    CAL_INIT = true;
    // unhightlight when closing events
    PopUp_addCloseListener(function(id){
        $($("#calendarui").fullCalendar("clientEvents", id)).each(function (index){
            Cal_unhighlightEvent(this, true);
        });
    });
    // reload before displaying
    EventsMan_addUpdateListener(function(){
        if (Cal_active())
            Cal_reload();
    });
    $('#'+SE_id).on('close', function(ev){
        if (Cal_active())
            Cal_reload();
    });
    $("#calendar.tab-pane").each(function(index){
        $(this).on("transitionend", function(e) {
            if ($(this).hasClass('in'))
            {
                Cal_render();
                Cal_reload();
            }
        });
    });
    if (Cal_active())
        Cal_reload();

}
function Cal_adjustHeight()
{
    var height = window.innerHeight - $(".navbar").height() - 50;
    $('#calendarui').fullCalendar('option', 'height', height);
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

    var factor_trans = (THEME == 'w') ? FACTOR_TRANS : FACTOR_TRANS_DARK;
    setTimeout(function(){
        LO_showLoading('cal loading');
        // NOTE: try statement because the plugin has errors sometimes
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
                color = SECTION_COLOR_MAP[eventDict.section_id]['color'];
                color = colorLuminance(color, FACTOR_LUM);
                var rgba;
                if (shouldHighlight)
                {
                    rgba = rgbToRgba(luminanceToRgb(color), 1.0);
                }
                else
                {
                    rgba = rgbToRgba(luminanceToRgb(color), factor_trans);
                }
                var eventStartTZ = moment.unix(eventDict.event_start);
                if (MAIN_TIMEZONE)
                    eventStartTZ = eventStartTZ.tz(MAIN_TIMEZONE);
                var eventEndTZ =  moment.unix(eventDict.event_end);
                if (MAIN_TIMEZONE)
                    eventEndTZ = eventEndTZ.tz(MAIN_TIMEZONE);
                Cal_eventSource.events.push({
                    id: eventDict.event_id,
                    title: eventDict.event_title,
                    start: eventStartTZ.toISOString(),
                    end: eventEndTZ.toISOString(),
                    highlighted: shouldHighlight,
                    myColor: SECTION_COLOR_MAP[eventDict.section_id]['color'],
                    textColor: shouldHighlight ? '#ffffff' : SECTION_COLOR_MAP[eventDict.section_id]['color'],
                    backgroundColor: rgba,
                    borderColor: rgba
                });
            });
            $("#calendarui").fullCalendar("refetchEvents");
        }
        catch(err){
        }
        CAL_LOADING = false;
        LO_hideLoading('cal loading');
    }, 10);
}

function Cal_render() {
    $("#calendarui").fullCalendar("render");

    var height = Cal_options.height;
    // customize cell height
    // 16 hours, each hour 2 cells
    var cellHeight = Math.floor(height / (2 * 16));
    $('.fc-agenda-slots td div').css('height', cellHeight + 'px');
}
