$(init)
var NAV_ID = ["agendatab", "calendartab"];
var TAB_ID = ["agenda", "calendar"];

function init()
{
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
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    SP_init(); // give priority - not dependent on anything
    SB_init();
    SR_init();
    CacheMan_init();
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

}
function Nav_save()
{
    var id = $("#maintab").find(".active").find("a")[0].id;
    SR_put("nav_page", NAV_ID.indexOf(id));
}
function Nav_load()
{
    return;
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
            UI_pin(key);
        });
        //$.removeCookie('pinned_IDs');
    } 
    if (SR_get('main_ID') != null)
    {
        if (SR_get('main_ID') != 'null')
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
