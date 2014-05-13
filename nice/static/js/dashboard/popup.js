POPUP_CLASS = 'popup-event';
function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;

    // get html template and remove from dom
    POPUP_HTML = $('#popup-template').html();
    $('#popup-template').remove();
    
    // modify jQuery draggable to have a before drag callback
    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

    // setting bounds
    topPos = parseInt($(".navbar").css("height")) + parseInt($(".navbar").css("margin-top"));
    height = window.innerHeight - topPos + 300;
    $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    $(window).on('resize', function(ev){
        topPos = parseInt($(".navbar").css("height")) + parseInt($(".navbar").css("margin-top"));
        height = window.innerHeight - topPos + 300;
        $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    });

    // event listeners
    EventsMan_addOnReadyListener(function(){
        PopUp_load();
    });
    SR_addWillSaveListener(function (){
        PopUp_save();
    })
    EventsMan_addEventIDsChangeListener(function(oldID, newID){
        var popUp = PopUp_getPopUpByID(newID);
        if (popUp)
        {
            PopUp_close(popUp);
        }
        var popUp = PopUp_getPopUpByID(oldID);
        if (popUp)
            PopUp_setToEventID(popUp, newID);
    });
    EventsMan_addUpdateListener(function(){
        PopUp_map(function(popUp, isMain){
            if (EventsMan_hasEvent(PopUp_getID(popUp)) && EventsMan_eventShouldBeShown(PopUp_getID(popUp)))
                PopUp_setToEventID(popUp, PopUp_getID(popUp));
            else
                PopUp_close(popUp);
        });
    });
}

/***************************************************
 * Creating/removing
 **************************************************/

/**
 * Initialize the pickers. This can be deferred as the delay is
 * too small for the user to begin editing before the pickers are ready
 */
function PopUp_initialize_deferred(popUp)
{
    if ($(popUp).find(".withdatepicker")[0].type == 'text') // defaults to browser's builtin date picker on mobile
    {
        $(popUp).find(".withdatepicker").datetimepicker({
            format: "MM d, yyyy",
            autoclose: true,
            minView: 2,
            maxView: 3
        });
    } else {
        $(popUp).find('.withdatepicker').removeClass('withdatepicker');
    }
    if ($(popUp).find(".withtimepicker")[0].type == 'text')// defaults to browser's builtin date picker on mobile
    {   
        $(popUp).find(".withtimepicker").datetimepicker({
            format: "H:ii P",
            formatViewType: "time",
            autoclose: true,
            minView: 0,
            maxView: 1,
            startView: 0,
            linkField: "withdatepicker",
            linkFormat: "yyyy-mm-dd",
            showMeridian: true,
            minuteStep: 10,
            startDate: new Date(moment('Dec 31, 1899 12:00 AM').unix() * 1000),
            endDate: new Date(moment('Jan 1, 1900 12:00 AM').unix() * 1000),
        });
    } else {
        $(popUp).find('.withtimepicker').removeClass('withtimepicker');
    }
}

/**
 * initialize the things at are part of the popup itself, such as
 * recurrence segmented control.
 */
function PopUp_initialize(popUp)
{
    var choices = [];
    $.each (DAYS_DICT, function(index){
        choices.push({
            value: index,
            pretty: this,
            selected: false,
        });
    });
    var repeat_scm = SCM_initWithChoices('', choices);
    $(popUp).find('#popup-repeat-pattern').append(repeat_scm); 

    var choices = [
        {
            value: 1,
            pretty: 'Every week',
            selected: false,
        },
        {
            value: 2,
            pretty: 'Every 2 weeks',
            selected: false,
        },
        {
            value: 4,
            pretty: 'Every month',
            selected: false,
        },
    ];
    var repeat_interval_sc = SC_initWithChoices('', choices);
    $(popUp).find('#popup-repeat-interval').append(repeat_interval_sc);
}

/***************************************************
 * Getters and Setters
 **************************************************/

/**
 * Set the popup to the specified event id.
 * If the popup has uncommitted changes, it refuses
 * to change, and return false. If a retry listener
 * is given, it tries to change it again after the user
 * saves
 */
function PopUp_setToEventID(popUp, id, retryListener)
{
    var oldID = PopUp_getID(popUp);
    if (oldID && oldID != id)
    {
        if (EventsMan_hasUncommitted(oldID))
        {
            AS_showActionSheetFromElement($(popUp).find('#close_button')[0], popUp, 'Save changes?',[
                    {
                        important: false,
                        text: 'Save',
                    },
                    {
                        important: true,
                        text: 'Don\'t save',
                    }
                ],
                function(index){
                    if (index == 0) {
                        PopUp_clickedSavePopUp(popUp, false);
                    }
                    else{
                        PopUp_clickedUndo(popUp);
                    }
                    if (retryListener)
                    {
                        PopUp_setToEventID(popUp, id);
                        retryListener();
                    }
                }
            );
            return false;
        }
    }
    PopUp_setID(popUp, id);
    var eventDict;
    $(popUp).find('.unsaved').removeClass('unsaved');
    if (EventsMan_hasUncommitted(id))
    {
        // not actually needed anymore, as we won't ever change
        // the popups with unapproved changes
        // but can keep the functions here, in case we want it later
        eventDict = EventsMan_getUncommitted(id);
        PopUp_markAsUnsaved(popUp);
        var savedEventDict = EventsMan_getEventByID(id);
        if (savedEventDict)
        {
            if (savedEventDict.event_title != eventDict.event_title)
                $(popUp).find('#popup-title').addClass('unsaved');
            if (savedEventDict.event_location != eventDict.event_location)
                $(popUp).find('#popup-loc').addClass('unsaved');
            if (savedEventDict.event_description != eventDict.event_description)
                $(popUp).find('#popup-desc').addClass('unsaved');
            if (savedEventDict.event_type != eventDict.event_type)
                $(popUp).find('#popup-type').addClass('unsaved');
            if (savedEventDict.section_id != eventDict.section_id)
                $(popUp).find('#popup-section').addClass('unsaved');
            var start = moment.unix(eventDict.event_start);
            var savedStart = moment.unix(savedEventDict.event_start);
            if (start.year() != savedStart.year() || start.month() != savedStart.month() || start.date() != savedStart.date())
                $(popUp).find('#popup-date').addClass('unsaved');
            if (start.hour() != savedStart.hour() || start.minute() != savedStart.minute())
                $(popUp).find('#popup-time-start').addClass('unsaved');
            var end = moment.unix(eventDict.event_end);
            var savedEnd = moment.unix(savedEventDict.event_end);
            if (end.hour() != savedEnd.hour() || end.minute() != savedEnd.minute())
                $(popUp).find('#popup-time-end').addClass('unsaved');
        }
    }
    else
    {
        eventDict = EventsMan_getEventByID(id);
        PopUp_markAsSaved(popUp);
    }
    if (!eventDict)
    {
        console.log("errorneous event id");
        PopUp_close(popUp);
        return;
    }
    PopUp_setTitle(popUp, eventDict.event_title);
    PopUp_setDescription(popUp, eventDict.event_description);
    PopUp_setLocation(popUp, eventDict.event_location);
    PopUp_setSection(popUp, eventDict.section_id);
    PopUp_setType(popUp, eventDict.event_type);
    PopUp_setDate(popUp, eventDict.event_start);
    PopUp_setStartTime(popUp, eventDict.event_start);
    PopUp_setEndTime(popUp, eventDict.event_end);
    PopUp_setLastEditedTime(popUp, eventDict.modified_time);
    var myColor = SECTION_COLOR_MAP[eventDict.section_id];
    if (!myColor)
        myColor = '#555555';
    else
        myColor = myColor['color'];
    PopUp_setColor(popUp, myColor);

    // NOTE: give focus to PopUp if should be highlighted

    // set up recurrence ui
    $(popUp).find('#popup-repeat')[0].checked = ('recurrence_days' in eventDict);
    $(popUp).find('#popup-repeat').off('change');
    $(popUp).find('#popup-repeat-pattern').off('select');
    $(popUp).find('#popup-repeat-interval').off('select');
    if ('recurrence_days' in eventDict)
    {
        var pattern = eventDict.recurrence_days;
        var choices = [];
        $.each(DAYS_DICT, function(index){
            choices.push({
                value: index,
                pretty: this,
                selected: pattern.contains(index)
            });
        });
        $(popUp).find('.popup-repeat-item').removeClass('hide');
        var scm = $(popUp).find('#popup-repeat-pattern').children()[0];
        SCM_setToChoices(scm, choices);
        var repeat_sc = $(popUp).find('#popup-repeat-interval').children()[0];
        var choices = [
            {
                value: 1,
                pretty: 'Every week',
                selected: eventDict['recurrence_interval'] == 1,
            },
            {
                value: 2,
                pretty: 'Every 2 weeks',
                selected: eventDict['recurrence_interval'] == 2,
            },
            {
                value: 4,
                pretty: 'Every month',
                selected: eventDict['recurrence_interval'] == 4,
            },
        ];
        SC_setToChoices(repeat_sc, choices);
    }
    else
    {
        var choices = [];
        $.each(DAYS_DICT, function(index){
            choices.push({
                value: index,
                pretty: this,
                selected: false
            });
        });
        $(popUp).find('.popup-repeat-item').addClass('hide');
        var scm = $(popUp).find('#popup-repeat-pattern').children()[0];
        SCM_setToChoices(scm, choices);
        var repeat_sc = $(popUp).find('#popup-repeat-interval').children()[0];
        var choices = [
            {
                value: 1,
                pretty: 'Every week',
                selected: true,
            },
            {
                value: 2,
                pretty: 'Every 2 weeks',
                selected: false,
            },
            {
                value: 4,
                pretty: 'Every month',
                selected: false,
            },
        ];
        SC_setToChoices(repeat_sc, choices);
    }
    $(popUp).find('#popup-repeat').on('change', function(ev){
        if (this.checked)
        {
            if (!('recurrence_days' in eventDict))
                PopUp_markAsUnsaved(popUp);
            $(popUp).find('.popup-repeat-item').removeClass('hide');
            PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', []);
        }
        else
        {
            if ('recurrence_days' in eventDict)
                PopUp_markAsUnsaved(popUp);
            $(popUp).find('.popup-repeat-item').addClass('hide');
            PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', null);
        }
    });
    $(popUp).find('#popup-repeat-pattern').on('select', function(ev, choices){
        var pattern = [];
        $.each(choices, function(value, selected){
            if (selected)
                pattern.push(parseInt(value));
        });
        pattern.sort();
        if (EventsMan_hasUncommitted(id))
        {
            eventDict = EventsMan_getUncommitted(id);
        }
        else
        {
            eventDict = EventsMan_getEventByID(id);
        }

        if (!('recurrence_days' in eventDict))
            PopUp_markAsUnsaved(popUp);
        else if (!pattern.equals(eventDict.recurrence_days))
            PopUp_markAsUnsaved(popUp);
        PopUp_callEditListeners(PopUp_getID(popUp), 'event_recurrence', pattern);
    });
    $(popUp).find('#popup-repeat-interval').on('select', function(ev, choices){
        $.each(choices, function(value, selected){
            if (selected)
            {
                if (EventsMan_hasUncommitted(id))
                {
                    eventDict = EventsMan_getUncommitted(id);
                }
                else
                {
                    eventDict = EventsMan_getEventByID(id);
                }
                if (eventDict.recurrence_interval != value)
                    PopUp_markAsUnsaved(popUp);
                PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT['popup-repeat-interval'], value);
            }
        });
    });

    // set the ui appropriately depending on whether the event is hidden
    if (EventsMan_eventIsHidden(id))
    {
        $(popUp).find('#unhide_button').removeClass('hide');
        $(popUp).find('#hide_button').addClass('hide');
    }
    else
    {
        $(popUp).find('#unhide_button').addClass('hide');
        $(popUp).find('#hide_button').removeClass('hide');
    }

    // set the ui for type and section pickers
    var choices = [];
    $.each(TYPE_MAP, function(key, value){
        choices.push({
            value: key,
            pretty: value,
            selected: eventDict.event_type == key,
        });
    });
    var scp = SCP_initOnElement($(popUp).find('.withtypepicker')[0], popUp, null, choices);
    $(scp).on('select', function(ev, choices){
        var selectedType;
        $.each(choices, function(key, selected){
            if (selected)
            {
                selectedType = key;
                return false;
            }
        });
        $(popUp).find('.withtypepicker').val(toTitleCase(TYPE_MAP[selectedType]));
        $(popUp).find('.withtypepicker').trigger('value_set');
    });

    var choices = [];
    $.each(SECTION_MAP, function(key, value){
        choices.push({
            value: key,
            pretty: value,
            selected: eventDict.section_id == key,
        });
    });
    var scpSection = SCP_initOnElement($(popUp).find('.withsectionpicker')[0], popUp, null, choices);
    $(scpSection).on('select', function(ev, choices){
        var selectedSection;
        $.each(choices, function(key, selected){
            if (selected)
            {
                selectedSection = key;
                return false;
            }
        });
        $(popUp).find('.withsectionpicker').val(SECTION_MAP[selectedSection]);
        $(popUp).find('.withsectionpicker').trigger('value_set');
    });
    $(popUp).find('.withcustompicker').on('hidden.bs.popover', function(ev){
        $(this).trigger('value_set');
    });

    return true;
}

function PopUp_setTitle(popUp, title)
{
    $(popUp).find("#popup-title").text(title);
}
function PopUp_setDescription(popUp, desc)
{
    $(popUp).find("#popup-desc").text(desc);
}
function PopUp_setLocation(popUp, loc)
{
    $(popUp).find('#popup-loc').text(loc);
}
function PopUp_setSection(popUp, sectionKey)
{
    $(popUp).find('#popup-section').text(SECTION_MAP[sectionKey]);
}
function PopUp_setType(popUp, typeKey)
{
    var type = toTitleCase(TYPE_MAP[typeKey]);
    $(popUp).find('#popup-type').text(type);
}
function PopUp_setDate(popUp, unixTime)
{
    var date = moment.unix(unixTime);
    if (MAIN_TIMEZONE)
        date = date.tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-date').text(date.format("MMMM D, YYYY"));
}
function PopUp_setStartTime(popUp, unixTime)
{
    var time = moment.unix(unixTime);
    if (MAIN_TIMEZONE)
        time = time.tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-start').text(time.format("h:mm A"));
}
function PopUp_setEndTime(popUp, unixTime)
{
    var time = moment.unix(unixTime);
    if (MAIN_TIMEZONE)
        time = time.tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-end').text(time.format("h:mm A"));
}
function PopUp_setLastEditedTime(popUp, unixTime)
{
    var time = moment.unix(unixTime);
    if (MAIN_TIMEZONE)
        time = time.tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-last-edited-time').text(time.format("MM/DD/YYYY"));
}
/***************************************************
 * State Restoration
 **************************************************/

function PopUp_save()
{
    var pos = [];
    PopUp_map(function(popUp, isMain) {
        var posDict = {};
        var rect = []; // x, y, w, h
        posDict.id = PopUp_getID(popUp);
        rect.push($(popUp).css("left"));
        rect.push($(popUp).css("top"));
        rect.push($(popUp).css("width"));
        rect.push($(popUp).css("height"));
        posDict.frame = rect;
        posDict.isMain = isMain;
        posDict.hasFocus = PopUp_hasFocus(popUp);
        pos.push(posDict);
    });
    var data = JSON.stringify(pos);
    SR_put('popup', data);
}
function PopUp_load()
{
    if (SR_get('popup') == null)
        return;
    var pos = JSON.parse(SR_get('popup'));
    $(pos).each(function(index) {
        popUp = PopUp_insertPopUp(this.isMain);
        if (!this.isMain)
        {
            $(popUp).css("left", this.frame[0]);
            $(popUp).css("top", this.frame[1]);
            $(popUp).css("width", this.frame[2]);
            $(popUp).css("height", this.frame[3]);
            _PopUp_setBodyHeight(popUp);
        }
        PopUp_setToEventID(popUp, this.id);
        if (this.hasFocus)
            PopUp_giveFocus(popUp);
    });
}

/***************************************************
 * Appearance
 **************************************************/

function PopUp_markAsUnsaved(popUp)
{
    $(popUp).find('#save_button').removeClass('hide');
    $(popUp).find('#undo_button').removeClass('hide');
}
function PopUp_markAsSaved(popUp)
{
    $(popUp).find('#save_button').addClass('hide');
    $(popUp).find('#undo_button').addClass('hide');
}
function PopUp_markIDAsNotEditing(id)
{
    PopUp_markAsNotEditing(PopUp_getPopUpByID(id));
}
function PopUp_markAsNotEditing(popUp)
{
    $(popUp).data('is_editing', false);
}
function PopUp_markAsEditing(popUp)
{
    $(popUp).data('is_editing', true);
}
function PopUp_isEditing(popUp)
{
    return $(popUp).data('is_editing');
}
function PopUp_makeIDDraggable(id)
{
    var popUp = PopUp_getPopUpByID(id);
    $(popUp).draggable('enable');
}
function PopUp_giveEditingFocus(popUp)
{
    var titleElement = $(popUp).find('#popup-title')[0];
    PopUp_clickedElement(titleElement);
}

/***************************************************
 * forms for editing
 * element = html element, like a h4
 * form = the corresponding form to be shown when
 * the element is clicked
 **************************************************/

function _PopUp_showFormForElement(element)
{
    var popUp = _PopUp_getPopUp(element);
    $(element).addClass("hide");
    var form_id = _PopUp_Form_getFormIDForElement(element);
    var form = $(popUp).find("#" + form_id).removeClass("hide")[0];
}
function _PopUp_hideFormForElement(form)
{
    var popUp = _PopUp_getPopUp(form);
    $(form).addClass("hide");
    var text_id = _PopUp_Form_getElementIDForForm(form);
    $(popUp).find("#"+text_id).removeClass("hide");
}
function _PopUp_Form_getValue(form)
{
    if ($(form).find("input").length > 0)
        return $(form).find("input").val();
    else if ($(form).find("textarea").length > 0)
        return $(form).find("textarea").val();
}
function _PopUp_Form_setValue(form, newValue)
{
    if ($(form).find("input").length > 0)
    {
        if ($(form).find('input')[0].type == 'date')
        {
            var date = moment(newValue).format('YYYY-MM-DD');
            $(form).find("input").val(date)
        }
        else if ($(form).find('input')[0].type == 'time')
        {
            var time = moment('April 25, 2014 ' + newValue).format('HH:mm:ss');
            $(form).find('input').val(time);
        }
        else
            $(form).find("input").val(newValue);
    }
    else if ($(form).find("textarea").length > 0)
    {
        var sanitized = br2nl(newValue);
        $(form).find("textarea").val(sanitized);
    }
}
function _PopUp_Form_giveFocus(form)
{
    if ($(form).find("input").length > 0)
        $(form).find("input")[0].focus();
    else if ($(form).find("textarea").length > 0)
        $(form).find("textarea")[0].focus();
}
function _PopUp_Form_getElementIDForForm(form)
{
    return form.id.split("-").slice(0, -1).join("-");
}
function _PopUp_Form_getFormIDForElement(element)
{
    return element.id + "-form";
}
function _PopUp_Form_addOnBlurListener(form, listener)
{
    if ($(form).find(".withdatepicker").length > 0)
        $(form).find(".withdatepicker").datetimepicker().one("hide", listener);
    else if ($(form).find(".withtimepicker").length > 0)
        $(form).find(".withtimepicker").datetimepicker().one("hide", listener);
    else if ($(form).find(".withcustompicker").length > 0)
        $(form).find(".withcustompicker").one('value_set', listener); // must be hidden, not hide, otherwise timing doesn't work out
    else if ($(form).find("input").length > 0)
        $(form).find("input").one("blur", listener);
    else if ($(form).find("textarea").length > 0)
        $(form).find("textarea").one("blur", listener);
}

/***************************************************
 * Click Event Listeners
 **************************************************/

var POPUP_FORM_NEXT = {
    '#popup-title': '#popup-date',
    '#popup-date': '#popup-time-start',
    '#popup-time-start': '#popup-time-end',
    '#popup-time-end': '#popup-loc',
    '#popup-loc': '#popup-section',
    '#popup-section': '#popup-type',
    '#popup-type': '#popup-desc',
}
var POPUP_FORM_PREV = {};
$.each(POPUP_FORM_NEXT, function(key, value){
    POPUP_FORM_PREV[value] = key;
});

function PopUp_clickedElement(element)
{
    var popUp = _PopUp_getPopUp(element);
    // if the popup is in edit mode, don't show another form
    if (PopUp_isEditing(popUp))
        return;

    // enforce start date
    _PopUp_Form_enforceStartDate(popUp);

    // mark as editing
    PopUp_markAsEditing(popUp);

    // show the corresponding form for element
    var form_id = _PopUp_Form_getFormIDForElement(element);
    var form = $(popUp).find("#"+form_id)[0];
    // gives textarea the correct height
    if ($(form).find("textarea").length > 0)
    {
        height = parseInt($(element).css("height")) + 20;
        $(form).find("textarea").css("height", height + "px");
    }
    _PopUp_showFormForElement(element);
    _PopUp_Form_setValue(form, $(element).text());
    _PopUp_Form_giveFocus(form);
    // add on blur listeners once
    _PopUp_Form_addOnBlurListener(form, function(){
        PopUp_clickedSaveElement(form);
    });
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (text_id == 'popup-title')
    {
        // if title is editing, hide the other controls - no room
        $(popUp).find('.popup-ctrl').addClass('hidden');
    }

    // do tabbing shortcuts
    $(form).find('input, textarea').off('keydown').on('keydown', function(ev){
        var keyCode = ev.keyCode || ev.which;
        if (keyCode == 9) // tab key
        {
            if (this.type == 'date' || this.type == 'time')
                return;
            ev.preventDefault();
            $(this).blur();
            if ($(this).hasClass('withtimepicker') || $(this).hasClass('withdatepicker'))
                $(this).datetimepicker('hide');
            //PopUp_clickedSaveElement(form); // bluring saves the element automatically
            var nextSelector;
            if (SHIFT_PRESSED)
                nextSelector = POPUP_FORM_PREV['#' + text_id];
            else
                nextSelector = POPUP_FORM_NEXT['#' + text_id];
            if (nextSelector)
                PopUp_clickedElement($(popUp).find(nextSelector)[0]);
        }
    });

    // do entering shortcuts
    $(form).find('input').off('keyup').on('keyup', function(ev){
        var keyCode = ev.keyCode || ev.which;
        if (keyCode == 13) // enter key
        {
            $(this).blur();
            if ($(this).hasClass('withtimepicker') || $(this).hasClass('withdatepicker'))
                $(this).datetimepicker('hide');
            
            //PopUp_clickedSaveElement(form); // bluring saves the element automatically
        }   
    });

    // prevent typing in pickers
    $(form).find('.withtimepicker').on('keydown', function(ev){
        ev.preventDefault();
    });
    $(form).find('.withdatepicker').on('keydown', function(ev){
        ev.preventDefault();
    });
    $(form).find('.withcustompicker').on('keydown', function(ev){
        ev.preventDefault();
    });
}
/**
 * Make sure that the end date for the popup is after the start date
 */
function _PopUp_Form_enforceStartDate(popUp)
{
    var time = $(popUp).find('#popup-time-start').text();
    var startDate = moment('Dec 31, 1899 ' + time);
    $(popUp).find('#popup-time-end-form').find('.withtimepicker').datetimepicker('setStartDate', new Date(startDate.unix() * 1000));
    $(popUp).find('#popup-time-end-form').find('input').not('.withtimepicker').attr('min', startDate.format('HH:mm:ss'));
    var endTime = $(popUp).find('#popup-time-end').text();
    endTime = moment('Dec 31, 1899 ' + endTime);
    if (endTime.unix() <= startDate.unix())
    {
        endTime = moment.unix(startDate.unix());
        endTime.hour(endTime.hour() + 1);
        if (MAIN_TIMEZONE)
            endTime = endTime.tz(MAIN_TIMEZONE);
        PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT['popup-time-end'], endTime.format('h:mm A')); 
    }
}

var POPUP_CAN_BE_EMPTY = {
    'popup-desc': true,
    'popup-loc': true,
}

/**
 * save the popup form for this element
 */
function PopUp_clickedSaveElement(form)
{
    // check if empty and if empty fields are allowed
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (!/\S/.test(_PopUp_Form_getValue(form)) && !(text_id in POPUP_CAN_BE_EMPTY))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    var popUp = _PopUp_getPopUp(form);
    PopUp_markAsNotEditing(popUp);
    // hide the form and unhide the text
    _PopUp_hideFormForElement(form);
    if (text_id == 'popup-title')
    {
        $(popUp).find('.popup-ctrl').removeClass('hidden');
        if (UI_isMain(PopUp_getID(popUp)))
            $(popUp).find('.poup-ctrl-right').addClass('hidden');
    }

    // actual saving
    var text = $(popUp).find("#"+text_id)[0];
    var safe = _PopUp_Form_getValue(form);
    // set the values properly if it's a datetime field
    if ($(form).find('input').length > 0 && $(form).find('input')[0].type == 'date')
    {
        var safeTZ = moment(safe);
        if (MAIN_TIMEZONE)
            safeTZ = safeTZ.tz(MAIN_TIMEZONE);
        safe = safeTZ.format("MMMM D, YYYY");
    }
    else if ($(form).find('input').length > 0 && $(form).find('input')[0].type == 'time')
    {
        var safeTZ = moment('April 25, 2014 ' + safe);
        if (MAIN_TIMEZONE)
            safeTZ = safeTZ.tz(MAIN_TIMEZONE);
        safe = safeTZ.format('h:mm A');
    }
    if ($(text).text() == safe)
        return; // no saving needed
    $(text).text(safe);
    PopUp_markAsUnsaved(popUp);
    PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT[text_id], _PopUp_Form_getValue(form));
    if (text_id == 'popup-time-start' || text_id == 'popup-time-end')
    {
        _PopUp_Form_enforceStartDate(popUp);
    }
}

/**
 * event listener for clicking on close
 */
function PopUp_clickedClose(popUpAnchor)
{
    var popUp = popUpAnchor;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    if (PopUp_isEditing(popUp))
        return;
    // check if there are unsaved changes
    if (EventsMan_hasUncommitted(PopUp_getID(popUp)))
    {
        AS_showActionSheetFromElement($(popUp).find('#close_button')[0], popUp, 'Save changes?',
            [
                {
                    important: false,
                    text: 'Save',
                },
                {
                    important: true,
                    text: 'Don\'t save',
                }
            ],
            function(index){
                if (index == 0) {
                    // save
                    PopUp_clickedSavePopUp(popUp, true);
                }
                else{
                    // don't save
                    PopUp_clickedUndo(popUp);
                    PopUp_clickedClose(popUp);
                }
            }
        );
        return;
    }

    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}

/**
 * event listener for clicking on hide
 */
function PopUp_clickedDelete(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_isEditing(popUp))
        return;
    var event_id = PopUp_getID(popUp);
    var eventDict = EventsMan_getEventByID(event_id);

    // check if this is recurring
    if (eventDict && 'recurrence_days' in eventDict)
    {
        AS_showActionSheetFromElement(popUpAnchor, popUp, "Done with this event? Click to hide from your agenda and calendar.", [ 
                {important: false, text:'Only this event'},
                {important: true, text:'All future events'}
            ], function(index){
            if (index == 0)
            {
                // only this event
                EventsMan_deleteEvent(event_id);
                if (!EventsMan_eventShouldBeShown(event_id))
                    PopUp_close(popUp);
            }
            else 
            {
                // all future events
                EventsMan_deleteAllFutureEvents(event_id);
                if (!EventsMan_eventShouldBeShown(event_id))
                    PopUp_close(popUp);
            }
        });
        return;
    }
    EventsMan_deleteEvent(event_id);
    if (!EventsMan_eventShouldBeShown(event_id))
        PopUp_close(popUp);
}
/**
 * event listener for clicking on unhide
 */
function PopUp_clickedUnhide(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_isEditing(popUp))
        return;
    var event_id = PopUp_getID(popUp);
    var eventDict = EventsMan_getEventByID(event_id);
    // check if recurring
    if ('recurrence_days' in eventDict)
    {
        AS_showActionSheetFromElement(popUpAnchor, popUp, 'Unhide these events?', [
                {important: false, text:'Only this event'},
                {important: true, text:'All future events'}
            ], function(index){
            if (index == 0)
            {
                // only this event
                EventsMan_unhideEvent(event_id);
            }
            else 
            {
                // all future events
                EventsMan_unhideAllFutureEvents(event_id);
            }
        });
        return;
    }
    EventsMan_unhideEvent(event_id);
}
/**
 * event listener for clicking on save
 */
function PopUp_clickedSavePopUp(anchor, shouldClose)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    shouldClose = shouldClose || false;
    var id = PopUp_getID(popUp);
    if (SE_hasSimilarEvents(id))
    {
        AS_showActionSheetFromElement($(popUp).find('#save_button')[0], popUp,
            'There seems to be a similar event already on the calendar',
            [
                {
                    important: false,
                    text: 'Show similar events',
                },
                {
                    important: true,
                    text: 'Save anyways',
                },
            ], function(index){
                if (index == 0)
                {
                    NO_showSimilarEvents(PopUp_getID(popUp));
                }
                else
                {
                    NO_removeSimilarEventsNotification(PopUp_getID(popUp));
                    PopUp_clickedSavePopUp(popUp);
                }
            }
        );
        return;
    }
    var eventDict = EventsMan_getEventByID(id);
    var uncommitted = EventsMan_getUncommitted(id);
    if (eventDict // new events won't have eventDict, in which case we don't ask
        && 'recurrence_days' in eventDict 
        && 'recurrence_days' in uncommitted)
    {
        // check whether recurrence pattern was modified. If it was, don't ask
        if (eventDict.recurrence_days.equals(uncommitted.recurrence_days)
                && eventDict.recurrence_interval == uncommitted.recurrence_interval)
        {
            AS_showActionSheetFromElement($(popUp).find('#save_button')[0], popUp,
                'This event is part of a recurring event.',
                [
                    {
                        important: false,
                        text: 'Only this event',
                    },
                    {
                        important: true,
                        text: 'All future events',
                    }
                ], function(index){
                    PopUp_markAsSaved(popUp);
                    $(popUp).find('.unsaved').removeClass('unsaved');
                    if (index == 0)
                    {
                        EventsMan_commitChanges(id);
                    }
                    else 
                    {
                        // TODO save changes to recurring events
                        EventsMan_commitChangesToAllFutureEvents(id);
                    }
                    if (shouldClose)
                        PopUp_clickedClose(popUp);
                }
            );
            return;
        }
    }
    PopUp_markAsSaved(popUp);
    $(popUp).find('.unsaved').removeClass('unsaved');
    EventsMan_commitChanges(id);
    if (shouldClose)
        PopUp_clickedClose(popUp);
}

/**
 * event listener for clicking on undo - doesn't exist anymore, but
 * function is still used
 */
function PopUp_clickedUndo(anchor)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    var id = PopUp_getID(popUp);
    $(popUp).find('#save_button').addClass('hide');
    $(popUp).find('#undo_button').addClass('hide');
    $(popUp).find('.unsaved').removeClass('unsaved');
    EventsMan_cancelChanges(id);
}
