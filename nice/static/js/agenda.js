AGENDA_INIT = false;

/***************************************************
 * Initialization/State Restoration
 **************************************************/

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
        Agenda_unhighlight($(".panel#"+id));
    });
    Agenda_loadFromPopUp();
} 

function Agenda_loadFromPopUp()
{
    Agenda_unhighlight($(".agenda-item"));
    PopUp_map(function(popUp, isMain){
        panel = $(".agenda-item#"+PopUp_getID(popUp))[0];
        Agenda_highlight(panel);
        if (!isMain)
            Agenda_pin(panel);
        else
            PopUp_setFirstDrag(popUp, function() {
                Agenda_pin(panel);
            });
    });
}

/***************************************************
 * Event handlers
 **************************************************/

function selectAgenda(agendaAnchor)
{
    var title = agendaAnchor.querySelector("h4").textContent;
    var panel = $(agendaAnchor).find(".panel")[0];
    if (Agenda_isHighlighted(panel))
    {
        id = panel.id;
        PopUp_giveFocusToID(id);
        return;
    }

    if (SHIFT_PRESSED)
    {
        Agenda_highlight(panel);
        popUp = PopUp_insertPopUp(false);
        PopUp_setID(popUp, panel.id);
        PopUp_setTitle(popUp, title);
        PopUp_giveFocus(popUp);
        Agenda_pin(panel);
        return;
    }
    
    Agenda_unhighlight($(".panel-primary").not(".pinned"));
    Agenda_highlight(panel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setFirstDrag(popUp, function() {
        Agenda_pin(panel);
    });
    PopUp_setID(popUp, panel.id);
    PopUp_setTitle(popUp, title);
    PopUp_giveFocus(popUp);
}

/***************************************************
 * Appearance
 **************************************************/

function Agenda_highlight(agenda)
{
    $(agenda).addClass("panel-primary").removeClass("panel-default");
}
function Agenda_unhighlight(agenda)
{
    $(agenda).addClass("panel-default").removeClass("panel-primary").removeClass("pinned");
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
function Agenda_pin(agenda)
{
    $(agenda).addClass("pinned");
}
