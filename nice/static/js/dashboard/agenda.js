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
                if ($(this).hasClass('in'))
                    Agenda_reload();
            });
        }
    });
    PopUp_addCloseListener(function(id) {
        Agenda_unhighlight($('.tab-content').find('.panel#'+id));
    });
} 

function Agenda_reload()
{
    var agendaContainer = $("#agenda")
    var added = false;
    agendaContainer[0].innerHTML = null;
    // yesterday 0:00:00 AM to before midnight
    var curDate = moment();
    var startDate = moment().date(curDate.date() - 1).hour(0).minute(0).second(0);
    var endDate = moment().date(curDate.date()).hour(0).minute(0).second(0);
    var eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('Yesterday');
        Agenda_loadEvents(eventIDs);
    }

    // today to midnight
    startDate = endDate;
    endDate = moment().date(curDate.date() + 1).hour(0).minute(0).second(0);
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('Today');
        Agenda_loadEvents(eventIDs);
    }

    // this week
    startDate = endDate;
    endDate = moment().date(curDate.date() + 7).hour(0).minute(0).second(0);
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('This Week');
        Agenda_loadEvents(eventIDs);
    }

    // this month
    startDate = endDate;
    endDate = moment().date(curDate.date() + 30).hour(0).minute(0).second(0);
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    if (eventIDs.length > 0)
    {
        added |=true;
        Agenda_insertHeader('This month');
        Agenda_loadEvents(eventIDs);
    }
    if (!added)
    {
        Agenda_insertHeader('Congrats! You have nothing on your agenda!');
    }
}
function Agenda_loadEvents(eventIDs)
{
    var agendaContainer = $("#agenda");

    $.each(eventIDs, function(index) {
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        agendaContainer.append(CacheMan_load("agenda-template"));
        var agenda = agendaContainer.find("#agenda123")[0];
        agenda.id = this;
        
        $(agenda).find(".panel-body").find('h4').text(eventDict.event_title);

        if (UI_isPinned(agenda.id))
            Agenda_highlight(agenda);
        if (UI_isMain(agenda.id))
            Agenda_highlight(agenda);
    });
}
function Agenda_insertHeader(text)
{
    var agendaContainer = $("#agenda");
    agendaContainer.append(CacheMan_load('agenda-header'));
    var header = $('#agenda-header123')[0];
    header.id = '';
    $(header).find('#agenda-header-text').text(text);
}

/***************************************************
 * Event handlers
 **************************************************/

function selectAgenda(agendaAnchor)
{
    var panel = $(agendaAnchor).find(".panel")[0];
    if (Agenda_isHighlighted(panel))
    {
        var id = panel.id;
        PopUp_giveFocusToID(id);
        return;
    }

    if (SHIFT_PRESSED)
    {
        Agenda_highlight(panel);
        popUp = PopUp_insertPopUp(false);
        PopUp_setToEventID(popUp, panel.id)
        PopUp_giveFocus(popUp);
        return;
    }
    
    Agenda_unhighlight($(".panel-primary").filter(function(){
        return !UI_isPinned(this.id);
    }));
    Agenda_highlight(panel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setToEventID(popUp, panel.id);
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
    $(agenda).addClass("panel-default").removeClass("panel-primary");
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
