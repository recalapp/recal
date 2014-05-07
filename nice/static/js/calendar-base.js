var CAL_LOADING = false;
var FACTOR_LUM = 0.2;
var FACTOR_TRANS = 0.7;

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

function luminanceToRgb(lum)
{
    var r = parseInt(lum.substring(1, 3), 16);
    var g = parseInt(lum.substring(3, 5), 16);
    var b = parseInt(lum.substring(5, 7), 16);
    return [r,g,b];
}

function rgbToRgba(rgb, trans)
{
    return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + trans + ")";
}

/*
function rgbaToHex(rgba)
{
    var start;
    var r, g, b;
    for (i = 0; i < rgba.length; i++)
    {
        if (rgba[i] == '(')
            start = i;
        if (rgba[i] == ',')
            break;
    }

    r = rgba.substring(start + 1, i).toString(16);

    for (; i < rgba.length; i++)
    {
        if (rgba[i] == ' ')
            start = i;
        if (rgba[i] == ',')
            break;
    }

    g = rgba.substring(start + 1, i).toString(16);

    for (; i < rgba.length; i++)
    {
        if (rgba[i] == ' ')
            start = i;
        if (rgba[i] == ',')
            break;
    }

    b = rgba.substring(start + 1, i).toString(16);

    return "#" + r + g + b;
}
*/

// hack to set the opacity for rgba string 
// example:
// if opacity = 1,
// "rgba(12, 34, 56, 0.789907)" becomes
// "rgba(12, 34, 56, 1)"
function setOpacity(rgba, opacity)
{
    for (i = rgba.length - 1; i > 0; i--)
    {
        if (rgba[i] == ' ')
            break;
    }

    // use i+1 because we still want the space
    var newColor = rgba.substring(0, i + 1) + opacity + ")";
    return newColor;
}
