$(init)
var NAV_ID = ["agendatab", "calendartab"];
var TAB_ID = ["agenda", "calendar"];
pinnedIDs = new Set();
mainID = null;

function init()
{
    CacheMan_init();
    EventsMan_init();
    Nav_load();
    UI_load();
    PopUp_init();
    Agenda_init();
    Cal_init();
    $(window).bind("beforeunload", function(){
        Nav_save();
        UI_save();
    });
}
function Nav_save()
{
    var id = $("#maintab").find(".active").find("a")[0].id;
    $.cookie("nav_page", NAV_ID.indexOf(id));
}
function Nav_load()
{
    var index = $.cookie("nav_page");
    if (index == null)
        return;
    $("#maintab #"+NAV_ID[index]).tab("show");
    //$("#maintab li").removeClass("active");
    //$("#maintab #"+NAV_ID[index]).parent().addClass("active");
    //$(".tab-pane").removeClass("in");
    //$("#"+TAB_ID[index]).addClass("in");
}

function br2nl(text)
{
    return text.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n"); // g = replace all occurences
}
function nl2br(text)
{
    return text.replace(/(\n|\r)/g, "<br>");
}

/**
 * Code taken from Stackoverflow, http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
 */
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

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
    mainID = id;
}
function UI_unsetMain()
{
    mainID = null;
}
function UI_save()
{
    $.cookie('pinned_IDs', JSON.stringify(pinnedIDs));
    if (mainID != null)
        $.cookie('main_ID', mainID);
}
function UI_load()
{
    if ($.cookie('pinned_IDs') != null)
    {
        var savedPinnedIDs = JSON.parse($.cookie('pinned_IDs'));
        $.each(savedPinnedIDs, function (key, value) {
            UI_pin(key);
        });
        $.removeCookie('pinned_IDs');
    }
    if ($.cookie('main_ID') != null)
    {
        UI_setMain($.cookie('main_ID'));
        $.removeCookie('main_ID')
    }
}
