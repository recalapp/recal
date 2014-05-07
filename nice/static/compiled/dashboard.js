function AS_showActionSheetFromElement(element, container, title, choices, clickListener)
{
    var $content = $('<div>');
    $.each(choices, function(index){
        var $button = $('<a>').addClass('white-link-btn').addClass('prompt-btn').attr('id', index).text(this.text);
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
    //$(element).attr('tabindex', 0); // allows focus
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
CAL_INIT = false;
Cal_eventSource = {
    events:[],
}
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
            var $button = $('<a>').addClass('white-link-btn').addClass('theme');
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
        $ep.find('#ep-container').append($pickerItem);
   });
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
function _EventsMan_new()
{
    this.events = {};
    this.order = []; // {start: "start", id: "id"}, keep sorted
    this.lastSyncedTime = 0; // will be set when populating
    this.addedCount = 0;
    //this.deletedIDs = [];
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
    //eventsManager.order.push({event_id: id, event_start: eventDict.event_start});
    //eventsManager.order.sort(function(a,b){
    //    return parseInt(a.event_start) - parseInt(b.event_start);
    //});

    return id;
}

function EventsMan_deleteEvent(id, silent)
{
    silent = silent || false;
    if (id in eventsManager.events)
    {
        //eventsManager.events[id] = null;
        //delete eventsManager.events[id];
        //eventsManager.deletedIDs.push(id);
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
        //eventsManager.events[id] = null;
        //delete eventsManager.events[id];
        //eventsManager.deletedIDs.push(id);
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

function EventsMan_ready()
{
    return EVENTS_READY;
}
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
function EventsMan_pushToServer(async){};
function EventsMan_pullFromServer(complete){};

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

function EventsMan_cloneEventDict(eventDict)
{
    var newDict = JSON.parse(JSON.stringify(eventDict)) // hack for cloning
    return newDict;
}

function EventsMan_save()
{
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.setItem('eventsman.events', JSON.stringify(eventsManager.events));
        localStorage.setItem('eventsman.lastsyncedtime', eventsManager.lastSyncedTime);
        localStorage.setItem('eventsman.hidden', JSON.stringify(eventsManager.hiddenIDs.toArray()));
    }
}

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
var MAIN_TIMEZONE = 'America/New_York';
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
            LO_showTemporaryMessage('Connected', LO_TYPES.SUCCESS);
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
    }, 5*1000);
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

// pinned and main
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

/**
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

function loadWhiteTheme()
{
    $('.theme').removeClass('dark');
    $('#theme_css').attr('href','/static/cosmo/bootstrap.css');
}
function loadDarkTheme()
{
    $('.theme').addClass('dark');
    //if (document.createStyleSheet) {
    //    document.createStyleSheet('/static/cyborg/bootstrap.min.css');
    //}
    //else {
    //    $('#white_theme_css').after($("<link rel='stylesheet' id=\"dark_theme_css\" href='/static/cyborg/bootstrap.css'/>"));
    //}
    $('#theme_css').attr('href','/static/cyborg/bootstrap.css');
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
    var firstDragStart = function(){
        POPUP_MAIN_FIRSTDRAG(popUp);
        if (popUp.space)
            PopUp_freedSpace.push(popUp.space);
        //if (isMain)
        //{
        //            }
        //else
        //{
        //    PopUp_freedSpace.push(popUp.space);
        //    delete popUp.space;
        //}
    };
   

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
    //$(popUp).css("height", $(popUp).find(".panel").css("height"));
    popUp.id = "popup-main";
    if (!isMain)
    {
        var space;
        if (PopUp_freedSpace.length == 0)
            space = ++PopUp_space;
        else
            space = PopUp_freedSpace.sort(function(a,b){return b-a}).pop();
        popUp.id = "";
        PopUp_makeResizable(popUp);
        //$(popUp).css({
        //    position: 'fixed',
        //});
        
        //PopUp_showClose(popUp);
        leftPos = parseInt($(popUp).css("left"));
        topPos = parseInt($(popUp).css("top"));
        $(popUp).css("left", (leftPos + 20*space) + "px").css("top", (topPos + 20*space) + "px");
        popUp.space = space;
    }
    popUp.onmousedown = function(){
        PopUp_giveFocus(this);
    };
    maxHeight = window.innerHeight - $(".navbar").height() - 100;
    $(popUp).css("max-height", maxHeight+"px");
    _PopUp_setBodyHeight(popUp); 
    PopUp_initialize(popUp);
    setTimeout(function(){
        PopUp_initialize_deferred(popUp);
    }, 300) // doesn't block
    $(popUp).find('.withtooltip').tooltip({});
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
function PopUp_getPopUpByID(id)
{
    if ($('.' + POPUP_CLASS).find("#"+id).length > 0)
        return $('.' + POPUP_CLASS).find("#"+id).parent()[0];
    else
        return null;
}
function PopUp_getID(popUp)
{
    if (!popUp)
        return null;
    if (!('id' in $(popUp).find('.panel')[0]))
        return null;
    return $(popUp).find(".panel")[0].id;
}
function PopUp_setID(popUp, id)
{
    var oldId = $(popUp).find(".panel")[0].id;
    $(popUp).find(".panel")[0].id = id;
    if (popUp.id == 'popup-main')
    {
        UI_setMain(id)
    }
    else 
    {
        UI_unpin(oldId);
        UI_pin(id)
    }
}
function _PopUp_setBodyHeight(popUp)
{
    var headHeight = $(popUp).find(".panel-heading").css("height");
    var height = $(popUp).css("height");
    $(popUp).find(".panel-body").css("height", (parseInt(height) - parseInt(headHeight)) + "px");
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
    $(popUp).find("#popup-title").parent().parent().css('background-color', color).css('border-color', color);
    if (UI_isMain(PopUp_getID(popUp)))
        SB_show();
}

function PopUp_loseFocus($popUps)
{
    $popUps.each(function(index) {
        var defaultBorder = $(this).find('.panel').data('default-border');
        var defaultHeader = $(this).find('.panel').data('default-header');
        $(this).css("z-index", "100").find(".panel").addClass("panel-default").removeClass("panel-primary").css('border-color', defaultBorder);
        $(this).find('#popup-title').parent().parent().css('background-color', defaultHeader).css('border-color', defaultBorder);
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
    //SB_hideIfEmpty();
}
function SB_setMainContent(content)
{
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
    enableAllInteractions();
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
AGENDA_INIT = false;
var AGENDA_HTML = null;

/***************************************************
 * Initialization/State Restoration
 **************************************************/

function Agenda_init() {
    if (AGENDA_INIT)
        return;
    AGENDA_INIT = true;

    AGENDA_HTML = $('#agenda-template').html();
    $('#agenda-template').remove();

    EventsMan_addUpdateListener(function(){
        if (!Agenda_active())
            return;
        Agenda_reload();
    });
    $('#'+SE_id).on('close', function(ev){
        if (!Agenda_active())
            return;
        Agenda_reload();
    });


    $(".tab-pane").each(function(index){
        if (this.id == "agenda")
        {
            $(this).bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function (e){
                if ($(this).hasClass('in'))
                    Agenda_reload();
            });
        }
    });
    PopUp_addCloseListener(function(id) {
        Agenda_unhighlight($('.tab-content').find('.agenda-item.panel#'+id));
    });
    Agenda_reload();
} 

function Agenda_active()
{
    return $('#agenda').hasClass('active');
}

function Agenda_reload()
{
    LO_showLoading('agenda loading');
    var agendaContainer = $("#agenda")
    var added = false;
    agendaContainer[0].innerHTML = null;
    // yesterday 0:00:00 AM to before midnight
    var curDate = moment();
    var startDate = moment().date(curDate.date() - 1).hour(0).minute(0).second(0);
    var endDate = moment().date(curDate.date()).hour(0).minute(0).second(0);
    var eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('Yesterday');
        Agenda_loadEvents(eventIDs);
    }

    // today to midnight
    startDate = endDate;
    endDate = moment().date(curDate.date() + 1).hour(0).minute(0).second(0);
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('Today');
        Agenda_loadEvents(eventIDs);
    }

    // this week
    startDate = endDate;
    endDate = moment().date(curDate.date() + 7).hour(0).minute(0).second(0);
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('This Week');
        Agenda_loadEvents(eventIDs);
    }

    // this month
    startDate = endDate;
    endDate = moment().month(curDate.month() + 1);
    endDate = endDate.date(0) // does this go back to prev month??
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
    if (eventIDs.length > 0)
    {
        added |=true;
        Agenda_insertHeader('This month');
        Agenda_loadEvents(eventIDs);
    }
    if (!added)
    {
        Agenda_insertHeader('Congrats! You have nothing on your agenda!');
    }
    LO_hideLoading('agenda loading');
}

function Agenda_filterEvents(eventIDs)
{
    var ret = [];
    $.each(eventIDs, function(index){
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        if (AGENDA_FILTER.contains(eventDict.event_type))
            if (!(eventDict.course_id in COURSE_FILTER_BLACKLIST))
                ret.push(this);
    });
    return ret;
}

// function Agenda_loadEventsWithTime(eventIDs, time)
// {
//     if (time == 'yesterday')
//     {
//         $.each(eventIDs, function(index) {
//             var eventDict = EventsMan_getEventById(this);
//             if (eventDict['event_type'] == "AS")
//             {
//                 eventDict['overdue'] = 'true';
//             }
//         });
//     }
// }

function Agenda_loadEvents(eventIDs)
{
    var agendaContainer = $("#agenda");

    $.each(eventIDs, function(index) {
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        //agendaContainer.append(CacheMan_load("agenda-template"));
        agendaContainer.append($(AGENDA_HTML));
        var agenda = agendaContainer.find("#agenda123")[0];
        agenda.id = this;
        
        $(agenda).find(".panel-body").find('h4').text(eventDict.event_title);
        $(agenda).find('#agenda-section').text(SECTION_MAP[eventDict.section_id]);
        
        var start = moment.unix(eventDict.event_start);
        var timeText = start.tz(MAIN_TIMEZONE).calendar();
        $(agenda).find('#agenda-time').text(timeText);
        // TODO: add overdue field when creating new event
        // if (eventDict['overdue'])
        // {
        //     $(agenda).find('#agenda-time').css('color', 'red');
        // }

        // set colors in the agenda
        _Agenda_setColors(agenda, eventDict);

        if (UI_isPinned(agenda.id))
            Agenda_highlight(agenda);
        if (UI_isMain(agenda.id))
            Agenda_highlight(agenda);
        if (EventsMan_eventIsHidden(this))
        {
            // TODO(Dyland) change appearance of hidden agendas
        }
        else
        {
            // TODO(Dyland) change appearance of non-hidden agendas
        }
    });
    if (THEME == 'w')
        $('.theme').removeClass('dark');
    else
        $('.theme').addClass('dark');
}

function _Agenda_setColors(agenda, eventDict)
{
    var agendaColorClass = 'course-color-' + eventDict.course_id;
    var courseColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
    $(agenda).find('#agenda-section').addClass(agendaColorClass).css('color', courseColor);
    $(agenda).find('#agenda-title').addClass(agendaColorClass).css('color', courseColor);
    $(agenda).parent().find('.agenda-tag').addClass(agendaColorClass).css('background-color', courseColor);
    $(agenda).data('new-color', courseColor);
    // $(agenda).find('#agenda-section').closest('panel').addClass(agendaColorClass).css('border-color', '#A1B2C3');

    // $(agenda).data('new-color', '#334499');

    var oldColor = $(agenda).css('border-color');
    $(agenda).data('default-color', oldColor);
}
function Agenda_insertHeader(text)
{
    var agendaContainer = $("#agenda");
    var $agendaHeader = $('<div class="agenda-header row">');
    $('<div class="col-xs-5 col-xs-offset-1">').append('<h3 id="agenda-header-text"></h3>').appendTo($agendaHeader);
    agendaContainer.append($agendaHeader);
    $agendaHeader.find('#agenda-header-text').text(text);
}

/***************************************************
 * Event handlers
 **************************************************/

function selectAgenda(agendaAnchor)
{
    var panel = $(agendaAnchor).find(".panel")[0];
    if (Agenda_isHighlighted(panel))
    {
        var id = panel.id;
        PopUp_giveFocusToID(id);
        return;
    }

    if (SHIFT_PRESSED)
    {
        Agenda_highlight(panel);
        popUp = PopUp_insertPopUp(false);
        PopUp_setToEventID(popUp, panel.id)
        PopUp_giveFocus(popUp);
        return;
    }
    
    Agenda_unhighlight($(".agenda-item.panel-primary").filter(function(){
        return !UI_isPinned(this.id);
    }));
    Agenda_highlight(panel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setToEventID(popUp, panel.id);
    PopUp_giveFocus(popUp);
}

/***************************************************
 * Appearance
 **************************************************/

function Agenda_highlight(agenda)
{
    if (Agenda_isHighlighted(agenda))
        return;
    var newColor = $(agenda).data('new-color');
    //var newColor = '#123456';
    // var oldColor = $(agenda).css('border-color');
    // $(agenda).data('default-color', oldColor);
    $(agenda).addClass("panel-primary").removeClass("panel-default").css({
        'border-color': newColor,
    });
}
function Agenda_unhighlight(agenda)
{
    var oldColor = $(agenda).data('default-color');
    $(agenda).addClass("panel-default").removeClass("panel-primary").css({
        'border-color': oldColor,
    });;
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
var CAL_LOADING = false;
var FACTOR_LUM = 0.2;
var FACTOR_TRANS = 0.7;
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
        Cal_adjustHeight();
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
    setTimeout(function(){
        LO_showLoading('cal loading');
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
        LO_hideLoading('cal loading');
    }, 10);
}

function Cal_render() {
    $("#calendarui").fullCalendar("render");
}

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
var timeoutIDs = [];
var EVENTSMAN_COUNT = 0;
function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    if (EventsMan_load())
    {
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
        _EventsMan_callUpdateListeners();
        EventsMan_pullFromServer();
    }
    else
    {
        EventsMan_pullFromServer(function() {
            EVENTS_READY = true;
            EventsMan_callOnReadyListeners();
        }, true);
    }
    PopUp_addEditListener(function(id, field, value) {
        if (field == 'event_type')
        {
            value = TYPE_MAP_INVERSE[value.toLowerCase()];
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        else if (field == 'section_id')
        {
            value = SECTION_MAP_INVERSE[value.toLowerCase()];
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        else if (field == 'event_date')
        {
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            var eventDict = eventsManager.uncommitted[id];
            var startDate = moment.unix(eventDict.event_start);
            var endDate = moment.unix(eventDict.event_end);
            var newDate = moment(value);
            if (id in eventsManager.events && newDate.date() == startDate.date() && newDate.month() == startDate.month() && newDate.year() == startDate.year())
                return;
            startDate.year(newDate.year());
            startDate.month(newDate.month());
            startDate.date(newDate.date());
            endDate.year(newDate.year());
            endDate.month(newDate.month());
            endDate.date(newDate.date());
            eventDict.event_start = startDate.unix();
            eventDict.event_end = endDate.unix();
        }
        else if (field == 'event_start' || field == 'event_end')
        {
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
            value = 'April 25, 2014 ' + value; // gives a dummy date to satisfy moment.js
            var eventDict = eventsManager.uncommitted[id];
            var oldTime = moment.unix(eventDict[field]);
            var newTime = moment(value);
            if (id in eventsManager.events && oldTime.minute() == newTime.minute() && oldTime.hour() == newTime.hour())
                return; // TODO this creates a new revision even if no changes were made
            oldTime.hour(newTime.hour());
            oldTime.minute(newTime.minute());
            eventDict[field] = oldTime.unix();
        }
        else if (field == 'event_recurrence')
        {
            if (value)
            {
                // TODO figure out how to get last day of class (not the same as last day of semester - reading period, etc.)
                if (id in eventsManager.events 
                    && 'recurrence_days' in eventsManager.events[id]
                    && eventsManager.events[id].recurrence_days.equals(value))
                    return; // no change
                if (!(id in eventsManager.uncommitted))
                    eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
                var eventDict = eventsManager.uncommitted[id];

                value.sort();
                eventDict['recurrence_days'] = value;
                eventDict['recurrence_interval'] = 1;
                eventDict['recurrence_end'] = parseInt(CUR_SEM.end_date);
            }
            else 
            {
                // delete recurrence
                if (id in eventsManager.events
                    && !('recurrence_days' in eventsManager.events[id]))
                    return; // no change
                if (!(id in eventsManager.uncommitted))
                    eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
                var eventDict = eventsManager.uncommitted[id];

                delete eventDict['recurrence_days'];
                delete eventDict['recurrence_end'];
                delete eventDict['recurrence_interval'];
            }
        }
        else if (false && field == 'event_recurrence_interval')
        {
            if (id in eventsManager.events && eventsManager.events[id]['reccurrence_interval'] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
            var eventDict = eventsManager.uncommitted[id];
            eventDict['reccurence_interval'] = value;
        }
        else
        {
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        eventsManager.uncommitted[id].modified_time = moment().unix()
        if (!(id in eventsManager.events)) // new event
        {
            // display notifications if similar events exist.
            SE_checkSimilarEvents(eventsManager.uncommitted[id]);
            //$.post('get/similar-events', {
            //    event_dict: JSON.stringify(eventsManager.uncommitted[id]), 
            //}, function (data){
            //    NO_showSimilarEventsNotification(id, data);
            //}, 'json')
        }
        _EventsMan_callUpdateListeners()
    });

    $(window).on('beforeunload', function(ev) {
        if (Object.getOwnPropertyNames(eventsManager.uncommitted).length > 0)
        {
            ev.preventDefault()
            return 'Your changes have not been saved. Are you sure you want to leave?';
        }
        EventsMan_pushToServer(false);
        EventsMan_save();
    });

    window.setInterval(function(){
        EVENTSMAN_COUNT = (EVENTSMAN_COUNT + 1) % 30; // every 5 min. -> 30 * 10s = 300s = 5min
        if (!eventsManager.active && EVENTSMAN_COUNT != 0)
            return;
        EventsMan_pushToServer(true); 
        EventsMan_pullFromServer();
    }, 10 * 1000);
    $(window).on('mousemove click', function(){
        $.each(timeoutIDs, function(index){
            window.clearTimeout(this);
        });
        timeoutIDs = [];
        eventsManager.active = true;
        timeoutIDs.push(window.setTimeout(function(){
            eventsManager.active = false;
        }, 30*1000));
    });
}

/***************************************************
 * Server code
 **************************************************/

function EventsMan_pushToServer(async)
{
    if (!eventsManager.isIdle)
        return;
    eventsManager.isIdle = false;
    var updated = [];
    $.each(eventsManager.updatedIDs.toArray(), function(index){
        updated.push(eventsManager.events[this]);
    });
   
    //var deleted = eventsManager.deletedIDs;
    if (updated.length > 0 || eventsManager.changed)
    {
        $.ajax('/put', {
            dataType: 'json',
            type: 'POST',
            data: {
                events: JSON.stringify(updated),
                hidden: JSON.stringify(eventsManager.hiddenIDs.toArray())
            },
            success: function(data){
                var changedIDs = data.changed_ids;
                $.each(changedIDs, function(oldID, idArray){
                    var newID = idArray[0];
                    var newGroupID = idArray[1];
                    if (oldID in eventsManager.events) {
                        var eventDict = eventsManager.events[oldID];
                        delete eventsManager.events[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.events[newID] = eventDict;
                    }
                    //$.each(eventsManager.order, function(index){
                    //    if (this.event_id == oldID)
                    //    {
                    //        this.event_id = newID;
                    //        return false;
                    //    }
                    //});
                    if (oldID in eventsManager.uncommitted) {
                        var eventDict = eventsManager.uncommitted[oldID];
                        delete eventsManager.uncommitted[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.uncommitted[newID] = eventDict;
                    }
                    EventsMan_callEventIDsChangeListener(oldID, newID);
                });
                EventsMan_constructOrderArray();
                var deletedIDs = data.deleted_ids;
                $.each(deletedIDs, function(index){
                    // TODO what if the id was already opened? this code doesn't handle that
                    if (this in eventsManager.events) {
                        delete eventsManager.events[this];
                    }
                    if (this in eventsManager.uncommitted){
                        delete eventsManager.uncommitted[this];
                    }
                });
                eventsManager.isIdle = true;
                //eventsManager.addedCount = 0; // not gonna overflow, no need to set to 0. Safer, so IDs don't ever crash
                //eventsManager.deletedIDs = [];
                eventsManager.updatedIDs = new Set();
                eventsManager.changed = false;

                EventsMan_pullFromServer(null, true);
            },
            async: async,
            error: function(data){
                eventsManager.isIdle = true;
            },
        });
    } else {
        eventsManager.isIdle = true;
    }
}
function EventsMan_pullFromServer(complete, showLoading)
{
    if (!eventsManager.isIdle)
        return;
    if (eventsManager.updatedIDs.size > 0 || eventsManager.changed)
        return; // don't pull until changes are pushed
    showLoading = typeof showLoading != 'undefined' ? showLoading : false;
    eventsManager.isIdle = false;
    var url = '/get/' + eventsManager.lastSyncedTime;
    $.ajax(url, {
        dataType: 'json',
        loadingIndicator: showLoading,
        success: function(data){
            var changed = EventsMan_processDownloadedEvents(data);

            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            if (changed)
                _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
            LO_showError(url);
        },
    });
}

function EventsMan_processDownloadedEvents(data)
{
    //var eventsArray = JSON.parse(data);
    var changed = false;
    var eventsArray = data.events;
    for (var i = 0; i < eventsArray.length; i++)
    {
        var eventsDict = eventsArray[i];
        if (eventsDict.event_id in eventsManager.uncommitted)
        {
            // TODO notify user of updates
        }
        if (eventsDict.event_id in eventsManager.updatedIDs)
        {
            // TODO don't do anything?
        }
        else {
            eventsManager.events[eventsDict.event_id] = eventsDict;
        }
        changed = true;
    }
    var hiddenIDs = Set.prototype.fromArray(data.hidden_events);
    if (!hiddenIDs.equals(eventsManager.hiddenIDs) && !eventsManager.changed)
    {
        eventsManager.hiddenIDs = hiddenIDs; // NOTE ok, since we don't pull until all changes are pushed
        changed = true;
    }
    EventsMan_constructOrderArray();
    eventsManager.addedCount = 0;
    eventsManager.lastSyncedTime = moment().unix();
    return changed;
}

/***************************************************
 * Event Listeners
 **************************************************/

function EventsMan_clickAddEvent()
{
    var popUp = PopUp_getMainPopUp();
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));

    // set new ID
    var id = EventsMan_addEvent();
    PopUp_setToEventID(popUp, id);
    PopUp_markAsUnsaved(popUp);
    
    PopUp_giveFocus(popUp);
    //_EventsMan_callUpdateListeners();
}

function EventsMan_clickSync()
{
    EventsMan_pushToServer();
    SR_save();
    //var $syncButton = $('#sync-button').find('span');
    //$syncButton.addClass('icon-refresh-animate')
}
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SQ_BRACE_R = 221;
var KEY_SQ_BRACE_L = 219;
var KEY_SHIFT = 16;
var SHIFT_PRESSED = false;
$(document).keydown(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_UP:
            break;
        case KEY_DOWN:
            break;
        case KEY_LEFT:
            break;
        case KEY_RIGHT:
            break;
        case KEY_SQ_BRACE_R:
            $("#calendartab").tab('show');
            //Cal_init();
            break;
        case KEY_SQ_BRACE_L:
            $("#agendatab").tab('show');
            break;
        case KEY_SHIFT:
            SHIFT_PRESSED = true;
            break;
    }
});
$(document).keyup(function(){
    SHIFT_PRESSED = false;
});
$(init)
var NAV_ID = ["agendatab", "calendartab"];
var TAB_ID = ["agenda", "calendar"];
var SECTION_MAP;
var SECTION_MAP_INVERSE;
var COURSE_MAP;
var COURSE_SECTIONS_MAP;
var COURSE_FILTER_BLACKLIST;

function init()
{
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
    CacheMan_init();

    SECTION_MAP = JSON.parse(CacheMan_load('/all-sections'));
    SECTION_MAP_INVERSE = {};
    $.each(SECTION_MAP, function (key, value) {
        SECTION_MAP_INVERSE[value.toLowerCase()] = key;
    });
    SECTION_COLOR_MAP = JSON.parse(CacheMan_load('/get/section-colors'));

    var loaded = JSON.parse(CacheMan_load('/all-courses'));
    COURSE_MAP = loaded.courses;
    COURSE_SECTIONS_MAP = loaded.course_sections_map;
    COURSE_FILTER_BLACKLIST = new Set();

    // verify local storage
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        var sectionsMap = localStorage.getItem('sectionsmap');
        if (!sectionsMap)
            clearLocalStorage();
        else
        {
            if (sectionsMap != CacheMan_load('/get/sections'))
                clearLocalStorage();
        }
        localStorage.setItem('sectionsmap', CacheMan_load('/get/sections'));
    }
    
    SB_init();
    SR_init();
    EventsMan_init();
    PopUp_init();
    NO_init();
    Agenda_init();
    Cal_init();
    SE_init();
    SR_addWillSaveListener(function (){
        Nav_save();
        UI_save();
    });
    SR_addDidLoadListener(function (){
        Nav_load();
        UI_load();
    });
    EventsMan_addEventIDsChangeListener(function(oldID, newID){
        if (UI_isMain(oldID))
            UI_setMain(newID);
        else if (UI_isPinned(oldID))
        {
            UI_unpin(oldID);
            UI_pin(newID);
        }
    });
    if (THEME == 'w')
        loadWhiteTheme();
    else
        loadDarkTheme();

    $('.withtooltip').tooltip({});
    $(window).on('resize', function(ev){
        adaptSize();
    });
    adaptSize();
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.setItem('user', USER_NETID);
    }
    UR_pullUnapprovedRevisions();
}
function adaptSize()
{
    if (window.innerWidth <= 768)
    {
        // tablet
        $('#agendatab').tab('show');
        $('#sb-left-container').removeClass('col-xs-4 col-xs-12 col-xs-8');
        $('#sb-left-container').addClass('col-xs-8');
    }
    else
    {
        // desktop
        $('#sb-left-container').removeClass('col-xs-4 col-xs-12 col-xs-8');
        $('#sb-left-container').addClass('col-xs-4');
    }
    if (window.innerWidth <= 400)
    {
        $('#sb-left-container').removeClass('col-xs-4 col-xs-12 col-xs-8');
        $('#sb-left-container').addClass('col-xs-12');
    }
}

function Nav_save()
{
    var id = $("#maintab").find(".active").find("a")[0].id;
    SR_put("nav_page", NAV_ID.indexOf(id));
}
function Nav_load()
{
    var index = SR_get("nav_page");
    if (index == null)
        return;
    $("#maintab #"+NAV_ID[index]).tab("show");
    //$("#maintab li").removeClass("active");
    //$("#maintab #"+NAV_ID[index]).parent().addClass("active");
    //$(".tab-pane").removeClass("in");
    //$("#"+TAB_ID[index]).addClass("in");
}


function UI_save()
{
    SR_put('pinned_IDs', JSON.stringify(pinnedIDs));
    SR_put('main_ID', mainID);
}
function UI_load()
{
    if (SR_get('pinned_IDs') != null)
    {
        var savedPinnedIDs = JSON.parse(SR_get('pinned_IDs'));
        $.each(savedPinnedIDs, function (key, value) {
            if (PopUp_getPopUpByID(key) != null)
                UI_pin(key);
        });
        //$.removeCookie('pinned_IDs');
    } 
    if (SR_get('main_ID') != null)
    {
        if (SR_get('main_ID') != 'null')
            if (PopUp_getPopUpByID(SR_get('main_ID')) != null)
                UI_setMain(SR_get('main_ID'));
        //$.removeCookie('main_ID')
    }
}

function disableAllInteractions()
{
    var disabler = $('<div id="disabler"></div>');
    $(disabler).prependTo('.tab-content').css({
        height: '100%',
        width: '100%',
        opacity: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        'z-index': 900,
        cursor: 'not-allowed'
    });
}
function enableAllInteractions()
{
    $('#disabler').remove();
}
function toggleInfo()
{
    $('.main-content').toggleClass('main-hidden');
    $('#about-content').toggleClass('about-hidden');
}
function onLogOut()
{
}
function clearLocalStorage()
{
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.removeItem('sectionsmap');
        localStorage.removeItem('eventsman.events');
        localStorage.removeItem('eventsman.hidden');
        localStorage.removeItem('eventsman.lastsyncedtime');
        localStorage.removeItem('user');
        localStorage.removeItem('state-restoration');
    } 
}
var NO_TYPES = {
    WARNING: 'alert-warning',
    INFO: 'alert-info',
}
function NO_init()
{
    PopUp_addCloseListener(function(id){
        NO_removeNotificationID(id);
    });
}

function NO_showNotification(id, text, type, meta)
{
    var $noti;
    if (NO_hasNotificationID(id))
    {
        $noti = $('#'+id+'.alert');
    } else 
    {
        $noti = $('<div>').addClass('alert').addClass('alert-dismissible');
        $noti.append('<button id="close_button" type="button" class="close" aria-hidden="true">&times;</button>');
        $('<span id="noti-content">').appendTo($noti);
        $noti.attr('id', id);
        SB_push($noti);
    }
    $noti.addClass(type);
    $text = $('<a>').addClass('alert-link').text(text).on('click', function(ev){
        ev.preventDefault();
        $noti.trigger('noti.click');
        SB_pop($noti);
    });
    $noti.find('#close_button').on('click', function(ev){
        ev.preventDefault();
        NO_removeNotificationID($noti.attr('id'));
    });
    $noti.find('#noti-content').append($text);
    //$(noti).data('events', similarEvents);
    if (meta)
    {
        $.each(meta, function(key, value){
            $noti.data(key, value);
        });
    }
    return $noti;
}
function NO_hasNotificationID(id)
{
    return $('#' + id + '.alert').length > 0;
}

function NO_removeNotificationID(id)
{
    if (!NO_hasNotificationID(id))
        return;
    SB_pop($('#' + id + '.alert.in')[0]);
    SB_hideIfEmpty();
}

//function NO_showSimilarEventsNotification(event_id, similarEvents)
//{
//    if ($('#' + event_id + '.alert').length > 0)
//    {
//        // notification already shown
//        var noti = $('#' + event_id + '.alert')[0];
//        if (similarEvents.length == 0)
//        {
//            // not similar anymore. remove
//            SB_pop(noti);
//            SB_hideIfEmpty();
//        }
//        else
//        {
//            $(noti).data('events', similarEvents);
//        }
//        return;
//    }
//    if (similarEvents.length == 0)
//        return;
//    var htmlContent = CacheMan_load('notifications-template');
//    SB_push(htmlContent);
//    var noti = $('#noti-123')[0];
//    noti.id = event_id;
//    $(noti).addClass('alert-warning');
//    $(noti).find('#noti-content').html('<a href="#" class="alert-link" onclick="">A similar event</a> already exists.');
//    $(noti).data('events', similarEvents);
//    $(noti).find('#noti-content').on('click', function(ev){
//        ev.preventDefault();
//        SE_showSimilarEvents(event_id, $(noti).data('events'));
//        SB_pop(noti);
//        //NO_showSimilarEvents(event_id);
//        //return false;
//    });
//    $(noti).find('button').on('click', function(){
//        SB_pop(noti);
//        //$(noti).remove();
//        SB_hideIfEmpty();
//    });
//}
POPUP_CLASS = 'popup-event';
function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;
    POPUP_HTML = $('#popup-template').html();
    $('#popup-template').remove();
    
    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

    // setting bounds
    topPos = parseInt($(".navbar").css("height")) + parseInt($(".navbar").css("margin-top"));
    height = window.innerHeight - topPos + 300;
    $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    $(window).on('resize', function(ev){
        topPos = parseInt($(".navbar").css("height")) + parseInt($(".navbar").css("margin-top"));
        height = window.innerHeight - topPos + 300;
        $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    });

    EventsMan_addOnReadyListener(function(){
        PopUp_load();
    });

    SR_addWillSaveListener(function (){
        PopUp_save();
    })
    EventsMan_addEventIDsChangeListener(function(oldID, newID){
        var popUp = PopUp_getPopUpByID(newID);
        if (popUp)
        {
            PopUp_close(popUp);
        }
        var popUp = PopUp_getPopUpByID(oldID);
        if (popUp)
            PopUp_setToEventID(popUp, newID);
    });
    EventsMan_addUpdateListener(function(){
        PopUp_map(function(popUp, isMain){
            if (EventsMan_hasEvent(PopUp_getID(popUp)) && EventsMan_eventShouldBeShown(PopUp_getID(popUp)))
                PopUp_setToEventID(popUp, PopUp_getID(popUp));
            else
                PopUp_close(popUp);
        });
    });
}

/***************************************************
 * Creating/removing
 **************************************************/

function PopUp_initialize_deferred(popUp)
{
    if ($(popUp).find(".withdatepicker")[0].type == 'text') // defaults to browser's builtin date picker
    {
        $(popUp).find(".withdatepicker").datetimepicker({
            format: "MM d, yyyy",
            autoclose: true,
            minView: 2,
            maxView: 3
        });
    } else {
        $(popUp).find('.withdatepicker').removeClass('withdatepicker');
    }
    if ($(popUp).find(".withtimepicker")[0].type == 'text')// defaults to browser's builtin date picker
    {   
        $(popUp).find(".withtimepicker").datetimepicker({
            format: "H:ii P",
            formatViewType: "time",
            autoclose: true,
            minView: 0,
            maxView: 1,
            startView: 0,
            linkField: "withdatepicker",
            linkFormat: "yyyy-mm-dd",
            showMeridian: true,
            minuteStep: 10,
            startDate: new Date(moment('Dec 31, 1899 12:00 AM').unix() * 1000),
            endDate: new Date(moment('Jan 1, 1900 12:00 AM').unix() * 1000),
        });
    } else {
        $(popUp).find('.withtimepicker').removeClass('withtimepicker');
    }
    //var htmlcontent = CacheMan_load("type-picker")
    //$(popUp).find(".withtypepicker").popover({
    //    placement: "left auto",
    //    trigger: "focus",
    //    html: true,
    //    content: htmlcontent,
    //    container: 'body'
    //})
    //var input = $(popUp).find(".withtypepicker")[0];
    //$(input).on("shown.bs.popover", function(){
    //    var tp = $("#type-picker123")[0];
    //    tp.id = "";
    //    this.tp = tp;
    //    var type = $(this).val();
    //    TP_select(this.tp, type);
    //    var inputField = this;
    //    TP_setSelectListener(function(tp, selectedType){
    //        $(inputField).val(selectedType);
    //    });
    //});
    

    //$(popUp).find('.withsectionpicker').popover({
    //    placement: 'left auto',
    //    trigger: 'focus', 
    //    html: true,
    //    content: CacheMan_load('section-picker'),
    //    container: 'body'
    //}).on('shown.bs.popover', function(){
    //    var sp = $('#section-picker123')[0];
    //    sp.id = '';
    //    this.sp = sp;
    //    var section = $(this).val();
    //    SP_select(this.sp, section);
    //    var inputField = this;
    //    SP_setSelectListener(function(sp, selectedSection){
    //        $(inputField).val(selectedSection);
    //    });
    //});
}
function PopUp_initialize(popUp)
{
    var choices = [];
    $.each (DAYS_DICT, function(index){
        choices.push({
            value: index,
            pretty: this,
            selected: false,
        });
    });
    var repeat_scm = SCM_initWithChoices('', choices);
    $(popUp).find('#popup-repeat-pattern').append(repeat_scm); 

    var choices = [
        {
            value: 1,
            pretty: 'Every week',
            selected: false,
        },
        {
            value: 2,
            pretty: 'Every 2 weeks',
            selected: false,
        },
        {
            value: 4,
            pretty: 'Every month',
            selected: false,
        },
    ];
    var repeat_interval_sc = SC_initWithChoices('', choices);
    $(popUp).find('#popup-repeat-interval').append(repeat_interval_sc);
}

/***************************************************
 * Getters and Setters
 **************************************************/

function PopUp_setToEventID(popUp, id)
{
    PopUp_setID(popUp, id);
    var eventDict;
    $(popUp).find('.unsaved').removeClass('unsaved');
    //$(popUp).find('.withcustompicker').off('hidden.bs.popover');
    //$(popUp).find('.withcustompicker').popover('destroy');
    if (EventsMan_hasUncommitted(id))
    {
        eventDict = EventsMan_getUncommitted(id);
        PopUp_markAsUnsaved(popUp);
        // TODO find out what is the unsaved changes
        var savedEventDict = EventsMan_getEventByID(id);
        if (savedEventDict)
        {
            if (savedEventDict.event_title != eventDict.event_title)
                $(popUp).find('#popup-title').addClass('unsaved');
            if (savedEventDict.event_location != eventDict.event_location)
                $(popUp).find('#popup-loc').addClass('unsaved');
            if (savedEventDict.event_description != eventDict.event_description)
                $(popUp).find('#popup-desc').addClass('unsaved');
            if (savedEventDict.event_type != eventDict.event_type)
                $(popUp).find('#popup-type').addClass('unsaved');
            if (savedEventDict.section_id != eventDict.section_id)
                $(popUp).find('#popup-section').addClass('unsaved');
            var start = moment.unix(eventDict.event_start);
            var savedStart = moment.unix(savedEventDict.event_start);
            if (start.year() != savedStart.year() || start.month() != savedStart.month() || start.date() != savedStart.date())
                $(popUp).find('#popup-date').addClass('unsaved');
            if (start.hour() != savedStart.hour() || start.minute() != savedStart.minute())
                $(popUp).find('#popup-time-start').addClass('unsaved');
            var end = moment.unix(eventDict.event_end);
            var savedEnd = moment.unix(savedEventDict.event_end);
            if (end.hour() != savedEnd.hour() || end.minute() != savedEnd.minute())
                $(popUp).find('#popup-time-end').addClass('unsaved');
        }
    }
    else
    {
        eventDict = EventsMan_getEventByID(id);
        PopUp_markAsSaved(popUp);
    }
    if (!eventDict)
    {
        console.log("errorneous event id");
        PopUp_close(popUp);
        return;
    }
    PopUp_setTitle(popUp, eventDict.event_title);
    PopUp_setDescription(popUp, eventDict.event_description);
    PopUp_setLocation(popUp, eventDict.event_location);
    PopUp_setSection(popUp, eventDict.section_id);
    PopUp_setType(popUp, eventDict.event_type);
    PopUp_setDate(popUp, eventDict.event_start);
    PopUp_setStartTime(popUp, eventDict.event_start);
    PopUp_setEndTime(popUp, eventDict.event_end);
    PopUp_setColor(popUp, SECTION_COLOR_MAP[eventDict.section_id]['color']);

    $(popUp).find('#popup-repeat')[0].checked = ('recurrence_days' in eventDict);
    $(popUp).find('#popup-repeat').off('change');
    $(popUp).find('#popup-repeat-pattern').off('select');
    $(popUp).find('#popup-repeat-interval').off('select');
    if ('recurrence_days' in eventDict)
    {
        var pattern = eventDict.recurrence_days;
        var choices = [];
        $.each(DAYS_DICT, function(index){
            choices.push({
                value: index,
                pretty: this,
                selected: pattern.contains(index)
            });
        });
        $(popUp).find('.popup-repeat-item').removeClass('hide');
        var scm = $(popUp).find('#popup-repeat-pattern').children()[0];
        SCM_setToChoices(scm, choices);
        var repeat_sc = $(popUp).find('#popup-repeat-interval').children()[0];
        var choices = [
            {
                value: 1,
                pretty: 'Every week',
                selected: eventDict['recurrence_interval'] == 1,
            },
            {
                value: 2,
                pretty: 'Every 2 weeks',
                selected: eventDict['recurrence_interval'] == 2,
            },
            {
                value: 4,
                pretty: 'Every month',
                selected: eventDict['recurrence_interval'] == 4,
            },
        ];
        SC_setToChoices(repeat_sc, choices);
    }
    else
    {
        var choices = [];
        $.each(DAYS_DICT, function(index){
            choices.push({
                value: index,
                pretty: this,
                selected: false
            });
        });
        $(popUp).find('.popup-repeat-item').addClass('hide');
        var scm = $(popUp).find('#popup-repeat-pattern').children()[0];
        SCM_setToChoices(scm, choices);
        var repeat_sc = $(popUp).find('#popup-repeat-interval').children()[0];
        var choices = [
            {
                value: 1,
                pretty: 'Every week',
                selected: true,
            },
            {
                value: 2,
                pretty: 'Every 2 weeks',
                selected: false,
            },
            {
                value: 4,
                pretty: 'Every month',
                selected: false,
            },
        ];
        SC_setToChoices(repeat_sc, choices);
    }
    $(popUp).find('#popup-repeat').on('change', function(ev){
        if (this.checked)
        {
            if (!('recurrence_days' in eventDict))
                PopUp_markAsUnsaved(popUp);
            $(popUp).find('.popup-repeat-item').removeClass('hide');
            PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', []);
        }
        else
        {
            if ('recurrence_days' in eventDict)
                PopUp_markAsUnsaved(popUp);
            $(popUp).find('.popup-repeat-item').addClass('hide');
            PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', null);
        }
    });
    $(popUp).find('#popup-repeat-pattern').on('select', function(ev, choices){
        var pattern = [];
        $.each(choices, function(value, selected){
            if (selected)
                pattern.push(parseInt(value));
        });
        pattern.sort();
        if (EventsMan_hasUncommitted(id))
        {
            eventDict = EventsMan_getUncommitted(id);
        }
        else
        {
            eventDict = EventsMan_getEventByID(id);
        }

        if (!('recurrence_days' in eventDict))
            PopUp_markAsUnsaved(popUp);
        else if (!pattern.equals(eventDict.recurrence_days))
            PopUp_markAsUnsaved(popUp);
        PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', pattern);
    });
    $(popUp).find('#popup-repeat-interval').on('select', function(ev, choices){
        $.each(choices, function(value, selected){
            if (selected)
            {
                if (EventsMan_hasUncommitted(id))
                {
                    eventDict = EventsMan_getUncommitted(id);
                }
                else
                {
                    eventDict = EventsMan_getEventByID(id);
                }
                if (eventDict.recurrence_interval != value)
                    PopUp_markAsUnsaved(popUp);
                PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT['popup-repeat-interval'], value);
            }
        });
    });

    if (EventsMan_eventIsHidden(id))
    {
        $(popUp).find('#unhide_button').removeClass('hide');
        $(popUp).find('#hide_button').addClass('hide');
    }
    else
    {
        $(popUp).find('#unhide_button').addClass('hide');
        $(popUp).find('#hide_button').removeClass('hide');
    }

    var choices = [];
    $.each(TYPE_MAP, function(key, value){
        choices.push({
            value: key,
            pretty: value,
            selected: eventDict.event_type == key,
        });
    });
    var scp = SCP_initOnElement($(popUp).find('.withtypepicker')[0], popUp, null, choices);
    $(scp).on('select', function(ev, choices){
        var selectedType;
        $.each(choices, function(key, selected){
            if (selected)
            {
                selectedType = key;
                return false;
            }
        });
        $(popUp).find('.withtypepicker').val(toTitleCase(TYPE_MAP[selectedType]));
        $(popUp).find('.withtypepicker').trigger('value_set');
    });

    var choices = [];
    $.each(SECTION_MAP, function(key, value){
        choices.push({
            value: key,
            pretty: value,
            selected: eventDict.section_id == key,
        });
    });
    var scpSection = SCP_initOnElement($(popUp).find('.withsectionpicker')[0], popUp, null, choices);
    $(scpSection).on('select', function(ev, choices){
        var selectedSection;
        $.each(choices, function(key, selected){
            if (selected)
            {
                selectedSection = key;
                return false;
            }
        });
        $(popUp).find('.withsectionpicker').val(SECTION_MAP[selectedSection]);
        $(popUp).find('.withsectionpicker').trigger('value_set');
    });
    $(popUp).find('.withcustompicker').on('hidden.bs.popover', function(ev){
        $(this).trigger('value_set');
    });

}

function PopUp_setTitle(popUp, title)
{
    popUp.querySelector(".popup-title").innerHTML = title;
}
function PopUp_setDescription(popUp, desc)
{
    $(popUp).find("#popup-desc").html(nl2br(desc));
}
function PopUp_setLocation(popUp, loc)
{
    $(popUp).find('#popup-loc').text(loc);
}
function PopUp_setSection(popUp, sectionKey)
{
    $(popUp).find('#popup-section').text(SECTION_MAP[sectionKey]);
}
function PopUp_setType(popUp, typeKey)
{
    var type = toTitleCase(TYPE_MAP[typeKey]);
    $(popUp).find('#popup-type').text(type);
}
function PopUp_setDate(popUp, unixTime)
{
    var date = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-date').text(date.format("MMMM D, YYYY"));
}
function PopUp_setStartTime(popUp, unixTime)
{
    var time = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-start').text(time.format("h:mm A"));
}
function PopUp_setEndTime(popUp, unixTime)
{
    var time = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-end').text(time.format("h:mm A"));
}
function PopUp_setColor(popUp, color)
{
    //if (!($(popUp).find('.panel').data('my-color')))
    //{
    $(popUp).find('.panel').data('my-color', color);
    //}

    // color = $(popUp).find('.panel').data('my-color');

    // TODO: bad idea to hardwire the default color?
    var defaultBorder = '#DDDDDD';
    var defaultHeader = '#F5F5F5';
    $(popUp).find('.panel').data('default-border', defaultBorder);
    $(popUp).find('.panel').data('default-header', defaultHeader);
    if (PopUp_hasFocus(popUp))
    {
        $(popUp).find('#popup-title').parent().parent().css('background-color', color).css('border-color', color);
        $(popUp).find('.panel').css('border-color', color);
    }
    else
    {
        $(popUp).find('#popup-title').parent().parent().css('background-color', defaultHeader).css('border-color', defaultBorder);
        $(popUp).find('.panel').css('border-color', defaultBorder);
    }
}

/***************************************************
 * State Restoration
 **************************************************/

function PopUp_save()
{
    var pos = [];
    PopUp_map(function(popUp, isMain) {
        var posDict = {};
        var rect = []; // x, y, w, h
        posDict.id = PopUp_getID(popUp);
        rect.push($(popUp).css("left"));
        rect.push($(popUp).css("top"));
        rect.push($(popUp).css("width"));
        rect.push($(popUp).css("height"));
        posDict.frame = rect;
        posDict.isMain = isMain;
        posDict.hasFocus = PopUp_hasFocus(popUp);
        pos.push(posDict);
    });
    var data = JSON.stringify(pos);
    SR_put('popup', data);
}
function PopUp_load()
{
    if (SR_get('popup') == null)
        return;
    var pos = JSON.parse(SR_get('popup'));
    $(pos).each(function(index) {
        popUp = PopUp_insertPopUp(this.isMain);
        if (!this.isMain)
        {
            $(popUp).css("left", this.frame[0]);
            $(popUp).css("top", this.frame[1]);
            $(popUp).css("width", this.frame[2]);
            $(popUp).css("height", this.frame[3]);
            _PopUp_setBodyHeight(popUp);
        }
        PopUp_setToEventID(popUp, this.id);
        if (this.hasFocus)
            PopUp_giveFocus(popUp);
    });
}

/***************************************************
 * Appearance
 **************************************************/

function PopUp_markAsUnsaved(popUp)
{
    $(popUp).find('#save_button').removeClass('hide');
    $(popUp).find('#undo_button').removeClass('hide');
}
function PopUp_markAsSaved(popUp)
{
    $(popUp).find('#save_button').addClass('hide');
    $(popUp).find('#undo_button').addClass('hide');
}
function PopUp_markIDAsNotEditing(id)
{
    PopUp_markAsNotEditing(PopUp_getPopUpByID(id));
}
function PopUp_markAsNotEditing(popUp)
{
    $(popUp).data('is_editing', false);
}
function PopUp_markAsEditing(popUp)
{
    $(popUp).data('is_editing', true);
}
function PopUp_isEditing(popUp)
{
    return $(popUp).data('is_editing');
}
function PopUp_makeIDDraggable(id)
{
    var popUp = PopUp_getPopUpByID(id);
    $(popUp).draggable('enable');
}

/***************************************************
 * forms for editing
 **************************************************/

function _PopUp_showFormForElement(element)
{
    var popUp = _PopUp_getPopUp(element);
    $(element).addClass("hide");
    var form_id = _PopUp_Form_getFormIDForElement(element);
    var form = $(popUp).find("#" + form_id).removeClass("hide")[0];
}
function _PopUp_hideFormForElement(form)
{
    var popUp = _PopUp_getPopUp(form);
    $(form).addClass("hide");
    var text_id = _PopUp_Form_getElementIDForForm(form);
    $(popUp).find("#"+text_id).removeClass("hide");
}
function _PopUp_Form_getValue(form)
{
    if ($(form).find("input").length > 0)
        return $(form).find("input").val();
    else if ($(form).find("textarea").length > 0)
        return $(form).find("textarea").val();
}
function _PopUp_Form_setValue(form, newValue)
{
    if ($(form).find("input").length > 0)
    {
        if ($(form).find('input')[0].type == 'date')
        {
            var date = moment(newValue).format('YYYY-MM-DD');
            $(form).find("input").val(date)
        }
        else if ($(form).find('input')[0].type == 'time')
        {
            var time = moment('April 25, 2014 ' + newValue).format('HH:mm:ss');
            $(form).find('input').val(time);
        }
        else
            $(form).find("input").val(newValue);
    }
    else if ($(form).find("textarea").length > 0)
    {
        var sanitized = br2nl(newValue);
        $(form).find("textarea").val(sanitized);
    }
}
function _PopUp_Form_giveFocus(form)
{
    if ($(form).find("input").length > 0)
        $(form).find("input")[0].focus();
    else if ($(form).find("textarea").length > 0)
        $(form).find("textarea")[0].focus();
}
function _PopUp_Form_getElementIDForForm(form)
{
    return form.id.split("-").slice(0, -1).join("-");
}
function _PopUp_Form_getFormIDForElement(element)
{
    return element.id + "-form";
}
function _PopUp_Form_addOnBlurListener(form, listener)
{
    if ($(form).find(".withdatepicker").length > 0)
        $(form).find(".withdatepicker").datetimepicker().on("hide", listener);
    else if ($(form).find(".withtimepicker").length > 0)
        $(form).find(".withtimepicker").datetimepicker().on("hide", listener);
    else if ($(form).find(".withcustompicker").length > 0)
        $(form).find(".withcustompicker").on('value_set', listener); // must be hidden, not hide, otherwise timing doesn't work out
    else if ($(form).find("input").length > 0)
        $(form).find("input").on("blur", listener);
    else if ($(form).find("textarea").length > 0)
        $(form).find("textarea").on("blur", listener);
}

/***************************************************
 * Click Event Listeners
 **************************************************/

function PopUp_clickedElement(element)
{
    //return;
    var popUp = _PopUp_getPopUp(element);
    if (PopUp_isEditing(popUp))
        return;
    _PopUp_Form_enforceStartDate(popUp);
    PopUp_markAsEditing(popUp);
    var form_id = _PopUp_Form_getFormIDForElement(element);
    var form = $(popUp).find("#"+form_id)[0];
    // make the corresponding form visible and hide the element
    if ($(form).find("textarea").length > 0)
    {
        height = parseInt($(element).css("height")) + 20;
        $(form).find("textarea").css("height", height + "px");
    }
    _PopUp_showFormForElement(element);
    _PopUp_Form_setValue(form, element.innerHTML);
    _PopUp_Form_giveFocus(form);
    if (!$(form).hasClass("input-group") && form.notFirstSelected != true)
    {
        form.notFirstSelected = true;
        _PopUp_Form_addOnBlurListener(form, function(){
            PopUp_clickedSaveElement(form);
        });
    }
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (text_id == 'popup-title')
    {
        $(popUp).find('.popup-ctrl').addClass('hidden');
    }
    $(form).find('input').off('keyup').on('keyup', function(ev){
        var keyCode = ev.keyCode || ev.which;
        if (keyCode == 13) // enter key
        {
            PopUp_clickedSaveElement(form);
        }
    });
    $(form).find('.withtimepicker').off('keyup').off('keydown').on('keydown', function(ev){
        ev.preventDefault();
    });
    $(form).find('.withdatepicker').off('keyup').off('keydown').on('keydown', function(ev){
        ev.preventDefault();
    });
    $(form).find('.withcustompicker').off('keyup').off('keydown').on('keydown', function(ev){
        ev.preventDefault();
    });

    //$(form).find("input").data("datetimepicker");
    //$(form).find("input").datetimepicker();
}
function _PopUp_Form_enforceStartDate(popUp)
{
    var time = $(popUp).find('#popup-time-start').text();
    var startDate = moment('Dec 31, 1899 ' + time);
    $(popUp).find('#popup-time-end-form').find('.withtimepicker').datetimepicker('setStartDate', new Date(startDate.unix() * 1000));
    $(popUp).find('#popup-time-end-form').find('input').not('.withtimepicker').attr('min', startDate.format('HH:mm:ss'));
}
function PopUp_clickedSaveElement(form)
{
    if (!/\S/.test(_PopUp_Form_getValue(form)))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    //if ($(form).find("input").hasClass("withtypepicker") && !TP_validateType(_PopUp_Form_getValue(form)))
    //{
    //    _PopUp_Form_giveFocus(form);
    //    return;
    //}
    //if ($(form).find('input').hasClass('withsectionpicker') && !SP_validateSection(_PopUp_Form_getValue(form)))
    //{
    //    _PopUp_Form_giveFocus(form);
    //    return;
    //}
    var popUp = _PopUp_getPopUp(form);
    PopUp_markAsNotEditing(popUp);
    // hide the form and unhide the text
    _PopUp_hideFormForElement(form);
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (text_id == 'popup-title')
    {
        $(popUp).find('.popup-ctrl').removeClass('hidden');
        if (UI_isMain(PopUp_getID(popUp)))
            $(popUp).find('.poup-ctrl-right').addClass('hidden');
    }

    //actual saving
    var text = $(popUp).find("#"+text_id)[0];
    var safe = _PopUp_Form_getValue(form).escapeHTML();
    if ($(form).find('input').length > 0 && $(form).find('input')[0].type == 'date')
        safe = moment(safe).tz(MAIN_TIMEZONE).format("MMMM D, YYYY");
    else if ($(form).find('input').length > 0 && $(form).find('input')[0].type == 'time')
        safe = moment('April 25, 2014 ' + safe).tz(MAIN_TIMEZONE).format('h:mm A');
    if ($(text).html() == nl2br(safe))
        return; // no saving needed
    $(text).html(nl2br(safe));
    if (text_id == 'popup-time-start')
    {
        _PopUp_Form_enforceStartDate(popUp);
    }
    PopUp_markAsUnsaved(popUp);
    PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT[text_id], _PopUp_Form_getValue(form));
}
function PopUp_clickedClose(popUpAnchor)
{
    var popUp = popUpAnchor;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    if (PopUp_isEditing(popUp))
        return;
    // check if there are unsaved changes
    if (EventsMan_hasUncommitted(PopUp_getID(popUp)))
    {
        AS_showActionSheetFromElement($(popUp).find('#close_button')[0], popUp, 'Save changes?',
            [
                {
                    important: false,
                    text: 'Save',
                },
                {
                    important: true,
                    text: 'Don\'t save',
                }
            ],
            function(index){
                if (index == 0) {
                    PopUp_clickedSavePopUp(popUp, true);
                    //PopUp_clickedClose(popUp);
                }
                else{
                    PopUp_clickedUndo(popUp);
                    PopUp_clickedClose(popUp);
                }
            }
        );
        return;
    }

    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}
function PopUp_clickedDelete(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_isEditing(popUp))
        return;
    var event_id = PopUp_getID(popUp);
    var eventDict = EventsMan_getEventByID(event_id);
    if (eventDict && 'recurrence_days' in eventDict)
    {
        AS_showActionSheetFromElement(popUpAnchor, popUp, "Done with this event? Click to hide from your agenda and calendar.", [ 
                {important: false, text:'Only this event'},
                {important: true, text:'All future events'}
            ], function(index){
            if (index == 0)
            {
                // only this event
                EventsMan_deleteEvent(event_id);
                if (!EventsMan_eventShouldBeShown(event_id))
                    PopUp_close(popUp);
            }
            else 
            {
                // all future events
                EventsMan_deleteAllFutureEvents(event_id);
                if (!EventsMan_eventShouldBeShown(event_id))
                    PopUp_close(popUp);
            }
        });
        return;
    }
    EventsMan_deleteEvent(event_id);
    if (!EventsMan_eventShouldBeShown(event_id))
        PopUp_close(popUp);
}
function PopUp_clickedUnhide(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_isEditing(popUp))
        return;
    var event_id = PopUp_getID(popUp);
    var eventDict = EventsMan_getEventByID(event_id);
    if ('recurrence_days' in eventDict)
    {
        AS_showActionSheetFromElement(popUpAnchor, popUp, null, [
                {important: false, text:'Only this event'},
                {important: true, text:'All future events'}
            ], function(index){
            if (index == 0)
            {
                // only this event
                EventsMan_unhideEvent(event_id);
            }
            else 
            {
                // all future events
                EventsMan_unhideAllFutureEvents(event_id);
            }
        });
        return;
    }
    EventsMan_unhideEvent(event_id);
}
function PopUp_clickedSavePopUp(anchor, shouldClose)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    shouldClose = shouldClose || false;
    var id = PopUp_getID(popUp);
    if (SE_hasSimilarEvents(id))
    {
        AS_showActionSheetFromElement($(popUp).find('#save_button')[0], popUp,
            'There seems to be a similar event already on the calendar',
            [
                {
                    important: false,
                    text: 'Show similar events',
                },
                {
                    important: true,
                    text: 'Save anyways',
                },
            ], function(index){
                if (index == 0)
                {
                    NO_showSimilarEvents(PopUp_getID(popUp));
                }
                else
                {
                    NO_removeSimilarEventsNotification(PopUp_getID(popUp));
                    PopUp_clickedSavePopUp(popUp);
                }
            }
        );
        return;
    }
    var eventDict = EventsMan_getEventByID(id);
    var uncommitted = EventsMan_getUncommitted(id);
    if (eventDict // new events won't have eventDict, in which case we don't ask
        && 'recurrence_days' in eventDict 
        && 'recurrence_days' in uncommitted)
    {
        // check whether recurrence pattern was modified. If it was, don't ask
        if (eventDict.recurrence_days.equals(uncommitted.recurrence_days)
                && eventDict.recurrence_interval == uncommitted.recurrence_interval)
        {
            AS_showActionSheetFromElement($(popUp).find('#save_button')[0], popUp,
                'This event is part of a recurring event.',
                [
                    {
                        important: false,
                        text: 'Only this event',
                    },
                    {
                        important: true,
                        text: 'All future events',
                    }
                ], function(index){
                    PopUp_markAsSaved(popUp);
                    $(popUp).find('.unsaved').removeClass('unsaved');
                    if (index == 0)
                    {
                        EventsMan_commitChanges(id);
                    }
                    else 
                    {
                        // TODO save changes to recurring events
                        EventsMan_commitChangesToAllFutureEvents(id);
                    }
                    if (shouldClose)
                        PopUp_clickedClose(popUp);
                }
            );
            return;
        }
    }
    PopUp_markAsSaved(popUp);
    $(popUp).find('.unsaved').removeClass('unsaved');
    EventsMan_commitChanges(id);
    if (shouldClose)
        PopUp_clickedClose(popUp);
}
function PopUp_clickedUndo(anchor)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    var id = PopUp_getID(popUp);
    $(popUp).find('#save_button').addClass('hide');
    $(popUp).find('#undo_button').addClass('hide');
    $(popUp).find('.unsaved').removeClass('unsaved');
    EventsMan_cancelChanges(id);
}
var SE_id = 'settingsModal';
function SE_init()
{
    $('#' + SE_id).on('show.bs.modal', function(){
        // set up
        var agenda_scm = SE_addTypeSegmentedControlWithFilter('Agenda', AGENDA_FILTER);
        $(this).find('#agenda_options').append(agenda_scm);
        var calendar_scm = SE_addTypeSegmentedControlWithFilter('Calendar', CAL_FILTER);
        $(this).find('#calendar_options').append(calendar_scm);
        var theme_sc = SC_initWithChoices('Theme', [
            {
                value: 'w',
                pretty: 'White',
                selected: THEME == 'w',
            },
            {
                value: 'b',
                pretty: 'Black',
                selected: THEME == 'b',
            },
        ]);
        $(theme_sc).on('select', function(ev, choices){
            var chosen;
            $.each(choices, function(key, selected){
                if (selected) {
                    chosen = key;
                    return false;
                }
            });
            THEME = chosen;
            if (chosen == 'w')
                loadWhiteTheme();
            else
                loadDarkTheme();
        });
        $(this).find('#theme_options').append(theme_sc);
        var hidden_sc = SC_initWithChoices('Show hidden events', [
            {
                value: 1,
                pretty: 'Yes',
                selected: EventsMan_showHidden(),
            },
            {
                value: 0,
                pretty: 'No',
                selected: !EventsMan_showHidden(),
            }
        ]);
        $(hidden_sc).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    EventsMan_showHidden(Boolean(parseInt(key)));
            });
        });
        $(this).find('#hidden_options').append(hidden_sc);

        var choices = [];
        $.each(COURSE_MAP, function(key, value){
            choices.push({
                value: key,
                pretty: value,
                selected: !(key in COURSE_FILTER_BLACKLIST),
            });
        });
        var course_scm = SCM_initWithChoices('Filter courses', choices);
        $(course_scm).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    COURSE_FILTER_BLACKLIST.remove(key);
                else
                    COURSE_FILTER_BLACKLIST.add(key);
            });
        });
        $(this).find('#course_options').append(course_scm);
    });
    $('#' + SE_id).on('hide.bs.modal', function(){
        // save
        $(this).trigger('close');
        $.ajax('/put/ui-pref', {
            dataType: 'json',
            type: 'POST',
            data: {
                agenda_pref: JSON.stringify(AGENDA_FILTER),
                calendar_pref: JSON.stringify(CAL_FILTER),
                ui_pref: JSON.stringify({
                    theme: THEME,
                })
            },
            loadingIndicator: false,
        });
    });
    $('#' + SE_id).on('hidden.bs.modal', function(){
        SC_removeAllFromContainer(this);
    });
}
function SE_addTypeSegmentedControlWithFilter(heading, filter)
{
    var choices = [];
    $.each(TYPE_MAP, function(key, value) {
        choices.push({
            value: key,
            pretty: value,
            selected: filter.contains(key),
        });
    });
    var scm = SCM_initWithChoices(heading, choices);
    $(scm).on('select', function(ev, choices){
        filter.splice(0, filter.length);
        $.each(choices, function(type, selected){
            if (selected)
                filter.push(type);
        });
    });
    return scm;
}
function SE_checkSimilarEvents(eventDict)
{
    $.post('/get/similar-events', {
        event_dict: JSON.stringify(eventDict),
    }, function(data){
        if (data.length > 0)
            SE_showSimilarEventsNotification(eventDict.event_id, data);
    }, 'json');
}
function SE_showSimilarEventsNotification(eventID, similarEvents)
{
    var $noti = NO_showNotification(eventID, 'A similar event already exists', NO_TYPES.WARNING, null);
    $noti.on('noti.click', function(ev){
        SE_showSimilarEvents(eventID, similarEvents);
    });
}
function SE_hasSimilarEvents(eventID)
{
    return NO_hasNotificationID(eventID);
}
function SE_showSimilarEvents(eventID, similarEvents)
{
    var choices = [];
    $.each(similarEvents, function(index, eventDict){
        choices.push({
            eventID: eventID,
            eventDict: eventDict,
            buttons: [
                {
                    value: 'c',
                    pretty: 'Choose',
                }
            ],
        });
    });
    var ep = EP_init('Is this the same as your event?', choices);
    SB_setMainContent(ep);
    SB_fill();

    // set the left hand component of the side bar
    var popUp = PopUp_getPopUpByID(eventID)
    PopUp_markAsEditing(popUp);
    if (PopUp_hasMain() && !PopUp_isMain(popUp))
    {
        var main = PopUp_getMainPopUp();
        PopUp_callCloseListeners(PopUp_getID(main));
        $(main).remove();
    }
    SB_push(popUp);
    PopUp_updateSize(popUp);
    PopUp_makeMain(popUp);
    $(popUp).draggable('disable');


    // set event listeners
    // TODO doesn't handle if the user clicks on the hide sidebar button
    $(ep).on('ep.cancel ep.select', function(ev){
        PopUp_markAsNotEditing(popUp);
        $(popUp).draggable('enable');
        SB_pop(this);
        SB_unfill();
    });
    $(ep).on('ep.select', function(ev, meta){
        EventsMan_replaceEventIDWithEvent(meta.eventID, meta.eventDict);
    });
}
var SR_willSaveListeners = []
var SR_didLoadListeners = []
var SR_ON = true;
var SR_manager = {}
var SR_loaded = false;

function SR_init()
{
    SR_load();
    $(window).on('beforeunload', function(){
        SR_save();
    });
}

function SR_get(module)
{
    if (module in SR_manager)
        return SR_manager[module];
    else
        return null;
}

function SR_put(module, stateRes)
{
    SR_manager[module] = stateRes;
}

function SR_load()
{
    if (!SR_ON)
        return;
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        var stored = localStorage.getItem('state-restoration');
        var user = localStorage.getItem('user');
        if (user == USER_NETID && stored)
        {
            SR_manager = JSON.parse(stored);
        }
    }
    SR_loaded = true;
    SR_callDidLoadListeners();
    //$.get('get/state-restoration', null, function (data, textStatus, jqXHR) {
    //    if (data != '')
    //        SR_manager = data;
    //    SR_loaded = true;
    //    SR_callDidLoadListeners();
    //}, 'json');
}

function SR_save()
{
    if (!SR_ON)
        return;
    SR_callWillSaveListeners();
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.setItem('state-restoration', JSON.stringify(SR_manager));
    }

    /*$.ajax('put/state-restoration', {
        dataType: 'json',
        type: 'POST',
        data: {
            state_restoration: JSON.stringify(SR_manager),
        }, 
        async: false,
    });*/
}

function SR_addWillSaveListener(listener)
{
    SR_willSaveListeners.push(listener);
}

function SR_callWillSaveListeners()
{
    $.each(SR_willSaveListeners, function(index){
        this();
    });
}
function SR_addDidLoadListener(listener)
{
    if (SR_loaded)
        listener();
    else
        SR_didLoadListeners.push(listener)
}
function SR_callDidLoadListeners()
{
    $.each(SR_didLoadListeners, function(index){
        this();
    });
    SR_didLoadListeners = null;
}
function UR_pullUnapprovedRevisions()
{
    $.ajax('/get/unapproved', {
        async: true,
        dataType: 'json',
        success: function(data){
            if (data && data.length > 0)
            {
                var $noti = NO_showNotification('unapproved-rev', 'There are unapproved changes', NO_TYPES.INFO, null);
                $noti.on('noti.click', function(ev){
                    UR_showUnapprovedRevisions(data);
                });
            }
        },
    });
}

function UR_showUnapprovedRevisions(unapprovedRevs)
{
    var choices = [];
    $.each(unapprovedRevs, function(index, revDict){
        choices.push({
            eventID: revDict.event_id,
            eventDict: revDict,
            buttons: [
                {
                    value: 'up',
                    pretty: '<span class="glyphicon glyphicon-thumbs-up"></span>',
                },
                {
                    value: 'down',
                    pretty: '<span class="glyphicon glyphicon-thumbs-down"></span>',
                },
            ],
        });
    });
    var ep = EP_init('Does this change look correct?', choices);
    SB_setMainContent(ep);
    SB_fill();
    EP_adjustPopUpSize(ep);

    // set the left hand component of the side bar
    UR_updateLeft(0, unapprovedRevs);
    
    // set event listeners
    $(ep).on('ep.cancel', function(ev){
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_close(mainPopUp);
        SB_pop(this);
        SB_unfill();
        SB_hide();
    });
    $(ep).on('ep.select', function(ev, meta){
        $.ajax('/put/votes', {
            data: {
                    'votes': JSON.stringify([
                        {
                            is_positive: meta.button == 'up',
                            revision_id: parseInt(meta.eventDict.revision_id),
                        }
                    ]),
                },
            type: 'POST',
        });
        if (unapprovedRevs.length == 1)
        {
            var mainPopUp = PopUp_getMainPopUp();
            PopUp_close(mainPopUp);
            SB_pop(this);
            SB_unfill();
            SB_hide();
        }
        else
        {
            EP_removeItemAtIndex(ep, meta.index);
            unapprovedRevs.splice(meta.index, 1); // remove item from array as well
        }
    });
    $(ep).on('ep.slid', function(ev, meta){
        UR_updateLeft(meta.index, unapprovedRevs);
    });
}

function UR_updateLeft(index, unapprovedRevs)
{
    if (EventsMan_hasEvent(unapprovedRevs[index].event_id))
    {
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_setToEventID(mainPopUp, unapprovedRevs[index].event_id);
        $(mainPopUp).draggable('disable');
    }
    else
    {
        if (PopUp_hasMain())
        {
            var mainPopUp = PopUp_getMainPopUp();
            PopUp_close(mainPopUp);
        }
        //SB_pop(mainPopUp);
    }
}
