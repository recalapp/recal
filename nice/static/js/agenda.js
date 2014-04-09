AGENDA_INIT = false;


/***************************************************
 * Initialization/State Restoration
 **************************************************/

function Agenda_init() {
    if (AGENDA_INIT)
        return;
    AGENDA_INIT = true;
    EventsMan_addUpdateListener(function(){
        Agenda_reload();
    });


    $(".tab-pane").each(function(index){
        if (this.id == "agenda")
        {
            $(this).bind("webkitTransitionEnd transitionend otransitionend oTransitionEnd", function (e){
                //Agenda_loadFromPopUp();
                Agenda_reload();
            });
        }
    });
    PopUp_addCloseListener(function(id) {
        Agenda_unhighlight($(".panel#"+id));
    });
} 

function Agenda_reload()
{
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    var eventIDs = EventsMan_getEventIDForRange(startDate.getTime() / 1000, endDate.getTime() / 1000);
    var agendaContainer = $("#agenda")
    agendaContainer[0].innerHTML = null;
    $.each(eventIDs, function(index) {
        agendaContainer.append(CacheMan_load("agenda-template"));
        var agenda = agendaContainer.find("#agenda123")[0];
        agenda.id = this;
        var eventDict = EventsMan_getEventByID(this);
        $(agenda).find(".panel-body").find('h4').text(eventDict.event_title);

        if (UI_isPinned(agenda.id))
            Agenda_highlight(agenda);
        if (UI_isMain(agenda.id))
            Agenda_highlight(agenda);
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
        PopUp_setToEventID(popUp, panel.id)
        PopUp_giveFocus(popUp);
        UI_pin(panel.id);
        return;
    }
    
    Agenda_unhighlight($(".panel-primary").filter(function(){
        return !UI_isPinned(this.id);
    }));
    Agenda_highlight(panel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setFirstDrag(popUp, function() {
        UI_pin(panel.id);
    });
    PopUp_setToEventID(popUp, panel.id);
    UI_setMain(panel.id);
    //PopUp_setID(popUp, panel.id);
    //PopUp_setTitle(popUp, title);
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
    $(agenda).addClass("panel-default").removeClass("panel-primary").each(function(index) {
        UI_unpin(this.id);
    });
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
