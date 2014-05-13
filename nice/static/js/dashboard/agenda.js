/***************************************************
 * Agenda Module
 * requires: UI module (UI_isPinned, UI_isMain),
 *           PopUp module
 *           Events Manager module
 **************************************************/

AGENDA_INIT = false;
var AGENDA_HTML = null;

/***************************************************
 * Initialization/State Restoration
 **************************************************/

function Agenda_init() {
    if (AGENDA_INIT)
        return;
    AGENDA_INIT = true;

    // save html template and remove it from dom tree
    AGENDA_HTML = $('#agenda-template').html();
    $('#agenda-template').remove();

    // reload before displaying
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
    $("#agenda.tab-pane").each(function(index){
        $(this).on("transitionend", function (e){
            if ($(this).hasClass('in'))
                Agenda_reload();
        });
    });

    // unhighlight closed events
    PopUp_addCloseListener(function(id) {
        Agenda_unhighlight($('.tab-content').find('.agenda-item.panel#'+id));
    });

    // reload
    Agenda_reload();
} 

/**
 * returns true if the agenda view is active
 */
function Agenda_active()
{
    return $('#agenda').hasClass('active');
}

/**
 * assumption: reloading is cheap
 */
function Agenda_reload()
{
    LO_showLoading('agenda loading');
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
    LO_hideLoading('agenda loading');
}

/**
 * filter using course and event types
 */
function Agenda_filterEvents(eventIDs)
{
    var ret = [];
    $.each(eventIDs, function(index){
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        if (AGENDA_FILTER.contains(eventDict.event_type))
            if (!(eventDict.course_id in COURSE_FILTER_BLACKLIST))
                ret.push(this);
    });
    return ret;
}

/**
 * load all the event in eventIDs into the agenda view
 */
function Agenda_loadEvents(eventIDs)
{
    var agendaContainer = $("#agenda");

    $.each(eventIDs, function(index) {
        var eventDict = EventsMan_getEventByID(this);
        if (!eventDict)
            return;
        agendaContainer.append($(AGENDA_HTML));
        var agenda = agendaContainer.find("#agenda123")[0];
        agenda.id = this;
        
        $(agenda).find(".panel-body").find('h4').text(eventDict.event_title); 
        $(agenda).find('#agenda-section').text(SECTION_MAP[eventDict.section_id]);
        
        var start = moment.unix(eventDict.event_start);
        var startTZ = start;
        if (MAIN_TIMEZONE)
            startTZ = start.tz(MAIN_TIMEZONE);
        var timeText = startTZ.calendar();
        $(agenda).find('#agenda-time').text(timeText);
        // TODO: add overdue field when creating new event
        // if (eventDict['overdue'])
        // {
        //     $(agenda).find('#agenda-time').css('color', 'red');
        // }

        // set colors in the agenda
        _Agenda_setColors(agenda, eventDict, EventsMan_eventIsHidden(this), THEME);

        if (UI_isPinned(agenda.id))
            Agenda_highlight(agenda);
        if (UI_isMain(agenda.id))
            Agenda_highlight(agenda);
    });

    if (window.innerWidth <= 400)
    {
        $('.agenda-container').children('.col-xs-4').removeClass('col-xs-4 col-xs-offset-1').addClass('col-xs-12');
    }
    if (THEME == 'w')
        $('.theme').removeClass('dark');
    else
        $('.theme').addClass('dark');
}

function _Agenda_setColors(agenda, eventDict, isHidden, theme)
{
    var agendaColorClass = 'course-color-' + eventDict.course_id;
    var courseColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
    $(agenda).parent().find('.agenda-tag').addClass(agendaColorClass).css('background-color', courseColor);
    $(agenda).data('course-color', courseColor);

    var oldColor = $(agenda).css('border-color');
    $(agenda).data('default-border-color', oldColor);

    var darkerColor;
    if (theme == 'w')
        darkerColor = 'rgba(0,0,0,0.4)';
    else
        darkerColor = 'rgba(255,255,255,0.5)';

    $(agenda).data('default-text-color', darkerColor);
    $(agenda).find('#agenda-section').addClass(agendaColorClass).css('color', darkerColor);
    $(agenda).find('#agenda-title').addClass(agendaColorClass).css('color', darkerColor);

    if (isHidden)
        $(agenda).css('border-style', 'dashed');
}
function Agenda_insertHeader(text)
{
    var agendaContainer = $("#agenda");
    var $agendaHeader = $('<div class="agenda-header row">');
    $('<div class="col-xs-5 col-xs-offset-1">').append('<h3 id="agenda-header-text"></h3>').appendTo($agendaHeader);
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
    var popUp = PopUp_getMainPopUp();
    var $panel = $(panel);
    var success = PopUp_setToEventID(popUp, panel.id, function(){
        // retry
        PopUp_giveFocus(popUp);
        Agenda_unhighlight($(".agenda-item.panel-primary").filter(function(){
            return !UI_isPinned(this.id);
        }));
        Agenda_highlight($('#' + panel.id + '.agenda-item'));
    });
    if (!success)
        return;
    PopUp_giveFocus(popUp);
    
    Agenda_unhighlight($(".agenda-item.panel-primary").filter(function(){
        return !UI_isPinned(this.id);
    }));
    Agenda_highlight($panel);
}

/***************************************************
 * Appearance
 **************************************************/

function Agenda_highlight(agenda)
{
    if (Agenda_isHighlighted(agenda))
        return;
    var courseColor = $(agenda).data('course-color');
    $(agenda).find('#agenda-section').css('color', courseColor);
    $(agenda).find('#agenda-title').css('color', courseColor);
    $(agenda).addClass("panel-primary").removeClass("panel-default").css({
        'border-color': courseColor,
    });
}
function Agenda_unhighlight(agenda)
{
    var borderColor = $(agenda).data('default-border-color');
    var defaultTextColor = $(agenda).data('default-text-color');
    $(agenda).addClass("panel-default").removeClass("panel-primary").css({
        'border-color': borderColor,
    });;
    $(agenda).find('#agenda-section').css('color', borderColor);
    $(agenda).find('#agenda-title').css('color', defaultTextColor);
    $(agenda).find('#agenda-section').css('color', defaultTextColor);
}
function Agenda_isHighlighted(agenda)
{
    return $(agenda).hasClass("panel-primary");
}
