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
/***********************************************************
 * This module gives an indicator on the bottom right
 * corner of the screen. It is meant to be used only
 * for displaying information. If user interaction is
 * needed, use notificaitons.js.
 *
 * Works similarly to memory management - every id added to loading
 * must be released, otherwise the indicator stays.
 **********************************************************/

// add as needed
var LO_TYPES = {
    SUCCESS: 'alert-success',
}

var LO_idMap = null; // can't initalize until the set data structure is loaded

function LO_init()
{
    LO_idMap = {
        loading: new Set(),
        error: new Set(),
    };
}

/***************************************************
 * Client Methods
 **************************************************/

function LO_showLoading(id)
{
    if (typeof id == 'undefined')
        return;
    if (id in LO_idMap.loading)
    {
        // TODO id already exists. should do anything here?
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

/***************************************************
 * Helper functions
 **************************************************/

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
            break;
        case KEY_SQ_BRACE_L:
            $("#agendatab").tab('show');
            break;
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
/***************************************************
 * Main Module
 * Think of this module as the main() function. 
 * It is the first thing that gets called
 **************************************************/
var NAV_ID = ["agendatab", "calendartab"];
var TAB_ID = ["agenda", "calendar"];
var SECTION_MAP;
var SECTION_MAP_INVERSE;
var COURSE_MAP;
var COURSE_SECTIONS_MAP;
var COURSE_FILTER_BLACKLIST;

function init()
{
    //pinnedIDs = new Set();

    // initializing
    LO_init();
    RF_init();
    
    // set up ajax, so it shows loading indicator and send csrf properly
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            // xhr.setRequestHeader('term_code', CUR_SEM.term_code);
            if (settings.loadingIndicator == false)
                return;
            var loadingID = settings.loadingID;
            if (typeof loadingID == 'undefined')
                loadingID = settings.url;
            LO_showLoading(loadingID);
        },
    });
    $(document).ajaxSuccess(function(event, xhr, settings){
        var loadingID = settings.loadingID;
        if (typeof loadingID == 'undefined')
            loadingID = settings.url;
        LO_hideLoading(loadingID);
    });
    $(document).ajaxError(function(event, xhr, settings){
        var loadingID = settings.loadingID;
        if (typeof loadingID == 'undefined')
            loadingID = settings.url;
        LO_hideLoading(loadingID, false);
        if (settings.loadingIndicator == false)
            return;
        LO_showError(loadingID);
    });

    // more inits
    CacheMan_init();

    // get section info
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
        var user = localStorage.getItem('user');
        if (!sectionsMap || sectionsMap != CacheMan_load('/get/sections') || !user || user != USER_NETID)
        {
            clearLocalStorage();
            localStorage.setItem('sectionsmap', CacheMan_load('/get/sections'));
            localStorage.setItem('user', USER_NETID);
        }
    }
   
    
    // more inits
    //SB_init();
    SR_init();
    //EventsMan_init();
    //PopUp_init();
    //NO_init();
    //Agenda_init();
    //Cal_init();
    SE_init();
    Tutorial_Setup();

    // state restoration
    SR_addWillSaveListener(function (){
        Nav_save();
        UI_save();
    });
    SR_addDidLoadListener(function (){
        Nav_load();
        UI_load();
    });

    // if event id changes, manage the ui module accordingly
    // EventsMan_addEventIDsChangeListener(function(oldID, newID){
    //     if (UI_isMain(oldID))
    //         UI_setMain(newID);
    //     else if (UI_isPinned(oldID))
    //     {
    //         UI_unpin(oldID);
    //         UI_pin(newID);
    //     }
    // });

    // load the correct theme
    if (THEME == 'w')
        loadWhiteTheme();
    else
        loadDarkTheme();

    // initialize tooltip
    $('.withtooltip').tooltip({});

    // handle resize
    $(window).on('resize', function(ev){
        adaptSize();
    });
    adaptSize();

    // check for unapproved revisions
    // UR_pullUnapprovedRevisions();

    // check for unapproved revisions at 10 seconds interval
    RF_addRecurringFunction(function(isInterval){
        updatePoints();
    }, 5 * 1000, 2 * 60 * 1000);
    RF_addRecurringFunction(function(isInterval){
        // UR_pullUnapprovedRevisions();
    }, 10 * 1000, 5 * 60 * 1000);
}

/**
 * This is how we are responsive
 */
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
    } else {
    }
}

/***************************************************
 * State restoration for nav and popup
 **************************************************/
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
/***************************************************
 * Miscellaneous
 **************************************************/
/**
 * A helpful method to disable all user interactions
 */
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

/**
 * Toggle tutorial
 */
function toggleInfo()
{
    $('.main-content').toggleClass('main-hidden');
    $('#about-content').toggleClass('about-hidden');
}
function onLogOut()
{
    clearLocalStorage();
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
function updatePoints()
{
    $.ajax('/api/point_count', {
        loadingIndicator: false,
        dataType: 'json',
        success: function(data){
            POINT_COUNT = data;
            $('#point_count').text(POINT_COUNT);
        }
    });
}
/***************************************************
 * Settings Module
 **************************************************/
var SE_id = 'settingsModal';
function SE_init()
{
    $('#' + SE_id).on('show.bs.modal', function(){
        // set up
        var agenda_scm = SE_addTypeSegmentedControlWithFilter('Visible in agenda:', AGENDA_FILTER);
        $(this).find('#agenda_options').append(agenda_scm);
        var calendar_scm = SE_addTypeSegmentedControlWithFilter('Visible in calendar:', CAL_FILTER);
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
        var course_scm = SCM_initWithChoices('Visible courses:', choices);
        $(course_scm).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    COURSE_FILTER_BLACKLIST.remove(key);
                else
                    COURSE_FILTER_BLACKLIST.add(key);
            });
        });
        $(this).find('#course_options').append(course_scm);
        var tz_sc = SC_initWithChoices('Timezone:', [
                {
                    value: 1,
                    pretty: 'Princeton\'s timezone',
                    selected: MAIN_TIMEZONE != null,
                },
                {
                    value: 0,
                    pretty: 'Local timezone',
                    selected: MAIN_TIMEZONE == null,
                }
            ]);
        $(tz_sc).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                {
                    if (key == 1)
                    {
                        // princeton
                        MAIN_TIMEZONE = PRINCETON_TIMEZONE;
                    }
                    else
                    {
                        // local
                        MAIN_TIMEZONE = null;
                    }
                }
            });
        });
        $(this).find('#timezone_options').append(tz_sc);
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

// Tutorial modal
function Tutorial_Setup() {
    // Activates tutorial modal on first page load.
    // Then sets cookie to remember that we've already seen it.

    // IE8-compatible refactor from http://stackoverflow.com/a/13865075/130164

    if($.cookie('tutorial_msg') != null && $.cookie('tutorial_msg') != "")
    {
        $("div#tutorialModal.modal, .modal-backdrop").hide();
    }
    else
    {
        $('#tutorialModal').modal('show');
        $.cookie('tutorial_msg', 'str');
    }
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
