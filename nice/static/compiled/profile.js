/**
 * An ActionSheet module, inspired by UIActionSheet in the iOS SDK.
 * Shows a popover with prompt.
 */
function AS_showActionSheetFromElement(element, container, title, choices, clickListener)
{
    var $content = $('<div>');
    $.each(choices, function(index){
        var $button = $('<a>').addClass('white-link-btn').addClass('prompt-btn theme').attr('id', index).text(this.text);
        if (this.important) {
            $button = $button.addClass('no');
        } else {
            $button = $button.addClass('yes');
        }
        $button.on('click', function(ev){
            ev.preventDefault();
            $(element).blur();
            clickListener(index);
        });
        $content.append($button);
    });
    if (THEME == 'w')
        $content.find('.theme').removeClass('dark');
    else
        $content.find('.theme').addClass('dark');
    $(element).popover('destroy');
    $(element).popover({
        title: title,
        placement: 'bottom',
        html: true,
        content: $content[0],
        trigger: 'focus',
        container: $(container)
    });
    $(element).focus();
}
var cacheManager = null;
var CACHE_INIT = false;

/**
 * This module first checks if a url has been loaded before. If it has,
 * give the saved result
 */
function CacheMan_init()
{
    if (CACHE_INIT)
        return;
    CACHE_INIT = true;
    cacheManager = new _CacheMan();

    if (typeof CACHEMAN_PRELOAD != 'undefined')
    {
        $.each(CACHEMAN_PRELOAD, function(key, value){
            cacheManager.cached[key] = value;
        });
    }
}

function _CacheMan()
{
    this.cached = {};
    return this;
}

function CacheMan_load(url)
{
    if (cacheManager.cached[url] == null)
    {
        _CacheMan_cacheURL(url, false);
        return CacheMan_load(url);
    }
    return cacheManager.cached[url];
}

function _CacheMan_cacheURL(url, async)
{
    $.ajax(url, {
        async: async,
        dataType: "html",
        success: function(data){
            cacheManager.cached[url] = data;
        }
    });
}
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
    slotMinutes: 45,
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

// got this from stackoverflow:
// http://stackoverflow.com/questions/6672374/convert-rgb-rgba?rq=1
//
// gives a calculated alpha
function RGBtoRGBA(r, g, b){

    if((g==void 0) && (typeof r == 'string')){
        r = r.replace(/^\s*#|\s*$/g, '');
        if(r.length == 3){
            r = r.replace(/(.)/g, '$1$1');
        }
        g = parseInt(r.substr(2, 2), 16);
        b = parseInt(r.substr(4, 2), 16);
        r = parseInt(r.substr(0, 2), 16);
    }

    var min, a = ( 255 - (min = Math.min(r, g, b)) ) / 255;

    return {
        r: r = 0|( r - min ) / a,
        g: g = 0|( g - min ) / a,
        b: b = 0|( b - min ) / a,
        a: a = (0|1000*a)/1000,
        rgba: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')',
    };
}

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
/***********************************************************
 * This module gives a Bootstrap-Carousel-based interface
 * for choosing between events. It is meant to be used
 * in the sidebar, but does not need to be so.
 **********************************************************/
/*
 * [
 *  {
 *      eventID: the id in events manager
 *      eventDict: the dictionary of the new event
 *      buttons: [
 *          {
 *              value:
 *              pretty:
 *          }
 *      ]
 *  }
 * ]
 */
function EP_init(heading, choices)
{
   var $ep = $(CacheMan_load('event-picker'));
   $ep.find('#ep-title').text(heading);
   $ep.data('count', choices.length);
   $.each(choices, function(index, choice){
        // create picker item
        var $pickerItem = $(CacheMan_load('event-picker-item'));
        if (index == 0)
            $pickerItem.addClass('active');
        
        // picker item uses a popup component. set the properties
        var popUp = $pickerItem.find('.popup-ep')[0];
        var eventDict = choice.eventDict;
        PopUp_setTitle(popUp, eventDict.event_title);
        PopUp_setDescription(popUp, eventDict.event_description);
        PopUp_setLocation(popUp, eventDict.event_location);
        PopUp_setSection(popUp, eventDict.section_id);
        PopUp_setType(popUp, eventDict.event_type);
        PopUp_setDate(popUp, eventDict.event_start);
        PopUp_setStartTime(popUp, eventDict.event_start);
        PopUp_setEndTime(popUp, eventDict.event_end);
        //_PopUp_setBodyHeight(popUp);

        $.each(choice.buttons, function(index, buttonDict){
            var $button = $('<a>').addClass('white-link-btn').addClass('theme').css({
                display: 'inline',
            });
            $button.html(buttonDict.pretty);
            $button.data('value', buttonDict.value);
            $button.on('click', function(ev){
                ev.preventDefault();
                var index = $(this).closest('.item.active').index();
                $ep.trigger('ep.select', {
                    eventID: choice.eventID,
                    eventDict: choice.eventDict,
                    button: $(this).data('value'),
                    index: index,
                });
            });
            $pickerItem.find('#ep-item-controls').append($button);
        });
        $pickerItem.css({
            height: window.innerHeight * 0.55,
        });
        $ep.find('#ep-container').append($pickerItem);
   });
   if (THEME == 'w')
       $ep.find('.theme').removeClass('dark');
   else
       $ep.find('.theme').addClass('dark');
   $ep.find('#cancel_button').on('click', function(ev){
       ev.preventDefault();
       $ep.trigger('ep.cancel');
   });
   $ep.on('slid.bs.carousel', function(ev){
       _EP_updateButtons(this);
       var index = $(this).find('.item.active').index();
       var choice = choices[index];
       $(this).trigger('ep.slid', {
           eventID: choice.eventID,
           eventDict: choice.eventDict,
           index: index,
       });
   });
   _EP_updateButtons($ep[0]);
   return $ep[0];
}
function EP_adjustPopUpSize(ep)
{
    $(ep).find('.popup-ep').each(function(){
        _PopUp_setBodyHeight(this);
    });
}
function _EP_updateButtons(ep)
{
    var $ep = $(ep);
    var activeIndex = $ep.find('.item.active').index();
    // enable all buttons first
    $ep.find('.ep-control').removeClass('disabled-btn');
    if (activeIndex == 0)
    {
        // disable left button
        $ep.find('.left.ep-control').addClass('disabled-btn');
    }
    if (activeIndex == $ep.data('count') - 1)
    {
        // disable right button
        $ep.find('.right.ep-control').addClass('disabled-btn');
    }
}
function EP_removeItemAtIndex(ep, index)
{
    var count = $(ep).data('count');
    var $toBeRemoved = $(ep).find('.item').filter(function(){
        return $(this).index() == index;
    });
    if ($toBeRemoved.hasClass('active'))
    {
        // must cycle away
        var newIndex = (index + 1) % count;
        $(ep).one('slid.bs.carousel', function(ev){
            $toBeRemoved.remove();
            $(this).data('count', count - 1);
            _EP_updateButtons(this);
        });
        $(ep).carousel(newIndex);
        return;
    }
    $toBeRemoved.remove();
    $(ep).data('count', count - 1);
}
var eventsManager = null;
var EventsMan_updateListeners = [];
var EventsMan_onReadyListeners = [];
var EventsMan_eventIDsChangeListener = [];
var EVENTS_INIT = false;
var EVENTS_READY = false;

function EventsMan_init(){};

/**
 * return a new events manager object
 */
function _EventsMan_new()
{
    this.events = {};
    this.order = []; // {start: "start", id: "id"}, keep sorted
    this.lastSyncedTime = 0; // will be set when populating
    this.addedCount = 0;
    this.updatedIDs = new Set(); // if it is in updatedIDs, it'll be pushed on the next connection
    this.uncommitted = {}; // copies of events dict with uncommitted changes, once saved, the event dict is copied to eventsManager.events, and its ID is added to updatedIDs
    this.hiddenIDs = new Set();
    this.changed = false; // true if hidden IDs have changed and not been pushed
    this.isIdle = true;
    this.showHidden = false;
    return this;
}

function EventsMan_constructOrderArray()
{
    eventsManager.order = [];
    $.each(eventsManager.events, function(key, eventDict){
        eventsManager.order.push({'event_start': eventDict.event_start, 'event_id': key}); 
    });
    eventsManager.order.sort(function(a,b){
        return parseInt(a.event_start) - parseInt(b.event_start);
    });
}
/**************************************************
 * Client methods
 * These are strictly interactions between the event
 * manager and the client. It does NOT talk to 
 * the server.
 **************************************************/

/**
 * this function can be called in two ways.
 *
 * EventsMan_showHidden() returns a boolean indicating if hidden
 * events should be shown.
 *
 * EventsMan_showHidden(boolean) tells the events manager whether
 * or not it should show hidden events. Also returns the same
 * boolean for consistency.
 */
function EventsMan_showHidden(hide)
{
    if (typeof hide != 'undefined')
    {
        eventsManager.showHidden = hide;
        _EventsMan_callUpdateListeners();
    }
    return eventsManager.showHidden;
}
//{
//    'event_group_id': event.group.id,
//    'event_title': rev.event_title,
//    'event_type': rev.get_event_type_display(), 
//    'event_date': rev.event_date.strftime('%s'),
//    'event_description': rev.event_description,
//    'event_location': rev.event_location,
//    'section_id': event.group.section.id,
//    'modified_user': rev.modified_user.netid,
//    'modified_time': rev.modified_time.strftime('%s') 
//}
function EventsMan_getEventByID(id)
{
    return eventsManager.events[id];
}
function EventsMan_hasEvent(id)
{
    return (id in eventsManager.events) || (id in eventsManager.uncommitted);
}

function EventsMan_getEventIDForRange(start, end)
{
    var i = 0;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start < start)
        i++;
    var iStart = i;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start < end)
        i++;
    var iEnd = Math.min(i, eventsManager.order.length); // slice method is exclusive on the right end
    var events = eventsManager.order.slice(iStart, iEnd);
    var ret = [];
    for (var i = 0; i < events.length; i++)
        if (EventsMan_showHidden() || !EventsMan_eventIsHidden(events[i].event_id))
            ret.push(events[i].event_id);
    return ret;
}
function EventsMan_getAllEventIDs()
{
    var ret = [];
    $.each(eventsManager.events, function(eventID, eventDict){
        if (EventsMan_showHidden() || !EventsMan_eventIsHidden(eventID))
            ret.push(eventID);
    });
    return ret;
}

function EventsMan_hasUncommitted(id)
{
    return id in eventsManager.uncommitted;
}
function EventsMan_getUncommitted(id)
{
    return eventsManager.uncommitted[id];
}

function EventsMan_addEvent()
{
    var id = String(-1 * ++eventsManager.addedCount);
    var firstSectionKey = 123;
    for (var key in SECTION_MAP)
    {
        firstSectionKey = key;
        break;
    }
    var eventDict = {
        event_id: id,
        event_group_id: id, // TODO safe? value won't be used.
        event_title: 'Event Name',
        event_type: 'AS',
        event_start: moment().unix(),
        event_end: moment().minute(moment().minute() + 50).unix(),
        event_description: 'Event description \n Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        event_location: 'Event location',
        // Add color for event
        course_id: -1,
        section_id: firstSectionKey, 
        modified_user: USER_NETID,
        modified_time: moment().unix()
    }
    eventsManager.uncommitted[id] = eventDict;
    return id;
}

function EventsMan_deleteEvent(id, silent)
{
    silent = silent || false;
    if (id in eventsManager.events)
    {
        eventsManager.hiddenIDs.add(id);
        eventsManager.changed = true;
    }
    if (id in eventsManager.uncommitted)
    {
        eventsManager.uncommitted[id] = null;
        delete eventsManager.uncommitted[id];
    }
    if (id in eventsManager.updatedIDs)
    {
        eventsManager.updatedIDs.remove(id);
    }
    if (!silent)
        _EventsMan_callUpdateListeners();
}
function EventsMan_deleteAllFutureEvents(id)
{
    var eventDict = EventsMan_getEventByID(id);
    var endDate = moment.unix(eventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(eventDict.event_start, endDate.unix());
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == eventDict.event_group_id && otherEventDict != eventDict)
            EventsMan_deleteEvent(this, true);
    });
    EventsMan_deleteEvent(id);
}
function EventsMan_unhideEvent(id, silent)
{
    silent = silent || false;
    if (id in eventsManager.events)
    {
        eventsManager.hiddenIDs.remove(id);
        eventsManager.changed = true;
    }
    if (!silent)
        _EventsMan_callUpdateListeners();
}
function EventsMan_unhideAllFutureEvents(id)
{
    var eventDict = EventsMan_getEventByID(id);
    var endDate = moment.unix(eventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(eventDict.event_start, endDate.unix());
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == eventDict.event_group_id && otherEventDict != eventDict)
            EventsMan_unhideEvent(this, true);
    });
    EventsMan_unhideEvent(id);
}
function EventsMan_eventIsHidden(id)
{
    return id in eventsManager.hiddenIDs;
}
function EventsMan_eventShouldBeShown(id)
{
    return !EventsMan_eventIsHidden(id) || EventsMan_showHidden();
}
/**
 * indicates whether or not the events manager is ready. If it has pulled at least once,
 * it is ready
 */
function EventsMan_ready()
{
    return EVENTS_READY;
}

/**
 * commit the uncommitted changes
 */
function EventsMan_commitChanges(id)
{
    var oldEventDict = eventsManager.events[id];
    var newEventDict = eventsManager.uncommitted[id];
    eventsManager.events[id] = eventsManager.uncommitted[id];
    delete eventsManager.uncommitted[id];
    eventsManager.updatedIDs.add(id);
    EventsMan_constructOrderArray();
    if ('recurrence_days' in oldEventDict 
            && (!oldEventDict.recurrence_days.equals(newEventDict.recurrence_days)
                    || oldEventDict.recurrence_interval != newEventDict.recurrence_interval))
    {
        // recurrence changes. push right away.
        EventsMan_pushToServer(true);
    }
    _EventsMan_callUpdateListeners();
}
function EventsMan_cancelChanges(id)
{
    delete eventsManager.uncommitted[id];
    _EventsMan_callUpdateListeners();
}
function EventsMan_commitChangesToAllFutureEvents(id)
{
    var newEventDict = eventsManager.uncommitted[id];
    var oldEventDict = eventsManager.events[id];
    var endDate = moment.unix(oldEventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(oldEventDict.event_start, endDate.unix());
    var newStart = moment.unix(newEventDict.event_start);
    var newEnd = moment.unix(newEventDict.event_end);
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == oldEventDict.event_group_id && otherEventDict != oldEventDict)
        {
            otherEventDict.event_title = newEventDict.event_title;
            otherEventDict.event_description = newEventDict.event_description;
            otherEventDict.event_location = newEventDict.event_location;
            otherEventDict.section_id = newEventDict.section_id;
            otherEventDict.event_type = newEventDict.event_type;
            otherEventDict.modified_time = newEventDict.modified_time;
            otherEventDict.modified_user = newEventDict.modified_user;
            var start = moment.unix(otherEventDict.event_start).hour(newStart.hour());
            start.minute(newStart.minute());
            start.second(newStart.second());
            otherEventDict.event_start = start.unix();
            var end = moment.unix(otherEventDict.event_end).hour(newEnd.hour());
            end.minute(newEnd.minute());
            end.second(newEnd.second());
            otherEventDict.event_end = end.unix();
            eventsManager.updatedIDs.add(otherEventDict.event_id);
        }
    });
    EventsMan_commitChanges(id);
}
// replaces only in the uncommitted array - ok because we're only
// doing this for new events
function EventsMan_replaceUncommittedEventIDWithEvent(id, eventDict)
{
    eventsManager.uncommitted[id] = null;
    delete eventsManager.uncommitted[id];
    eventsManager.uncommitted[eventDict.event_id] = eventDict;
    EventsMan_callEventIDsChangeListener(id, eventDict.event_id);
    _EventsMan_callUpdateListeners();
}
/**
 * replace the current event dictionary corresponding to eventID
 * with the given event dict.
 */
function EventsMan_replaceEventIDWithEvent(id, eventDict)
{
    // first replace it in the main events array
    eventsManager.events[id] = null;
    delete eventsManager.events[id];
    eventsManager.events[eventDict.event_id] = eventDict;
    if (EventsMan_hasUncommitted(id))
    {
        delete eventsManager.uncommitted[id];
    }
    EventsMan_callEventIDsChangeListener(id, eventDict.event_id);
    _EventsMan_callUpdateListeners();
}
/***************************************************
 * Server code
 **************************************************/
function EventsMan_pushToServer(async){}; // to be implemented by submodule
function EventsMan_pullFromServer(complete){}; // to be implemented by submodule

/***************************************************
 * Client Event Listeners
 **************************************************/

function _EventsMan_callUpdateListeners()
{
    $.each(EventsMan_updateListeners, function(index) {
        this();
    });
}
function EventsMan_addUpdateListener(listener)
{
    EventsMan_updateListeners.push(listener);
}

// if already ready, calls right away
function EventsMan_addOnReadyListener(listener)
{
    if (EVENTS_READY)
    {
        listener();
        return;
    }
    EventsMan_onReadyListeners.push(listener);
}
function EventsMan_callOnReadyListeners()
{
    $.each(EventsMan_onReadyListeners, function(index){
        this();
    });
    EventsMan_onReadyListeners = null;
}
function EventsMan_addEventIDsChangeListener(listener)
{
    EventsMan_eventIDsChangeListener.push(listener);
}
function EventsMan_callEventIDsChangeListener(oldID, newID)
{
    $.each(EventsMan_eventIDsChangeListener, function(index){
        this(oldID, newID);
    });
}
/***************************************************
 * Miscellaneous
 **************************************************/

/**
 * creates a deep copy of the event dict
 */
function EventsMan_cloneEventDict(eventDict)
{
    var newDict = JSON.parse(JSON.stringify(eventDict)) // hack for cloning
    return newDict;
}

/** 
 * save events to local storage
 */
function EventsMan_save()
{
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.setItem('eventsman.events', JSON.stringify(eventsManager.events));
        localStorage.setItem('eventsman.lastsyncedtime', eventsManager.lastSyncedTime);
        localStorage.setItem('eventsman.hidden', JSON.stringify(eventsManager.hiddenIDs.toArray()));
    }
}

/**
 * try to load from local storage
 */
function EventsMan_load()
{
    if (!('localStorage' in window && window['localStorage'] !== null))
        return false;
    var user = localStorage.getItem('user');
    if (user != USER_NETID)
        return false;
    var events = localStorage.getItem('eventsman.events');
    if (!events)
        return false;
    eventsManager.events = JSON.parse(events);
    var hidden = localStorage.getItem('eventsman.hidden');
    if (hidden)
        eventsManager.hiddenIDs = Set.prototype.fromArray(JSON.parse(hidden));
    var time = localStorage.getItem('eventsman.lastsyncedtime');
    if (time)
        eventsManager.lastSyncedTime = time;
    EventsMan_constructOrderArray();
    return true;
}
var PRINCETON_TIMEZONE = 'America/New_York';
var MAIN_TIMEZONE = PRINCETON_TIMEZONE;
var DAYS_DICT = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'S'];
var TYPE_MAP_INVERSE = {
    "assignment":"AS",
    "exam":"EX",
    "lab":"LA",
    "lecture":"LE",
    "office hours":"OH",
    "precept":"PR",
    "review session":"RS"
}
var TYPE_MAP = {
    AS: "assignment",
    EX: "exam",
    LA: "lab",
    LE: "lecture",
    OH: "office hours",
    PR: "precept",
    RS: "review session"
}
String.prototype.escapeHTML = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};
Array.prototype.contains = function(a){
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == a)
            return true;
    }
    return false;
}
Array.prototype.find = function(a){
    for (var i = 0; i < this.length; i++) {
        if (this[i] == a)
            return i;
    };
    return -1;
}
Array.prototype.equals = function(a){
    var i;
    for (i = 0; i < this.length; i++) {
        if (i >= a.length)
            return false;
        else if (this[i] != a[i])
            return false;
    }
    return i == a.length;
}
/***********************************************************
 * This module gives an indicator on the bottom right
 * corner of the screen. It is meant to be used only
 * for displaying information. If user interaction is
 * needed, use notificaitons.js.
 **********************************************************/

// add as needed
var LO_TYPES = {
    SUCCESS: 'alert-success',
}
var LO_idMap = null;
function LO_init()
{
    LO_idMap = {
        loading: new Set(),
        error: new Set(),
    };
}

function LO_showLoading(id)
{
    if (typeof id == 'undefined')
        return;
    if (id in LO_idMap.loading)
    {
        // TODO should do anything here?
        return;
    }
    LO_idMap.loading.add(id);
    if ($('#loading.active').length > 0)
        return;
    var $loading = LO_getLoadingHTML();
    $loading.attr('id', 'loading');
    LO_insert($loading);
}
function LO_hideLoading(id, alsoHideErrorIfExists)
{
    if (typeof alsoHideErrorIfExists == 'undefined')
        alsoHideErrorIfExists = true;
    if (typeof id == 'undefined')
        return;
    LO_idMap.loading.remove(id);
    if (LO_idMap.loading.isEmpty())
    {
        LO_remove($('#loading.active'));
    }
    if (!alsoHideErrorIfExists)
        return;
    if (id in LO_idMap.error)
    {
        LO_idMap.error.remove(id);
        if (LO_idMap.error.isEmpty())
        {
            LO_remove($('#error.active'));
            LO_showTemporaryMessage('Connected :)', LO_TYPES.SUCCESS);
        }
    }
}
function LO_showError(id)
{
    if (typeof id == 'undefined')
        return;
    if (id in LO_idMap.error)
        return;
    LO_idMap.error.add(id);

    if ($('#error.active').length > 0)
        return;

    /*if ($('#loading.error').length > 0)
        return;
    if ($('#loading').not('.error').length > 0)
        $('#loading').not('.error').remove();*/
    var $loadingError = LO_getLoadingHTML();
    $loadingError.attr('id', 'error');
    $loadingError.removeClass('alert-info').addClass('alert-danger');
    $loadingError.find('#loading-content').html('Error connecting.<br>Will keep trying');
    LO_insert($loadingError); 
}
function LO_showTemporaryMessage(message, type)
{
    var $loading = LO_getLoadingHTML();
    $loading.removeClass('alert-info').addClass(type);
    $loading.find('#loading-content').text(message);
    LO_insert($loading);
    setTimeout(function(){
        LO_remove($loading);
    }, 1.5*1000);
}
function LO_remove($loading)
{
    $loading.on('transitionend', function(ev){
        $(this).remove();
    });
    $loading.removeClass('active');
    $loading.removeClass('in');
}
function LO_insert($loading)
{
    $('#indicators-container').append($loading);
    $loading.addClass('active'); // NOTE an indicator does not technically exists unless it has class 'active'
    $loading.addClass('in');
}
function LO_getLoadingHTML()
{
    var $loading = $('<div>').addClass('indicator alert alert-dismissable alert-info');
    $loading.append($('<span id="loading-content">'));
    $loading.find('#loading-content').append('Loading...&nbsp;&nbsp;&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    return $loading;
}
var pinnedIDs = null;
var mainID = null;
var csrftoken = $.cookie('csrftoken');
var COURSE_COLOR_MAP;
var SECTION_COLOR_MAP;

/***********************************************************
 * UI Module. An ID is main if its popup is in the sidebar.
 * An ID is pinned if its popup has been dragged away from
 * the sidebar.
 **********************************************************/
function UI_pin(id)
{
    if (UI_isMain(id))
        UI_unsetMain();
    pinnedIDs.add(id);
}
function UI_isPinned(id)
{
    return id in pinnedIDs;
}
function UI_unpin(id)
{
    pinnedIDs.remove(id);
}
function UI_isMain(id)
{
    return mainID == id;
}
function UI_setMain(id)
{
    if (UI_isPinned(id))
        UI_unpin(id);
    mainID = id;
}
function UI_unsetMain()
{
    mainID = null;
}

/***********************************************************
 * Themes
 **********************************************************/

function loadWhiteTheme()
{
    $('.theme').removeClass('dark');
    $('#theme_css').attr('href','/static/cosmo/bootstrap.css');
}
function loadDarkTheme()
{
    $('.theme').addClass('dark');
    $('#theme_css').attr('href','/static/cyborg/bootstrap.css');
}

/***********************************************************
 * CSRF methods
 **********************************************************/
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

/***********************************************************
 * Useful codes
 **********************************************************/
/**
 * Auto-capitalizes words.
 * Code taken from Stackoverflow, http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
 */
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function br2nl(text)
{
    return text.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n"); // g = replace all occurences
}
function nl2br(text)
{
    return text.replace(/(\n|\r)/g, "<br>");
}
// REQUIRES UI module - isMain, isPinned, etc.
// REQUIRES SB module
var POPUP_HTML = null;
var POPUP_CLASS = 'popup';
var POPUP_URL = 'popup-template';
var PopUp_closeListeners = [];
var PopUp_editListeners = [];
var PopUp_freedSpace = [];
var PopUp_space = 0;
var POPUP_INIT = false;
var POPUP_EDITDICT = {
    "popup-loc": "event_location",
    "popup-title": "event_title",
    "popup-date": "event_date",
    'popup-time-start': 'event_start',
    'popup-time-end': 'event_end',
    "popup-type": "event_type",
    "popup-section": "section_id",
    "popup-desc": "event_description",
    "popup-repeat-end": "recurrence_end",
    "popup-repeat-interval": "recurrence_interval",
}
var PopUp_Main_optFirstDrag = function(popUp){};
var POPUP_MAIN_FIRSTDRAG = function(popUp){
    if (PopUp_isMain(popUp))
    {
        popUp.id = "";
        //PopUp_showClose(popUp);
        PopUp_Main_optFirstDrag(popUp);
        UI_pin(PopUp_getID(popUp));
        UI_unsetMain();
        var rect = popUp.getBoundingClientRect();
        $(popUp).css({
            height: rect.height + 'px',
            width: rect.width + 'px',
        });
        $(popUp).appendTo('body');
        $(popUp).css({
            //position: 'fixed',
            top: rect.top,
            left: rect.left,
        });
        PopUp_makeResizable(popUp);
        SB_hide();
    }
};

/***************************************************
 * Creating/removing
 **************************************************/

/**
 * Create and return a new popup. isMain tells it if this popup
 * is going to be the main popup (meaning, it is in the sidebar)
 */
function PopUp_insertPopUp(isMain)
{
    var popUpHTML;
    if (POPUP_HTML)
        popUpHTML = POPUP_HTML;
    else
        popUpHTML = CacheMan_load(POPUP_URL);
    if (isMain)
        SB_push(popUpHTML);
    else
        $("body").append(popUpHTML);
    var popUp = $("#popup-main123");

    // set first drag listener
    var firstDragStart = function(){
        POPUP_MAIN_FIRSTDRAG(popUp);
        if (popUp.space)
            PopUp_freedSpace.push(popUp.space);
    };

    // make popup draggable using jquery ui
    popUp.draggable({
        handle:'.panel > .panel-heading', 
        containment:"#content_bounds", 
        scroll: false, 
        appendTo: 'body',
        beforeStart: function(ev, ui){
            firstDragStart();
        }, 
        zIndex: 2000,
    })
    popUp = popUp[0];
    popUp.id = "popup-main";
    if (!isMain)
    {
        // popup is not main. must stack so they don't completely overlap
        var space;
        if (PopUp_freedSpace.length == 0)
            space = ++PopUp_space;
        else
            space = PopUp_freedSpace.sort(function(a,b){return b-a}).pop();
        popUp.id = "";
        PopUp_makeResizable(popUp);
        leftPos = parseInt($(popUp).css("left"));
        topPos = parseInt($(popUp).css("top"));
        $(popUp).css("left", (leftPos + 20*space) + "px").css("top", (topPos + 20*space) + "px");
        popUp.space = space;
    }

    // give focus when clicking
    popUp.onmousedown = function(){
        PopUp_giveFocus(this);
    };

    // set the max height so it doesn't exceed screen height
    var maxHeight = window.innerHeight - $(".navbar").height() - 100;
    $(popUp).css("max-height", maxHeight+"px");
    _PopUp_setBodyHeight(popUp); 

    // custom initialization codes, to be implemented by submodules
    PopUp_initialize(popUp);
    setTimeout(function(){
        PopUp_initialize_deferred(popUp);
    }, 300) // doesn't block

    // activate tooltip
    $(popUp).find('.withtooltip').tooltip({});

    // set theme
    if (THEME == 'w')
        $(popUp).find('.theme').removeClass('dark');
    else
        $(popUp).find('.theme').addClass('dark');

    return popUp;
}

function PopUp_initialize(popUp){};
function PopUp_initialize_deferred(popUp){};

function PopUp_close(popUp)
{
    if (UI_isMain(PopUp_getID(popUp)))
    {
        UI_unsetMain();
        SB_pop(popUp);
    }
    else
    {
        UI_unpin(PopUp_getID(popUp));
        $(popUp).remove();
    }
    SB_hideIfEmpty();
}

/***************************************************
 * Getters and Setters
 **************************************************/

function PopUp_getMainPopUp()
{
    var main = $("#popup-main");
    if (main.length > 0)
    {
        main = $("#popup-main")[0];
    }
    else
        main = PopUp_insertPopUp(true);
    return main;
}

/**
 * find the popup with the id and return it. Returns null
 * if does not exist
 */
function PopUp_getPopUpByID(id)
{
    if ($('.' + POPUP_CLASS).find("#"+id).length > 0)
        return $('.' + POPUP_CLASS).find("#"+id).parent()[0];
    else
        return null;
}
/**
 * Get the id of the popup
 */
function PopUp_getID(popUp)
{
    if (!popUp)
        return null;
    if (!('id' in $(popUp).find('.panel')[0]))
        return null;
    return $(popUp).find(".panel")[0].id;
}
/**
 * set the id of the popup
 */
function PopUp_setID(popUp, id)
{
    var oldId = $(popUp).find(".panel")[0].id;
    $(popUp).find(".panel")[0].id = id;
    if (popUp.id == 'popup-main')
    {
        UI_setMain(id);
    }
    else 
    {
        // clean up, unpin old id
        UI_unpin(oldId);
        UI_pin(id);
    }
}

/**
 * set the height of panel-body
 */
function _PopUp_setBodyHeight(popUp)
{
    var headHeight = $(popUp).find(".panel-heading").css("height");
    var footerHeight = $(popUp).find(".panel-footer").not('.hide-footer').css("height");
    if (typeof footerHeight == "undefined")
        footerHeight = 0;
    var height = $(popUp).css("height");
    $(popUp).find(".panel-body").css("height", (parseInt(height) - parseInt(headHeight)) - parseInt(footerHeight) + "px");
}
/***************************************************
 * Appearance
 **************************************************/

function PopUp_giveFocus(popUp)
{
    if (!popUp)
        return;
    // take away focus from other popups
    PopUp_loseFocus($('.' + POPUP_CLASS).not(popUp));

    // give focus to this panel
    $(popUp).css("z-index", "200");
    var color = $(popUp).find('.panel').data('my-color');
    $(popUp).find(".panel").addClass("panel-primary").removeClass("panel-default").css('border-color', color);
    //$(popUp).find(".popup-title").parent().parent().css('background-color', color).css('border-color', color).css('opacity', 1);
    $(popUp).find(".popup-title").parent().parent().css('opacity', 1);
    // $(popUp).find(".panel-clipped").removeClass("panel-clipped-faded-out");
    // $(popUp).find(".popup-title").parent().parent().removeClass("panel-heading-faded-out");
    //$(popUp).find(".panel-footer").removeClass("hide-footer");
    _PopUp_setBodyHeight(popUp);
    if ($(popUp).find(document.activeElement).length == 0)
        $(document.activeElement).blur();
    if (UI_isMain(PopUp_getID(popUp)))
        SB_show();
}

function PopUp_loseFocus($popUps)
{
    $popUps.each(function(index) {
        var defaultBorder = $(this).find('.panel').data('default-border');
        var defaultHeader = $(this).find('.panel').data('default-header');
        $(this).css("z-index", "100").find(".panel").addClass("panel-default").removeClass("panel-primary").css('border-color', defaultBorder);
        // $(this).find('.popup-title').parent().parent().css('background-color', defaultHeader).css('border-color', defaultBorder);
        $(this).find('.popup-title').parent().parent().css('opacity', 0.6);
        // $(this).find(".panel-clipped").addClass("panel-clipped-faded-out");
        // $(this).find(".popup-title").parent().parent().addClass("panel-heading-faded-out");
        //$(this).find(".panel-footer").addClass("hide-footer");
        _PopUp_setBodyHeight($(this));
    });
}

function PopUp_giveFocusToID(id)
{
    popUp = $('.'+POPUP_CLASS).find("#"+id).parent();
    PopUp_giveFocus(popUp);
}
function PopUp_hasFocus(popUp)
{
    return $(popUp).find(".panel").hasClass("panel-primary");
}
function PopUp_updateSize(popUp)
{
    $(popUp).find('.panel').css({
        width: $(popUp).css('width'),
        height: $(popUp).css('height'),
    });
    _PopUp_setBodyHeight(popUp);
}
function PopUp_isMain(popUp)
{
    return popUp.id == 'popup-main';
}
function PopUp_makeMain(popUp)
{
    popUp.id = 'popup-main';
    var id = PopUp_getID(popUp);
    if (UI_isPinned(id))
        UI_unpin(id);
    UI_setMain(id);
    try{
        $(popUp).find('.panel').resizable('destroy');
    }
    catch (e) {
    }
}
function PopUp_hasMain(popUp)
{
    return $("#popup-main").length > 0;
}
function PopUp_makeResizable(popUp)
{
    $(popUp).find(".panel").resizable({
        stop: function(e, ui){
            $(this).parent().css("height", $(this).css("height"));
            $(this).parent().css("width", $(this).css("width")); 
            _PopUp_setBodyHeight(this);
        },
    });
}
/***************************************************
 * Event Listeners from clients
 **************************************************/

function PopUp_addCloseListener(listener)
{
    PopUp_closeListeners.push(listener);
}
function PopUp_addEditListener(listener)
{
    PopUp_editListeners.push(listener);
}
function PopUp_callCloseListeners(id)
{
    $(PopUp_closeListeners).each(function(index) {
        this(id);
    });
}
function PopUp_callEditListeners(id, field, value)
{
    $(PopUp_editListeners).each(function(index) {
        this(id, field, value);
    });
}
/***************************************************
 * Miscellaneous
 **************************************************/

function _PopUp_getPopUp(child)
{
    var popUp = child;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    return popUp;
}
function PopUp_map(apply)
{
    $('.' + POPUP_CLASS).not("#popup-main").each(function(index) {
        apply(this, false);
    });
    $("#popup-main").each(function(index) {
        apply(this, true);
    });
}

function PopUp_setColor(popUp, color)
{
    $(popUp).find('.panel').data('my-color', color);

    // TODO: bad idea to hardwire the default color?
    var defaultBorder = '#DDDDDD';
    var defaultHeader = '#F5F5F5';
    // if (THEME != 'w')
    // {
    //     defaultBorder = '#282828';
    //     defaultHeader = '#3C3C3C';
    // }

    $(popUp).find('.panel').data('default-border', defaultBorder);
    $(popUp).find('.panel').data('default-header', defaultHeader);
    $(popUp).find('.popup-title').parent().parent().css('background-color', color).css('border-color', color);
    //$(popUp).find('.panel').css('border-color', color);
    if (!PopUp_hasFocus(popUp))
    {
        $(popUp).find('.popup-title').parent().parent().css('opacity', 0.6);
        // $(popUp).find(".panel-clipped").addClass("panel-clipped-faded-out");
        // $(popUp).find(".popup-title").parent().parent().addClass("panel-heading-faded-out");
    }
}
/***********************************************************
 * This module provides an easy interface for calling functions
 * at regular intervals. Also have support for switching
 * to a longer interval if the user is inactive. Intervals
 * are assumed to be factors of 10 seconds.
 **********************************************************/
var RF_ACTIVE = true;
var RF_timeoutIDs = [];
var RF_INTERVAL = 10 * 1000;
var RF_FUNCTIONS = [];
var RF_MAX = 1000000;
var RF_COUNT = 0;
function RF_init()
{
    $(window).on('mousemove click', function(){
        $.each(RF_timeoutIDs, function(index){
            window.clearTimeout(this);
        });
        RF_timeoutIDs = [];
        RF_ACTIVE = true;
        RF_timeoutIDs.push(window.setTimeout(function(){
            RF_ACTIVE = false;
        }, 30*1000));
    });
    window.setInterval(function(){
        RF_COUNT = (RF_COUNT + 1) % RF_MAX;
        RF_callRecurringFunctions(RF_COUNT);
    }, RF_INTERVAL);
}
function RF_addRecurringFunction(recurringFunction, defaultInterval, idleInterval)
{
    RF_FUNCTIONS.push({
        recurringFunction: recurringFunction,
        defaultInterval: parseInt(defaultInterval / RF_INTERVAL),
        idleInterval: parseInt(idleInterval / RF_INTERVAL),
    });
}
function RF_callRecurringFunctions(count)
{
    $.each(RF_FUNCTIONS, function(index, functionDict){
        if (!RF_ACTIVE && (count % functionDict.idleInterval) == 0)
            functionDict.recurringFunction();
        else if ((count % functionDict.defaultInterval) == 0)
            functionDict.recurringFunction();
    });
}
/***********************************************************
 * Inspired by UISegmentedControl in the iOS SDK.
 * Segmented Controls are button groups in which only
 * one button may be selected.
 **********************************************************/

/*
 * choices = [
 *  {
 *      value:
 *      pretty:
 *      selected: 
 *  }
 * ]
 */
function SC_initWithChoices(heading, choices)
{
    $container = $('<div>').addClass('segmented-control').append($('<h5>'));
    $container.find('h5').text(heading);
    var $control = $('<div>').addClass('btn-group');
    $.each(choices, function(index){
        var $button = $('<button>').addClass('btn').addClass('btn-sm').text(this.pretty).data('value', this.value).on('click', function(ev){
            ev.preventDefault();
            SC_select(this);
        });;
        $control.append($button);
        if (this.selected || index == 0)
            SC_select($button);
    });
    $container.append($control);
    return $container[0];
}

function SC_setToChoices(sc, choices)
{
    $(sc).find('button').each(function(index){
        for (var i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (choice.value == $(this).data('value'))
            {
                if (choice.selected)
                    SC_select(this, true);
                break;
            }
        };
    });
}

function SC_removeAllFromContainer(container)
{
    $(container).find('.segmented-control').remove();
}

function SC_select(button, silent)
{
    silent = silent || false;
    SC_unhighlight($(button).parent().find('.btn-primary'));
    SC_highlight(button);
    if (silent)
        return;
    var choices = {};
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
function SC_highlight(button)
{
    $(button).addClass('btn-primary');
}
function SC_unhighlight(button)
{
    $(button).removeClass('btn-primary');
}
function SC_isHighlighted(button)
{
    return $(button).hasClass('btn-primary');
}
/***********************************************************
 * Segmented control with support for multiple selections
 * Requires Segmented Control module
 **********************************************************/

function SCM_initWithChoices(heading, choices)
{
    var sc = SC_initWithChoices(heading, choices);
    $(sc).find('button').each(function(index){
        $(this).off('click');
        $(this).on('click', function(ev){
            ev.preventDefault();
            if (SC_isHighlighted(this))
                SCM_deselect(this);
            else
                SCM_select(this);
        });
        SCM_setToChoices(sc, choices);
    });
    return sc;
}
function SCM_select(button)
{
    SC_highlight(button);
    var choices = {};
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
function SCM_deselect(button)
{
    SC_unhighlight(button);
    var choices = {};
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
function SCM_setToChoices(scm, choices)
{
    $(scm).find('button').each(function(index){
        SCM_deselect(this);
        for (var i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (choice.value == $(this).data('value'))
            {
                if (choice.selected)
                    SCM_select(this);
                break;
            }
        };
    });
}
/***********************************************************
 * Segmented Control in bootstrap popover.
 * Meant to be used with forms.
 **********************************************************/

function SCP_initOnElement(element, container, heading, choices)
{
    if ($(element).data('scp'))
    {
        var scp = $(element).data('scp');
        SC_setToChoices(scp, choices);
        return scp;
    }
    var sc = SC_initWithChoices(null, choices);
    $(sc).find('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
    $(element).popover({
        title: heading,
        placement: 'left',
        html: true,
        content: sc,
        trigger: 'focus',
        container: $(container)
    });
    $(element).data('scp', sc);
    return sc;
}
/***********************************************************
 * A generic set data structure
 **********************************************************/

var Set = function()
{ 
}
Set.prototype.size = 0;
Set.prototype.add = function(item) {
    this[item] = true;
    this.size++;
}
Set.prototype.remove = function(item) {
    if (item in this)
    {
        delete this[item];
        this.size--;
    }
}
Set.prototype.fromArray = function(array){
    var ret = new Set();
    for (var i = 0; i < array.length; i++) {
        ret.add(array[i]);
    };
    return ret;
}
Set.prototype.toArray = function(){
    var ret = [];
    for (var key in this) {
        if (typeof this[key] != 'function' && key != 'size')
            ret.push(key);
    };
    ret.sort();
    return ret;
};
Set.prototype.contains = function(a){
    for (var key in a) {
        if (!(key in this))
            return false;
    };
    return true;
};
Set.prototype.equals = function(a){
    return this.contains(a) && a.contains(this);
};
Set.prototype.isEmpty = function(a){
    return this.size <= 0;
}
/***********************************************************
 * Sidebar singleton.
 * Works with popup module, as well as notifications
 * An element is considered in the sidebar if it has class "in"
 * The sidebar by default isn't filled. That means it only
 * shows 1/3 of its width and does not fill the screen.
 * Call SB_fill to fill the screen.
 **********************************************************/

var SB_willCloseListeners = [];
function SB_init()
{
    $('#sidebar').droppable({
        drop: function(ev, ui) {
            if (PopUp_hasMain())
            {
                var main = PopUp_getMainPopUp();
                PopUp_callCloseListeners(PopUp_getID(main));
                $(main).remove();
            }
            var popUp = ui.draggable[0];
            $(popUp).detach().appendTo('#sb-left-container').css({
                //position: 'relative',
                width: '100%',
                height: '350px',
                left: 'auto',
                top: 'auto',
            });
            $(popUp).addClass('sb-left-content');
            $(popUp).addClass('in');
            PopUp_updateSize(popUp);
            PopUp_makeMain(popUp);
        },
        hoverClass: 'hover-active'
    });
    $('#sidebar-target').droppable({
        over: function(ev, ui){
            SB_show();
        },
        out: function(ev, ui){
            if (SB_isEmpty())
                SB_hide();
        },
    });
}
function SB_isEmpty()
{
    return $('#sidebar').find('.in').length == 0;
}
function SB_show()
{
    $('#sidebar').addClass('in');
    $('#sb-handle').find('.glyphicon').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
}
function SB_hide()
{
    SB_callWillCloseListeners();
    SB_unfill();
    $('#sidebar').removeClass('in');
    $('#sb-handle').find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');

}
function SB_hideIfEmpty()
{
    if (SB_isEmpty())
        SB_hide();
}
function SB_isShown()
{
    return $('#sidebar').hasClass('in');
}
function SB_push(content)
{
    content = $(content).addClass('sb-left-content')[0];
    $('#sb-left-container').append(content);
    if (!SB_isShown())
        SB_show();
    setTimeout("$('#sb-left-container').find('.sb-left-content').addClass('in')", 10);
}
function SB_pop(content)
{
    $(content).removeClass('in').on('transitionend', function(){
        $(content).remove();
    });
}
function SB_setMainContent(content)
{
    $('.sb-full-content').remove();
    content = $(content).addClass('sb-full-content')[0];
    $('#sb-full-container').append(content);
    setTimeout("$('#sb-full-container').find('.sb-full-content').addClass('in')", 10);
}
function SB_fill()
{
    $('#sidebar').addClass('full');
    disableAllInteractions();
}
function SB_unfill()
{
    $('#sidebar').removeClass('full');
    SB_pop($('.sb-full-content'));
    enableAllInteractions();
}
function SB_isFilled()
{
    return $('#sidebar').hasClass('full');
}
function SB_toggle()
{
    if (SB_isShown())
        SB_hide();
    else
        SB_show();
}
function SB_addWillCloseListener(listener)
{
    SB_willCloseListeners.push(listener);
}
function SB_callWillCloseListeners()
{
    $.each(SB_willCloseListeners, function(index){
        this();
    });
}
function AR_init()
{
    //var profHeaderHeight = $('#profHeader').css('height');
    //var courseListHeight = $('#course-list').parent().parent().css('height');
    $(window).on('resize', function(ev){
        AR_adjustHeight();
    });
    AR_adjustHeight();
}
function AR_adjustHeight()
{
    var topPos = $('#auto-results').offset().top;
    $('#auto-results').css('max-height', window.innerHeight - parseInt(topPos) -10 +"px");
}
function AR_reloadWithData(data, term)
{
    $('#auto-results').html('');

    term = term.replace(/\D\d+\D/g, function(text){
        return text.charAt(0) + ' ' + text.substring(1, text.length - 1) + ' ' + text.slice(-1);
    });
    term = term.replace(/\D\d+/g, function(text){
        return text.charAt(0) + ' ' + text.substring(1);
    });
    term = term.replace(/\d+\D/g, function(text){
        return text.substring(0, text.length - 1) + ' ' + text.slice(-1);
    });
    term = term.split(/\s+/g);
    term = $.grep(term,function(n){ return(n) }); // strip empty strings
    term = term.join('|');
    term = '(' + term + ')';
    
    var regEx = new RegExp(term, 'gi');
    $.each(data, function(index, courseDict){
        var $resultItem = $(CacheMan_load('/auto-template'));
        $resultItem.appendTo('#auto-results');
        var courseListings = courseDict.course_listings;
        $resultItem.find('#course-listing').html(AR_highlightWithRegex(courseDict.course_listings, regEx));
        $resultItem.find('#course-title').html(AR_highlightWithRegex(courseDict.course_title, regEx));
        $resultItem.data('course_id', courseDict.course_id);
        $resultItem.on('click', function(ev){
            ev.preventDefault();
            AR_select($(this));
        });
    });
}
function AR_highlightWithRegex(subject, regex)
{
    return subject.replace(regex, function(text){
        return '<span style="background-color: yellow">' + text + '</span>';
    });
}
function AR_select($resultItem)
{
    var courseID = $resultItem.data('course_id');
    CourseMan_enrollInCourseID(courseID);
    CL_selectID(courseID);
    $('#class').val('');
    $( "#class" ).autocomplete('destroy');
    $('#auto-results').html('');
    setTimeout(function(){
        createAuto();
    }, 10);
}
function Cal_init() {
    if (CAL_INIT)
        return;
    CAL_INIT = true;
    var height = '410';//window.innerHeight * 0.6;
    Cal_options.height = height;
    Cal_options.header = false;
    /* Cal_options.theme = true; */
    Cal_options.weekends = false;
    Cal_options.columnFormat = {
        month: 'ddd',    // Mon
        week: 'dddd', // Mon
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

    Cal_reload();

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

        var shouldHighlight = UI_isPinned(eventDict.course_id) || UI_isMain(eventDict.course_id);
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

        var eventStartTZ = moment.unix(eventDict.event_start);
        if (MAIN_TIMEZONE)
            eventStartTZ = eventStartTZ.tz(MAIN_TIMEZONE);
        var eventEndTZ =  moment.unix(eventDict.event_end);
        if (MAIN_TIMEZONE)
            eventEndTZ = eventEndTZ.tz(MAIN_TIMEZONE); 
        Cal_eventSource.events.push({
            id: eventDict.event_id,
            title: CourseMan_getCourseByID(eventDict.course_id).course_primary_listing,
            start: eventStartTZ.toISOString(),
            end: eventEndTZ.toISOString(),
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
var CL_LOADING = false;

function CL_init()
{
    CourseMan_addUpdateListener(function(){
        CL_reload();
    });
    CL_reload();
    PopUp_addCloseListener(function(id){
        CL_unhighlight($('#'+id+'.course-item.panel'));
    });
}

function CL_reload()
{
    if (CL_LOADING)
        return;
    CL_LOADING = true;
    var courseList = $('#course-list')[0];
    courseList.innerHTML = null;
    $.each(CourseMan_getEnrolledCourses(), function(index){
        var courseDict = CourseMan_getCourseByID(this);
        var $courseItem = $(CacheMan_load('/course-template')).appendTo(courseList);
        $courseItem.find('.course-title').text(courseDict.course_listings)[0];
        var sectionNames = [];
        $.each(CourseMan_getEnrolledSectionIDs(this), function(index){
            var section = CourseMan_getSectionByID(this);
            if (section.section_name == "All Students")
                return;
            sectionNames.push(section.section_name);
        });
        sectionNames.sort();
        $courseItem.find('.course-sections').text(sectionNames.join(', '));
        $courseItem.find('.panel')[0].id = this;
        $courseItem.find('a').on('click', function(ev){
            ev.preventDefault();
            CL_clickCourse(this);
        });
        CL_setColors($courseItem, courseDict);

        if (UI_isMain(this) || UI_isPinned(this))
            CL_highlight($courseItem.find('.panel'));
    });
    if (THEME == 'w')
        $('.theme').removeClass('dark');
    else
        $('.theme').addClass('dark');
    CL_LOADING = false;
}

function CL_clickCourse(anchor)
{
    var coursePanel = $(anchor).find('.panel')[0];

    if (CL_isHighlighted(coursePanel))
    {
        var id = coursePanel.id;
        PopUp_giveFocusToID(id);
        var myCourseID = coursePanel.id;
        $.each($('#calendarui').fullCalendar('clientEvents'), function(index) {
            var eventDict = EventsMan_getEventByID(this.id);
            if (eventDict.course_id != myCourseID)
            {
                Cal_unhighlightEvent(this, true);
                console.log('unhighlight ' + eventDict.course_id);
            }
            else
            {
                Cal_highlightEvent(this, true);
                console.log('highlight ' + eventDict.course_id);
            }
        });    
        return;
    }

    if (SHIFT_PRESSED)
    {
    }

    CL_unhighlight($('.panel-primary.course-item').filter(function(){
        return !UI_isPinned(this.id);
    }));
    CL_highlight(coursePanel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setToCourseID(popUp, coursePanel.id);
    PopUp_giveFocus(popUp);

    // find calendar events with the same course_id
    // then highlight them
    var myCourseID = coursePanel.id;
    $.each($('#calendarui').fullCalendar('clientEvents'), function(index) {
        var eventDict = EventsMan_getEventByID(this.id);
        if (eventDict.course_id != myCourseID)
        {
            Cal_unhighlightEvent(this, true);
            console.log('unhighlight ' + eventDict.course_id);
        }
        else
        {
            Cal_highlightEvent(this, true);
            console.log('highlight ' + eventDict.course_id);
        }
    });
}

function CL_selectID(courseID)
{
    var coursePanel = $('#'+courseID+'.panel.course-item').parent()[0];
    CL_clickCourse(coursePanel);
}

/***************************************************
 * Appearance
 **************************************************/
function CL_highlight(course)
{
    if (CL_isHighlighted(course))
        return;
    // var newColor = $(course).data('new-color');
    $(course).addClass('panel-primary').removeClass('panel-default');
    $(course).css('border-color', $(course).data('course-color'));
    // $(course).css('background-color', newColor);
}

function CL_unhighlight(course)
{
    if (!CL_isHighlighted(course))
        return;
    $(course).addClass('panel-default').removeClass('panel-primary');
    $(course).css('border-color', $(course).data('default-border'));
}

function CL_isHighlighted(course)
{
    return $(course).hasClass('panel-primary');
}

function CL_setColors(course, courseDict)
{
    var courseColor = COURSE_COLOR_MAP[courseDict.course_id];
    var defaultBorder = $(course).find('.panel').css('border-color');
    // $(course).data('new-color', courseColor);
    // $(course).find('.panel-default').addClass(courseColorClass).css('border-color', courseColor);
    $(course).find('.course-title').css('color', courseColor);
    $(course).find('.panel').data('default-border', defaultBorder);
    $(course).find('.panel').data('course-color', courseColor);
}
var CourseManager = function(){};
CourseManager.prototype.courseSectionsMap = {};
CourseManager.prototype.enrolledCourses = function(){
    var ret = [];
    for (var courseID in this.courseSectionsMap)
        ret.push(courseID);
    return ret;
};
CourseManager.prototype.allCourses = {};
CourseManager.prototype.allSections = {};
CourseManager.prototype.isIdle = true;
CourseManager.prototype.queue = [];
CourseManager.prototype.modified = false;
CourseManager.prototype.queries = {};

var courseManager = null;
var CourseMan_updateListeners = [];
var DEFAULT_SECTION_COLORS;

function CourseMan_init()
{
    courseManager = new CourseManager();
    CourseMan_pullEnrolledCourseIDs(function(){
        CourseMan_cacheEnrolledCourses();
    }); 
    setInterval(function(){
        CourseMan_pushChanges(true);
    }, 10 * 1000); 
    CourseMan_addUpdateListener(function(){
        CourseMan_pushChanges(true);
    });
    $(window).on('beforeunload', function(){
        CourseMan_pushChanges(false);
    });
}

/**************************************************
 * Client methods
 * These are strictly interactions between the event
 * manager and the client. It does NOT talk to 
 * the server.
 **************************************************/

/*
 * {
 *  course_id:
 *  course_name:
 *  course_description:
 *  course_professor:
 *  course_listings:
 *  sections: {
 *      section_type: [section_id]
 *  }
 * }
 */
function CourseMan_getCourseByID(id)
{
    if (!(id in courseManager.allCourses))
        CourseMan_pullCourseByID(id, false);
    return courseManager.allCourses[id];
}

function CourseMan_getEnrolledCourses()
{
    return courseManager.enrolledCourses();
}

function CourseMan_getEnrolledSectionIDs(courseID)
{
    return courseManager.courseSectionsMap[courseID];
}

/*
 * {
 *  section_id:
 *  section_name:
 * }
 */
function CourseMan_getSectionByID(id)
{
    return courseManager.allSections[id];
}

function CourseMan_courseEnrolled(courseID)
{
    return courseID in courseManager.courseSectionsMap;
}

function CourseMan_enrollInCourseID(courseID)
{
    if (CourseMan_courseEnrolled(courseID))
        return;
    var course = CourseMan_getCourseByID(courseID);
    // enroll in All Students
    var allStudentsID = course.sections['all students'][0];
    courseManager.courseSectionsMap[courseID] = [allStudentsID];
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}
function CourseMan_unenrollCourseID(courseID)
{
    if (!CourseMan_courseEnrolled(courseID))
        return;
    delete courseManager.courseSectionsMap[courseID];
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}
function CourseMan_sectionEnrolled(courseID, sectionID)
{
    var ret = false;
    $.each(courseManager.courseSectionsMap[courseID], function(index){
        if (this == sectionID)
        {
            ret = true;
            return false;
        }
    });
    return ret;
}
function CourseMan_enrollSectionID(courseID, sectionID)
{
    if (CourseMan_sectionEnrolled(courseID, sectionID))
        return;
    courseManager.courseSectionsMap[courseID].push(sectionID);
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}
function CourseMan_unenrollSectionID(courseID, sectionID)
{
    if (!CourseMan_sectionEnrolled(courseID, sectionID))
        return;
    var sectionsArray = courseManager.courseSectionsMap[courseID];
    var index = sectionsArray.find(sectionID);
    sectionsArray.splice(index, 1);
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}

/***************************************************
 * Server code
 **************************************************/
 
function CourseMan_pullEnrolledCourseIDs(complete)
{
    if (!courseManager.isIdle)
    {
        courseManager.queue.push({
            call: CourseMan_pullEnrolledCourses,
            arg1: complete,
        });
        return;
    }
    courseManager.isIdle = false;
    $.ajax('/get/sections', {
        dataType: 'json',
        success: function(data){
            courseManager.courseSectionsMap = data;
            courseManager.isIdle = true;
            if (complete)
                complete();
            CourseMan_handleQueue();
            CourseMan_callUpdateListeners();
        },
        error: function(data){
            courseManager.isIdle = true;
            CourseMan_handleQueue();
        }
    });
}

function CourseMan_pullCourseByID(courseID, async)
{
    // does not have to respect idleness because it deals with
    // a different data structure
    $.ajax('/get/course/'+courseID, {
        dataType: 'json',
        async: async,
        loadingIndicator: false,
        success: function(data){
            CourseMan_saveCourseDict(data);
            CourseMan_callUpdateListeners();
        }
    });
}

function CourseMan_pushChanges(async)
{
    if (!courseManager.modified)
        return;
    if (!courseManager.isIdle)
    {
        courseManager.queue.push({
            call: CourseMan_pushChanges,
            arg1: async,
        });
        return;
    }
    courseManager.isIdle = false;
    var dataSent = JSON.stringify(courseManager.courseSectionsMap)
    $.ajax('/put/sections', {
        async: async,
        type: 'POST',
        data: {
            sections: dataSent,
        },
        success: function(data){
            courseManager.isIdle = true;
            if (dataSent == JSON.stringify(courseManager.courseSectionsMap))
            {
                courseManager.modified = false;
            }
            CourseMan_handleQueue();
            LO_showTemporaryMessage('Saved', LO_TYPES.SUCCESS);
        },
        error: function(data){
            courseManager.isIdle = true;
            CourseMan_handleQueue();
        }
    });
}

function CourseMan_cacheEnrolledCourses()
{
    $.each(courseManager.enrolledCourses(), function(index, courseID){
        if (!(courseID in courseManager.allCourses))
            CourseMan_pullCourseByID(courseID, true);
    });
}

function CourseMan_handleQueue()
{
    if (courseManager.queue.length > 0)
    {
        var queued = courseManager.queue.shift();
        queued.call(queued.arg1);
    }
}

function CourseMan_pullAutoComplete(request, complete)
{
    if (request.term in courseManager.queries)
    {
        if (complete)
            complete(courseManager.queries[request.term]);
        return;
    }
    $.getJSON('/api/classlist', request, function(data, status, xhr){
        // process data
        $.each(data, function(index){
            CourseMan_saveCourseDict(this);
        });
        courseManager.queries[request.term] = data;
        if (complete)
            complete(data);
    });
}

function CourseMan_saveCourseDict(courseDict)
{
    for (var type in courseDict.sections)
    {
        for (var i in courseDict.sections[type])
        {
            var section = courseDict.sections[type][i];
            courseManager.allSections[section.section_id] = section;
            courseDict.sections[type][i] = section.section_id;
        }
    }
    courseManager.allCourses[courseDict.course_id] = courseDict;
}

/***************************************************
 * Client event listeners
 **************************************************/

function CourseMan_addUpdateListener(listener)
{
    CourseMan_updateListeners.push(listener);
}

function CourseMan_callUpdateListeners()
{
    $.each(CourseMan_updateListeners, function(index){
        this();
    });
}
function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    eventsManager.loadedCourseIDs = new Set();
    EventsMan_pullFromServer(function(){
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
    });
    CourseMan_addUpdateListener(function(){
        EventsMan_pullFromServer();
        _EventsMan_callUpdateListeners();
    });
}
function EventsMan_pullFromServer(complete)
{
    if (!eventsManager.isIdle)
        return;
    var courseIDs = CourseMan_getEnrolledCourses();
    var filtered = [];
    for (var i = 0; i < courseIDs.length; i++) {
        var id = courseIDs[i];
        if (!(id in eventsManager.loadedCourseIDs))
            filtered.push(id);
    };
    if (filtered.length == 0)
        return;
    eventsManager.isIdle = false;
    var start = moment.unix(CUR_SEM.start_date);
    var end = moment.unix(CUR_SEM.start_date);
    start.week(start.week() + 1);
    end.week(start.week() + 1);

    $.ajax('/get/bycourses/0/' + start.unix() + '/' + end.unix(), {
        dataType: 'json',
        type: 'GET',
        data: {
            'courseIDs': JSON.stringify(courseIDs)
        },
        success: function(data){
            var eventsArray = data;
            if (data.length == 0)
            {
                eventsManager.isIdle = true;
                _EventsMan_callUpdateListeners();
                return;
            }
            for (var i = 0; i < eventsArray.length; i++)
            {
                var eventsDict = eventsArray[i]; 
                eventsManager.events[eventsDict.event_id] = eventsDict;
            }
            EventsMan_constructOrderArray();
            eventsManager.lastSyncedTime = moment().unix();
            for (var i = 0; i < filtered.length; i++) {
                eventsManager.loadedCourseIDs.add(filtered[i]);
            };
            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
        }
    });
}

function EventsMan_getEnrolledEvents()
{
    var sectionIDs = [];
    $.each(CourseMan_getEnrolledCourses(), function(index){
        $.each(CourseMan_getEnrolledSectionIDs(this), function(index){
            sectionIDs.push(parseInt(this));
        });
    });
    var ret = [];
    $.each(eventsManager.events, function(eventID, eventDict){
        if (sectionIDs.contains(eventDict.section_id))
            ret.push(eventID);
    });
    return ret;
}
KEY_UP = 38;
KEY_DOWN = 40;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_SQ_BRACE_R = 221;
KEY_SQ_BRACE_L = 219;
KEY_SHIFT = 16;
var SHIFT_PRESSED = false;
$(document).keydown(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_SHIFT:
            SHIFT_PRESSED = true;
            break;
    }
});
$(document).keyup(function(){
    SHIFT_PRESSED = false;
});
var DEFAULT_SECTION_COLORS;
var COURSE_COLOR_MAP = {};
var USABLE_COLORS = [];

$(init)

function init()
{
    // // setup for loading icon
    // $(document).on({
    //     ajaxStart: LO_show(),
    //     ajaxStop: LO_hide(),
    // });

    pinnedIDs = new Set();
    moment.tz.add({
        "zones": {
            "America/New_York": [
                "-4:56:2 - LMT 1883_10_18_12_3_58 -4:56:2",
                "-5 US E%sT 1920 -5",
                "-5 NYC E%sT 1942 -5",
                "-5 US E%sT 1946 -5",
                "-5 NYC E%sT 1967 -5",
                "-5 US E%sT"
            ]
        },
        "rules": {
            "US": [
                "1918 1919 2 0 8 2 0 1 D",
                "1918 1919 9 0 8 2 0 0 S",
                "1942 1942 1 9 7 2 0 1 W",
                "1945 1945 7 14 7 23 1 1 P",
                "1945 1945 8 30 7 2 0 0 S",
                "1967 2006 9 0 8 2 0 0 S",
                "1967 1973 3 0 8 2 0 1 D",
                "1974 1974 0 6 7 2 0 1 D",
                "1975 1975 1 23 7 2 0 1 D",
                "1976 1986 3 0 8 2 0 1 D",
                "1987 2006 3 1 0 2 0 1 D",
                "2007 9999 2 8 0 2 0 1 D",
                "2007 9999 10 1 0 2 0 0 S"
            ],
            "NYC": [
                "1920 1920 2 0 8 2 0 1 D",
                "1920 1920 9 0 8 2 0 0 S",
                "1921 1966 3 0 8 2 0 1 D",
                "1921 1954 8 0 8 2 0 0 S",
                "1955 1966 9 0 8 2 0 0 S"
            ]
        },
        "links": {}
    });

    LO_init();
    
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            if (settings.loadingIndicator == false)
                return;
            LO_showLoading(settings.url);
        }
    });
    $(document).ajaxSuccess(function(event, xhr, settings){
        LO_hideLoading(settings.url);
    });
    $(document).ajaxError(function(event, xhr, settings){
        LO_hideLoading(settings.url, false);
        if (settings.loadingIndicator == false)
            return;
        LO_showError(settings.url);
    });
    SB_profile_init();
    CacheMan_init();
    CourseMan_init();
    EventsMan_init();
    Cal_init();
    PopUp_init();
    CL_init();
    UP_init();
    AR_init();

    SECTION_COLOR_MAP = JSON.parse(CacheMan_load('/get/section-colors'));
    DEFAULT_SECTION_COLORS = JSON.parse(CacheMan_load('/get/default-section-colors'));
    courseColorMap_init();
    usableColor_init();
    if (THEME == 'w')
        loadWhiteTheme();
    else
        loadDarkTheme();
}

function enableAllInteractions()
{
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

function courseColorMap_init() {
    $.each(SECTION_COLOR_MAP, function(key, value) {
        COURSE_COLOR_MAP[value['course_id']] = value['color'];
    });

}

function usableColor_init() {
    $.each(DEFAULT_SECTION_COLORS, function(index, color) {
        var curr_available = true;
        $.each(COURSE_COLOR_MAP, function(key, value) {
            if (value == color)
            {
                curr_available = false;
                return false;
            }
        });
        if (curr_available)
        {
            USABLE_COLORS.push(color);
        }
    });
}

function getUsableColor(course_id) {
    var color = USABLE_COLORS.shift();
    if (!color)
    {
        color = DEFAULT_SECTION_COLORS[0];
    }

    // if (!COURSE_COLOR_MAP[course_id])
    COURSE_COLOR_MAP[course_id] = color;

    return color;
}
POPUP_CLASS = 'popup-course';
POPUP_URL = '/popup-course-template';

function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;
    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };
    
    // setting bounds
    topPos = 0;
    height = window.innerHeight - topPos + 300;
    $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    $(window).on('resize', function(ev){
        topPos = 0;
        height = window.innerHeight - topPos + 300;
        $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    });
}

function PopUp_initialize(popUp)
{
    $(popUp).find('#delete_button').on('click', function(ev){
        ev.preventDefault();
        var id = PopUp_getID(popUp)
        PopUp_callCloseListeners(id)
        PopUp_close(popUp)
        CourseMan_unenrollCourseID(id);
    });
}

function PopUp_setToCourseID(popUp, courseID)
{
    PopUp_setID(popUp, courseID);
    var courseDict = CourseMan_getCourseByID(courseID);
    if (!courseDict)
    {
        console.log("errorneous course id");
        return;
    }

    var courseColor = COURSE_COLOR_MAP[courseID];
    if (!courseColor)
        courseColor = getUsableColor(courseID);

    PopUp_setListing(popUp, courseDict.course_listings);
    PopUp_setTitle(popUp, courseDict.course_title);
    PopUp_setDescription(popUp, courseDict.course_description);
    PopUp_setColor(popUp, courseColor);

    SC_removeAllFromContainer(popUp);
    var enrolledSections = CourseMan_getEnrolledSectionIDs(courseID);
    $.each(courseDict.sections, function(sectionType, sectionList){
        if (sectionType == 'all students')
            return;
        var choices = [];
        var enrolled = false;
        $.each(sectionList, function(index){
            var section = CourseMan_getSectionByID(this);
            choices.push({
                value: section.section_id,
                pretty: section.section_name,
                selected: enrolledSections.contains(section.section_id),
            });
            enrolled |= enrolledSections.contains(section.section_id);
        });
        choices.sort(function(a, b){
            return a.pretty.localeCompare(b.pretty);
        });
        var segmented = SC_initWithChoices(toTitleCase(sectionType), choices);
        if (!enrolled)
            CourseMan_enrollSectionID(courseID, choices[0].value);
        //$(popUp).find('#popup-title').after(segmented);
        $(popUp).find('#sections-container').append(segmented);
        $(segmented).on('select', function(ev, choices){
            $.each(choices, function(sectionID, enroll){
                if (enroll)
                    CourseMan_enrollSectionID(courseID, sectionID);
                else
                    CourseMan_unenrollSectionID(courseID, sectionID);
            });

            CL_selectID(courseID);
        });
    });
}
function PopUp_setListing(popUp, listing)
{
    $(popUp).find('#popup-listing').text(listing);
}
function PopUp_setTitle(popUp, title)
{
    $(popUp).find('#popup-title').text(title);
}
function PopUp_setDescription(popUp, description)
{
    $(popUp).find('#popup-desc').html(nl2br(description));
}

function PopUp_clickedClose(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}
$(function() {
    createAuto();
});
function createAuto()
{
    $( "#class" ).autocomplete({
        minLength: 2,
        source: function( request, response ) {
            var term = request.term;
            CourseMan_pullAutoComplete(request, function(data){
                var ret = [];
                $.each(data, function(index){
                    ret.push({
                        id: this.course_id,
                        value: this.course_listings,
                        label: this.course_listings,
                        desc: this.course_title,
                    });
                });
                AR_reloadWithData(data, term);
                response(ret);
                /* data should be like 
                 * [{
                 * value: "jquery",
                 * label: "jQuery",
                 * desc: "the write less, do more, JavaScript library"
                 * },] */
            });
        },
        select: function( event, ui ) {
            var courseID = ui.item.id;
            CourseMan_enrollInCourseID(courseID);
            $('#class').val('');
            CL_selectID(courseID);
            return false;
        },
        autoFocus: true,
    });
}
function SB_profile_init()
{
    $('#sidebar').droppable({
        drop: function(ev, ui) {
            if (PopUp_hasMain())
            {
                var main = PopUp_getMainPopUp();
                PopUp_callCloseListeners(PopUp_getID(main));
                $(main).remove();
            }
            var popUp = ui.draggable[0];
            $(popUp).detach().appendTo('#sb-left-container').css({
                //position: 'relative',
                width: '100%',
                height: '550px',
                left: 'auto',
                top: 'auto',
            });
            $(popUp).addClass('sb-left-content');
            $(popUp).addClass('in');
            PopUp_updateSize(popUp);
            PopUp_makeMain(popUp);
        },
        hoverClass: 'hover-active'
    });
    $('#sidebar-target').droppable({
        over: function(ev, ui){
            SB_show();
        },
        out: function(ev, ui){
            if (SB_isEmpty())
                SB_hide();
        },
    });
}
function UP_init()
{
    $('#first_name_box').val(USER.first_name);
    $('#last_name_box').val(USER.last_name);
    $('#first_name_box').on('change', function(ev){
        USER.first_name = $(this).val();
    });
    $('#last_name_box').on('change', function(ev){
        USER.last_name = $(this).val();
    });
    $(window).on('beforeunload', function(ev){
        $.ajax('/put/user', {
            async: false,
            dataType: 'json',
            type: 'POST',
            data: {
                user: JSON.stringify(USER)
            },
        });
    });
}
