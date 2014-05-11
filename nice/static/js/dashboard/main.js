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
    RF_init();
    
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            xhr.setRequestHeader('term_code', CUR_SEM.term_code);
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
    /*setInterval(function(){
        UR_pullUnapprovedRevisions();
    }, 10 * 1000)
    setInterval(function(){
        updatePoints();
    }, 60 * 1000);*/
    RF_addRecurringFunction(function(isInterval){
        updatePoints();
    }, 10 * 1000, 5 * 60 * 1000);
    RF_addRecurringFunction(function(isInterval){
        UR_pullUnapprovedRevisions();
    }, 10 * 1000, 5 * 60 * 1000);
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
        $('.agenda-container').children('.col-xs-4').removeClass('col-xs-4 col-xs-offset-1').addClass('col-xs-12');
    } else {
        $('.agenda-container').children('.col-xs-12').addClass('col-xs-4 col-xs-offset-1').removeClass('col-xs-12');
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
