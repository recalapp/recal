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
            if (settings.loadingIdicator == false)
                return;
            LO_showLoading(settings.url);
        }
    });
    $(document).ajaxSuccess(function(event, xhr, settings){
        LO_hideLoading(settings.url);
    });
    $(document).ajaxError(function(event, xhr, settings){
        LO_hideLoading(settings.url, false);
        if (false && settings.loadingIdicator == false)
            return;
        LO_showError(settings.url);
    });
    SB_init();
    CacheMan_init();
    CourseMan_init();
    EventsMan_init();
    Cal_init();
    PopUp_init();
    CL_init();
    UP_init();

    SECTION_COLOR_MAP = JSON.parse(CacheMan_load('/get/section-colors'));
    DEFAULT_SECTION_COLORS = JSON.parse(CacheMan_load('/get/default-section-colors'));
    courseColorMap_init();
    usableColor_init();
    // clear out the cache if you come to this page, in case your classes change
    // TODO detect what the changes are? then delete accordingly
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.removeItem('eventsman.events');
        localStorage.removeItem('eventsman.hidden');
        localStorage.removeItem('eventsman.lastsyncedtime');
        localStorage.removeItem('user');
        localStorage.removeItem('state-restoration');
    } 
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
    // TODO: does this overwrite values when two sections with the 
    // same color are found?
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
    var color = USABLE_COLORS.pop();
    if (!color)
    {
        color = DEFAULT_SECTION_COLORS[0];
    }

    // if (!COURSE_COLOR_MAP[course_id])
    COURSE_COLOR_MAP[course_id] = color;

    return color;
}
