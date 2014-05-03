AGENDA_INIT = false;
var AGENDA_HTML = null;

/***************************************************
 * Initialization/State Restoration
 **************************************************/

function Agenda_init() {
    if (AGENDA_INIT)
        return;
    AGENDA_INIT = true;

    AGENDA_HTML = $('#agenda-template').html();
    $('#agenda-template').remove();

    EventsMan_addUpdateListener(function(){
        if (!Agenda_active())
            return;
        Agenda_reload();
    });
    $('#'+SE_id).on('close', function(ev){
        if (!Agenda_active())
            return;
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
        Agenda_unhighlight($('.tab-content').find('.agenda-item.panel#'+id));
    });
    Agenda_reload();
} 

function Agenda_active()
{
    return $('#agenda').hasClass('active');
}

function Agenda_reload()
{
    LO_show();
    var agendaContainer = $("#agenda")
    var added = false;
    agendaContainer[0].innerHTML = null;
    // yesterday 0:00:00 AM to before midnight
    var curDate = moment();
    var startDate = moment().date(curDate.date() - 1).hour(0).minute(0).second(0);
    var endDate = moment().date(curDate.date()).hour(0).minute(0).second(0);
    var eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
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
    eventIDs = Agenda_filterEvents(eventIDs);
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
    eventIDs = Agenda_filterEvents(eventIDs);
    if (eventIDs.length > 0)
    {
        added |= true;
        Agenda_insertHeader('This Week');
        Agenda_loadEvents(eventIDs);
    }

    // this month
    startDate = endDate;
    endDate = moment().month(curDate.month() + 1);
    endDate = endDate.date(0) // does this go back to prev month??
    eventIDs = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
    eventIDs = Agenda_filterEvents(eventIDs);
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
    LO_hide();
}

function Agenda_filterEvents(eventIDs)
{
    var ret = [];
    $.each(eventIDs, function(index){
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        if (AGENDA_FILTER.contains(eventDict.event_type))
            ret.push(this);
    });
    return ret;
}

// function Agenda_loadEventsWithTime(eventIDs, time)
// {
//     if (time == 'yesterday')
//     {
//         $.each(eventIDs, function(index) {
//             var eventDict = EventsMan_getEventById(this);
//             if (eventDict['event_type'] == "AS")
//             {
//                 eventDict['overdue'] = 'true';
//             }
//         });
//     }
// }

function Agenda_loadEvents(eventIDs)
{
    var agendaContainer = $("#agenda");

    $.each(eventIDs, function(index) {
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        //agendaContainer.append(CacheMan_load("agenda-template"));
        agendaContainer.append($(AGENDA_HTML));
        var agenda = agendaContainer.find("#agenda123")[0];
        agenda.id = this;
        
        $(agenda).find(".panel-body").find('h4').text(eventDict.event_title);
        $(agenda).find('#agenda-section').text(SECTION_MAP[eventDict.section_id]);
        
        var start = moment.unix(eventDict.event_start);
        var timeText = start.tz(MAIN_TIMEZONE).calendar();
        $(agenda).find('#agenda-time').text(timeText);
        // TODO: add overdue field when creating new event
        // if (eventDict['overdue'])
        // {
        //     $(agenda).find('#agenda-time').css('color', 'red');
        // }

        // set colors in the agenda
        _Agenda_setColors(agenda, eventDict);

        if (UI_isPinned(agenda.id))
            Agenda_highlight(agenda);
        if (UI_isMain(agenda.id))
            Agenda_highlight(agenda);
        if (EventsMan_eventIsHidden(this))
        {
            // TODO(Dyland) change appearance of hidden agendas
        }
        else
        {
            // TODO(Dyland) change appearance of non-hidden agendas
        }
    });
    if (THEME == 'w')
        $('.theme').removeClass('dark');
    else
        $('.theme').addClass('dark');
}

function _Agenda_setColors(agenda, eventDict)
{
    var agendaColorClass = 'course-color-' + eventDict.course_id;
    var courseColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
    $(agenda).find('#agenda-section').addClass(agendaColorClass).css('color', courseColor);
    $(agenda).find('#agenda-title').addClass(agendaColorClass).css('color', courseColor);
    $(agenda).parent().find('.agenda-tag').addClass(agendaColorClass).css('background-color', courseColor);
    $(agenda).data('new-color', courseColor);
    // $(agenda).find('#agenda-section').closest('panel').addClass(agendaColorClass).css('border-color', '#A1B2C3');

    // $(agenda).data('new-color', '#334499');

    var oldColor = $(agenda).css('border-color');
    $(agenda).data('default-color', oldColor);
}
function Agenda_insertHeader(text)
{
    var agendaContainer = $("#agenda");
    var $agendaHeader = $('<div class="agenda-header row">');
    $('<div class="col-xs-5">').append('<h3 id="agenda-header-text"></h3>').appendTo($agendaHeader);
    agendaContainer.append($agendaHeader);
    $agendaHeader.find('#agenda-header-text').text(text);
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
    
    Agenda_unhighlight($(".agenda-item.panel-primary").filter(function(){
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
    if (Agenda_isHighlighted(agenda))
        return;
    var newColor = $(agenda).data('new-color');
    //var newColor = '#123456';
    // var oldColor = $(agenda).css('border-color');
    // $(agenda).data('default-color', oldColor);
    $(agenda).addClass("panel-primary").removeClass("panel-default").css({
        'border-color': newColor,
    });
}
function Agenda_unhighlight(agenda)
{
    var oldColor = $(agenda).data('default-color');
    $(agenda).addClass("panel-default").removeClass("panel-primary").css({
        'border-color': oldColor,
    });;
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
