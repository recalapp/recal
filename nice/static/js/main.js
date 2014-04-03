$(init)
var NAV_ID = ["agendatab", "calendartab"];
var TAB_ID = ["agenda", "calendar"];

function init()
{
    Nav_load();
    PopUp_init();
    Agenda_init();
    Cal_init();
    $(window).bind("beforeunload", function(){
        Nav_save();
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
    return text.replace(/(\n|\r)/g, "").replace("<br>", "\n");
}
function nl2br(text)
{
    return text.replace(/(\n|\r)/g, "<br>");
}
