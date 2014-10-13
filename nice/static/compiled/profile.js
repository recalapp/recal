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
//var pinnedIDs = null;
//var mainID = null;
var csrftoken;
$(function(){
    csrftoken = $.cookie('csrftoken');
});
var COURSE_COLOR_MAP;
var SECTION_COLOR_MAP;

/***********************************************************
 * UI Module. An ID is main if its popup is in the sidebar.
 * An ID is pinned if its popup has been dragged away from
 * the sidebar.
 **********************************************************/
/*function UI_pin(id)
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
}*/

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
    var height = '500';//window.innerHeight * 0.6;
    Cal_options.height = height;
    Cal_options.header = false;
    /* Cal_options.theme = true; */
    Cal_options.weekends = false;
    Cal_options.columnFormat = {
        month: 'ddd',    // Mon
        week: 'dddd', // Mon
        day: 'dddd M/d'  // Monday 9/7
    }

    Cal_options.timeFormat = {
        agenda: ''
    }

    Cal_options.eventClick = function(calEvent, jsEvent, view) {
        if (calEvent.highlighted == true)
        {
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
    var factor_trans = (THEME == 'w') ? FACTOR_TRANS : FACTOR_TRANS_DARK;
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
            rgba = rgbToRgba(luminanceToRgb(color), factor_trans);
        }

        var eventStartTZ = moment.unix(eventDict.event_start);
        if (MAIN_TIMEZONE)
            eventStartTZ = eventStartTZ.tz(MAIN_TIMEZONE);
        var eventEndTZ =  moment.unix(eventDict.event_end);
        if (MAIN_TIMEZONE)
            eventEndTZ = eventEndTZ.tz(MAIN_TIMEZONE); 
        
        var event_course = CourseMan_getCourseByID(eventDict.course_id).course_primary_listing;
        var event_section = CourseMan_getSectionByID(eventDict.section_id).section_name;
        Cal_eventSource.events.push({
            id: eventDict.event_id,
            title: event_course + " - " + event_section,
            start: eventStartTZ.toISOString(),
            end: eventEndTZ.toISOString(),
            myColor: COURSE_COLOR_MAP[eventDict.course_id],
            textColor: shouldHighlight ? '#ffffff' : color,
            highlighted: shouldHighlight,
            backgroundColor: rgba,
            borderColor: rgba //color //'#123456' 
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
            }
            else
            {
                Cal_highlightEvent(this, true);
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
        }
        else
        {
            Cal_highlightEvent(this, true);
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
    var defaultBorder = (THEME == 'w') ? defaultBorderW : defaultBorderB;
    if (!CL_isHighlighted(course))
        return;
    $(course).addClass('panel-default').removeClass('panel-primary');
    $(course).css('border-color', defaultBorder);
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
        },
        error: function(data){
            CourseMan_pullCourseByID(courseID, async);
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
$(document).keyup(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_SHIFT:
            SHIFT_PRESSED = false;
            break;
    }
});
var DEFAULT_SECTION_COLORS;
var DEFAULT_COLOR_IDX = 0;
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
        color = DEFAULT_SECTION_COLORS[DEFAULT_COLOR_IDX];
        DEFAULT_COLOR_IDX++;
        if (DEFAULT_COLOR_IDX == DEFAULT_SECTION_COLORS.length)
            DEFAULT_COLOR_IDX = 0;
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
// function UP_init()
// {
//     $('#first_name_box').val(USER.first_name);
//     $('#last_name_box').val(USER.last_name);
//     $('#first_name_box').on('change', function(ev){
//         USER.first_name = $(this).val();
//     });
//     $('#last_name_box').on('change', function(ev){
//         USER.last_name = $(this).val();
//     });
//     $(window).on('beforeunload', function(ev){
//         $.ajax('/put/user', {
//             async: false,
//             dataType: 'json',
//             type: 'POST',
//             data: {
//                 user: JSON.stringify(USER)
//             },
//         });
//     });
// }
