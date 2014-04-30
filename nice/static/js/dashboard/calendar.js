var CAL_LOADING = false;
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
    try {
        var eventIDs = EventsMan_getAllEventIDs();
        Cal_eventSource.events = [];
        setTimeout(function(){
            $.each(eventIDs, function(index){
                eventDict = EventsMan_getEventByID(this);
                if (!eventDict)
                    return;
                if (!CAL_FILTER.contains(eventDict.event_type))
                    return;
                var shouldHighlight = UI_isPinned(this) || UI_isMain(this);
                var isHidden = EventsMan_eventIsHidden(this);
                // TODO(Dyland) distinguish between hidden and non-hidden events
                color = SECTION_COLOR_MAP[eventDict.section_id]['color'];
                Cal_eventSource.events.push({
                    id: eventDict.event_id,
                    title: eventDict.event_title,
                    start: moment.unix(eventDict.event_start).tz(MAIN_TIMEZONE).toISOString(),
                    end: moment.unix(eventDict.event_end).tz(MAIN_TIMEZONE).toISOString(),
                    highlighted: shouldHighlight,
                    backgroundColor: shouldHighlight ? colorLuminance(color, 0) : colorLuminance(color, 0.2),
                    borderColor: colorLuminance(color, 0)
                });
            });
            $("#calendarui").fullCalendar("refetchEvents");
        }, 10);
        CAL_LOADING = false;
    }
    catch(err) {
        CAL_LOADING = false;
    }
}

function Cal_render() {
    $("#calendarui").fullCalendar("render");
}

function Cal_highlightEvent(calEvent, update)
{
    if (!calEvent.highlighted)
        calEvent.backgroundColor = colorLuminance(calEvent.backgroundColor, -0.2);
    calEvent.highlighted = true;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).addClass("event-selected");
}
function Cal_unhighlightEvent(calEvent, update)
{
    // delete calEvent["backgroundColor"];
    if (calEvent.highlighted)
        calEvent["backgroundColor"] = colorLuminance(calEvent["backgroundColor"], 0.2);
    calEvent.highlighted = false;
    if (update)
        $("#calendarui").fullCalendar("updateEvent", calEvent);
    //$(eventDiv).removeClass("event-selected");
}

function colorLuminance(hex, lum) 
{
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
