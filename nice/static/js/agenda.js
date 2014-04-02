AGENDA_INIT = false;

function Agenda_init() {
    if (AGENDA_INIT)
        return;
    AGENDA_INIT = true;
    $(".tab-pane").each(function(index){
        if (this.id == "agenda")
        {
            $(this).bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function (e){
                Agenda_loadFromPopUp();
            });
        }
    });
    PopUp_addCloseListener(function(id) {
         $(".panel#"+id).removeClass("pinned").removeClass("panel-primary").addClass("panel-default");
    });
    Agenda_loadFromPopUp();
} 

function Agenda_loadFromPopUp()
{
    $(".agenda-item").removeClass("pinned").removeClass("panel-primary").addClass("panel-default");
    PopUp_map(function(popUp, isMain){
        panel = $(".agenda-item#"+PopUp_getID(popUp))[0];
        $(panel).addClass("panel-primary").removeClass("panel-default");
        if (!isMain)
            $(panel).addClass("pinned");
        else
            PopUp_setFirstDrag(popUp, function() {
                $(panel).addClass("pinned");
            });
    });
}

function selectAgenda(agendaAnchor)
{
    var title = agendaAnchor.querySelector("h4").textContent;
    var panel = $(agendaAnchor).find(".panel")[0];
    if ($(panel).hasClass("panel-primary"))
    {
        id = panel.id;
        PopUp_giveFocusToID(id);
        return;
    }

    if (SHIFT_PRESSED)
    {
        $(panel).removeClass("panel-default").addClass("panel-primary");
        popUp = PopUp_insertPopUp(false);
        PopUp_setID(popUp, panel.id);
        PopUp_setTitle(popUp, title);
        PopUp_giveFocus(popUp);
        $(panel).addClass("pinned");
        return;
    }
    
    $(".panel-primary").not(".pinned").removeClass("panel-primary").addClass("panel-default");

    $(panel).removeClass("panel-default").addClass("panel-primary");

    var popUp = PopUp_getMainPopUp();
    PopUp_setFirstDrag(popUp, function() {
        $(panel).addClass("pinned");
    });
    PopUp_setID(popUp, panel.id);
    PopUp_setTitle(popUp, title);
    PopUp_giveFocus(popUp);
}
