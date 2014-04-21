POPUP_CLASS = 'popup-event';
function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;

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

    EventsMan_addOnReadyListener(function(){
        PopUp_load();
    });

    SR_addWillSaveListener(function (){
        PopUp_save();
    })
    EventsMan_addEventIDsChangeListener(function(oldID, newID){
        PopUp_map(function(popUp, isMain){
            if (PopUp_getID(popUp) == oldID)
                PopUp_setID(popUp, newID);
        });
    });
    EventsMan_addUpdateListener(function(){
        PopUp_map(function(popUp, isMain){
            if (EventsMan_hasEvent(PopUp_getID(popUp)))
                PopUp_setToEventID(popUp, PopUp_getID(popUp));
            else
                PopUp_close(popUp);
        });
    });
}

/***************************************************
 * Creating/removing
 **************************************************/

function PopUp_initialize(popUp)
{
    $(popUp).find(".withdatepicker").datetimepicker({
        format: "MM d, yyyy",
        autoclose: true,
        minView: 2,
        maxView: 3
    });
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
        minuteStep: 10
    });
    var htmlcontent = CacheMan_load("type-picker")
    $(popUp).find(".withtypepicker").popover({
        placement: "left auto",
        trigger: "focus",
        html: true,
        content: htmlcontent,
        container: 'body'
    })
    var input = $(popUp).find(".withtypepicker")[0];
    $(input).on("shown.bs.popover", function(){
        var tp = $("#type-picker123")[0];
        tp.id = "";
        this.tp = tp;
        var type = $(this).val();
        TP_select(this.tp, type);
        var inputField = this;
        TP_setSelectListener(function(tp, selectedType){
            $(inputField).val(selectedType);
        });
    });

    $(popUp).find('.withsectionpicker').popover({
        placement: 'left auto',
        trigger: 'focus', 
        html: true,
        content: CacheMan_load('section-picker'),
        container: 'body'
    }).on('shown.bs.popover', function(){
        var sp = $('#section-picker123')[0];
        sp.id = '';
        this.sp = sp;
        var section = $(this).val();
        SP_select(this.sp, section);
        var inputField = this;
        SP_setSelectListener(function(sp, selectedSection){
            $(inputField).val(selectedSection);
        });
    });
    $(popUp).find('#close_button').popover({
        title: 'Save changes?',
        //container: 'body',
        placement: 'bottom auto',
        html: true,
        content: '<a id="yes_button" class="white-link-btn prompt-btn yes">Yes</a><a id="no_button" class="white-link-btn prompt-btn no">No</a>',
        trigger: 'manual'
    });
    $(popUp).find('#close_button').on('shown.bs.popover', function(ev){
        $('#no_button').on('click', function(ev){
            ev.preventDefault();
            $(popUp).find('#close_button').popover('toggle');
            PopUp_clickedUndo(popUp);
            PopUp_clickedClose(popUp);
        });
        $('#yes_button').on('click', function(ev){
            ev.preventDefault();
            $(popUp).find('#close_button').popover('toggle');
            PopUp_clickedSavePopUp(popUp);
            PopUp_clickedClose(popUp);
        });  
    });
    $(popUp).find('#save_button').popover({
        title: 'There seems to be a similar event already on the calendar',
        placement: 'bottom',
        html: true,
        content: '<a id="show_similar_events_button" class="white-link-btn prompt-btn yes">Show events</a><a id="save_anyways_button" class="white-link-btn prompt-btn no">Save anyways</a>',
        trigger: 'manual'
    }).on('shown.bs.popover', function(ev){
        $('#show_similar_events_button').on('click', function(ev){
            NO_showSimilarEvents(PopUp_getID(popUp));
            $(popUp).find('#save_button').popover('toggle');
        });
        $('#save_anyways_button').on('click', function(ev){
            NO_removeSimilarEventsNotification(PopUp_getID(popUp));
            PopUp_clickedSavePopUp(popUp);
            $(popUp).find('#save_button').popover('toggle');
        });
    });
}

/***************************************************
 * Getters and Setters
 **************************************************/

function PopUp_setToEventID(popUp, id)
{
    PopUp_setID(popUp, id);
    var eventDict;
    $(popUp).find('.unsaved').removeClass('unsaved');
    if (EventsMan_hasUncommitted(id))
    {
        eventDict = EventsMan_getUncommitted(id);
        PopUp_markAsUnsaved(popUp);
        // TODO find out what is the unsaved changes
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
}


function PopUp_setTitle(popUp, title)
{
    popUp.querySelector(".popup-title").innerHTML = title;
}
function PopUp_setDescription(popUp, desc)
{
    $(popUp).find("#popup-desc").html(nl2br(desc));
}
function PopUp_setLocation(popUp, loc)
{
    $(popUp).find('#popup-loc').text(loc);
}
function PopUp_setSection(popUp, sectionKey)
{
    $(popUp).find('#popup-section').text(SP_keyToText(sectionKey));
}
function PopUp_setType(popUp, typeKey)
{
    var type = toTitleCase(TP_keyToText(typeKey));
    $(popUp).find('#popup-type').text(type);
}
function PopUp_setDate(popUp, unixTime)
{
    var date = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-date').text(date.format("MMMM D, YYYY"));
}
function PopUp_setStartTime(popUp, unixTime)
{
    var time = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-start').text(time.format("h:mm A"));
}
function PopUp_setEndTime(popUp, unixTime)
{
    var time = moment.unix(unixTime).tz(MAIN_TIMEZONE);
    $(popUp).find('#popup-time-end').text(time.format("h:mm A"));
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

/***************************************************
 * forms for editing
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
        $(form).find("input").val(newValue);
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
        $(form).find(".withdatepicker").datetimepicker().on("hide", listener);
    else if ($(form).find(".withtimepicker").length > 0)
        $(form).find(".withtimepicker").datetimepicker().on("hide", listener);
    else if ($(form).find(".withcustompicker").length > 0)
        $(form).find(".withcustompicker").on("hidden.bs.popover", listener); // must be hidden, not hide, otherwise timing doesn't work out
    else if ($(form).find("input").length > 0)
        $(form).find("input").on("blur", listener);
    else if ($(form).find("textarea").length > 0)
        $(form).find("textarea").on("blur", listener);
}

/***************************************************
 * Click Event Listeners
 **************************************************/

function PopUp_clickedElement(element)
{
    //return;
    var popUp = _PopUp_getPopUp(element);
    if (PopUp_isEditing(popUp))
        return;
    PopUp_markAsEditing(popUp);
    var form_id = _PopUp_Form_getFormIDForElement(element);
    var form = $(popUp).find("#"+form_id)[0];
    // make the corresponding form visible and hide the element
    if ($(form).find("textarea").length > 0)
    {
        height = parseInt($(element).css("height")) + 20;
        $(form).find("textarea").css("height", height + "px");
    }
    _PopUp_showFormForElement(element);
    _PopUp_Form_setValue(form, element.innerHTML);
    _PopUp_Form_giveFocus(form);
    if (!$(form).hasClass("input-group") && form.notFirstSelected != true)
    {
        form.notFirstSelected = true;
        _PopUp_Form_addOnBlurListener(form, function(){
            PopUp_clickedSaveElement(form);
        });
        if ($(form).find("input").hasClass("withtypepicker"))
        {
            $(form).find("input").on("change keyup paste", function(){
                var tp = $(form).find("input")[0].tp;
                TP_select(tp, $(form).find("input").val());
            });
        }
        if ($(form).find('input').hasClass('withsectionpicker'))
        {
            $(form).find('input').on('change keyup paste', function(){
                var sp = $(form).find('input')[0].sp;
                SP_select(sp, $(form).find('input').val());
            });
        }
    }
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (text_id == 'popup-title')
    {
        $(popUp).find('.popup-ctrl').addClass('hidden');
    }
    //$(form).find("input").data("datetimepicker");
    //$(form).find("input").datetimepicker();
}
function PopUp_clickedSaveElement(form)
{
    if (!/\S/.test(_PopUp_Form_getValue(form)))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    if ($(form).find("input").hasClass("withtypepicker") && !TP_validateType(_PopUp_Form_getValue(form)))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    if ($(form).find('input').hasClass('withsectionpicker') && !SP_validateSection(_PopUp_Form_getValue(form)))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    var popUp = _PopUp_getPopUp(form);
    PopUp_markAsNotEditing(popUp);
    // hide the form and unhide the text
    _PopUp_hideFormForElement(form);
    var text_id = _PopUp_Form_getElementIDForForm(form);
    if (text_id == 'popup-title')
    {
        $(popUp).find('.popup-ctrl').removeClass('hidden');
        if (UI_isMain(PopUp_getID(popUp)))
            $(popUp).find('.poup-ctrl-right').addClass('hidden');
    }

    //actual saving
    var text = $(popUp).find("#"+text_id)[0];
    if ($(text).html() == nl2br(_PopUp_Form_getValue(form)))
        return; // no saving needed
    var safe = _PopUp_Form_getValue(form).escapeHTML();
    $(text).html(nl2br(safe));
    PopUp_markAsUnsaved(popUp);
    PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT[text_id], _PopUp_Form_getValue(form));
}
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
        $(popUpAnchor).popover('toggle');
        return;
    }

    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}
function PopUp_clickedDelete(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_isEditing(popUp))
        return;
    var event_id = PopUp_getID(popUp);
    PopUp_close(popUp);
    EventsMan_deleteEvent(event_id);
}
function PopUp_clickedSavePopUp(anchor)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    var id = PopUp_getID(popUp);
    if (NO_hasSimilarEvents(id))
    {
        $(anchor).popover('toggle');
        return;
    }
    PopUp_markAsSaved(popUp);
    EventsMan_commitChanges(id);
    $(popUp).find('.unsaved').removeClass('unsaved');
}
function PopUp_clickedUndo(anchor)
{
    var popUp = _PopUp_getPopUp(anchor);
    if (PopUp_isEditing(popUp))
        return;
    var id = PopUp_getID(popUp);
    $(popUp).find('#save_button').addClass('hide');
    $(popUp).find('#undo_button').addClass('hide');
    EventsMan_cancelChanges(id);
    $(popUp).find('.unsaved').removeClass('unsaved');
}
