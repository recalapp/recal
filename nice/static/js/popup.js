// POPUP module
// TODO br2nl on description form
var PopUp_closeListeners = [];
var PopUp_editListeners = [];
var PopUp_onRestoreListeners = [];
var PopUp_freedSpace = [];
var PopUp_space = 0;
var POPUP_INIT = false;
var POPUP_EDITDICT = {
    "popup-loc": "location",
    "popup-title": "title",
    "popup-date": "date",
    "popup-type": "type",
    "popup-desc": "description"
}


function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;

    // setting bounds
    topPos = parseInt($(".navbar").css("height")) + parseInt($(".navbar").css("margin-top"));
    height = window.innerHeight - topPos + 300;
    $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");

    // saving/loading
    // TODO figure out this logic, it's wrong
    // doesn't handle the case where reload happens
    EventsMan_addOnReadyListener(function(){
        PopUp_load();
    });
    $(window).on("beforeunload", function() {
        PopUp_save();
        //$(".withdatepicker").data("DateTimePicker").hide();
    });
}

/***************************************************
 * Creating/removing
 **************************************************/

function PopUp_insertPopUp(isMain)
{
    var popUpHTML = CacheMan_load("popup-template");
    $("body").append(popUpHTML);
    var popUp = $("#popup-main123");
    popUp.draggable({handle:'.panel > .panel-heading', containment:"#content_bounds", scroll: false}).find(".panel").resizable({
        stop: function(e, ui){
            $(this).parent().css("height", $(this).css("height"));
            $(this).parent().css("width", $(this).css("width")); 
            _PopUp_setBodyHeight(this);
        }
    });
    popUp = popUp[0];
    $(popUp).css("height", $(popUp).find(".panel").css("height"));
    popUp.id = "popup-main";
    if (isMain)
    {
        popUp.ondrag = function(){
            popUp.id = "";
            PopUp_showClose(popUp);
            if (this.firstDrag)
                this.firstDrag();
            this.ondrag = null;
        };
    }
    else
    {
        var space;
        if (PopUp_freedSpace.length == 0)
            space = ++PopUp_space;
        else
            space = PopUp_freedSpace.sort(function(a,b){return b-a}).pop();
        popUp.id = "";
        PopUp_showClose(popUp);
        leftPos = parseInt($(popUp).css("left"));
        topPos = parseInt($(popUp).css("top"));
        $(popUp).css("left", (leftPos + 20*space) + "px").css("top", (topPos + 20*space) + "px");
        popUp.space = space;
        popUp.ondrag = function() {
            PopUp_freedSpace.push(popUp.space);
            delete popUp.space;
            this.ondrag = null;
        }
    }
    popUp.onmousedown = function(){
        PopUp_giveFocus(this);
    };
    maxHeight = window.innerHeight - $(".navbar").height() - 100;
    $(popUp).css("max-height", maxHeight+"px");
    _PopUp_setBodyHeight(popUp);

    $(popUp).find(".withdatepicker").datetimepicker({
        format: "M d, yyyy",
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
    $(popUp).find(".withcustompicker").popover({
        placement: "left",
        trigger: "focus",
        html: true,
        content: htmlcontent,
        container: 'body'
    })
    var input = $(popUp).find(".withcustompicker")[0];
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
    return popUp;
}

function PopUp_close(popUp)
{
    $(popUp).remove();
}

/***************************************************
 * Getters and Setters
 **************************************************/

function PopUp_getMainPopUp()
{
    var main = $("#popup-main");
    if (main.length > 0)
    {
        main = $("#popup-main")[0];
    }
    else
        main = PopUp_insertPopUp(true);
    return main;
}

function PopUp_setToEventID(popUp, id)
{
    PopUp_setID(popUp, id);
    eventDict = EventsMan_getEventByID(id);
    if (!eventDict)
    {
        console.log("errorneous event id");
        return;
    }
    PopUp_setTitle(popUp, eventDict.event_title);
    PopUp_setDescription(popUp, eventDict.event_description);
    PopUp_setLocation(popUp, eventDict.event_location);
    PopUp_setType(popUp, eventDict.event_type);
    PopUp_setDate(popUp, eventDict.event_start);
    PopUp_setStartTime(popUp, eventDict.event_start);
    PopUp_setEndTime(popUp, eventDict.event_end);
}

function PopUp_getID(popUp)
{
    return $(popUp).find(".panel")[0].id;
}

function PopUp_setID(popUp, id)
{
    $(popUp).find(".panel")[0].id = id;
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
function PopUp_setType(popUp, typeKey)
{
    var type = toTitleCase(TP_keyToText(typeKey));
    $(popUp).find('#popup-type').text(type);
}
function PopUp_setDate(popUp, unixTime)
{
    var date = moment.unix(unixTime);
    $(popUp).find('#popup-date').text(date.format("MMMM D, YYYY Z"));
}
function PopUp_setStartTime(popUp, unixTime)
{
    var time = moment.unix(unixTime);
    $(popUp).find('#popup-time-start').text(time.format("H:mm A"));
}
function PopUp_setEndTime(popUp, unixTime)
{
    var time = moment.unix(unixTime);
    $(popUp).find('#popup-time-end').text(time.format("H:mm A"));
}


function PopUp_setFirstDrag(popUp, firstDrag)
{
    popUp.firstDrag = firstDrag;
}

function _PopUp_setBodyHeight(popUp)
{
    headHeight = $(popUp).find(".panel-heading").css("height");
    height = $(popUp).css("height");
    $(popUp).find(".panel-body").css("height", (parseInt(height) - parseInt(headHeight)) + "px");
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
    $.cookie("popup_pos", data);
}
function PopUp_load()
{
    return;
    if ($.cookie("popup_pos") == null)
        return;
    var pos = JSON.parse($.cookie("popup_pos"));
    $(pos).each(function(index) {
        popUp = PopUp_insertPopUp(this.isMain);
        $(popUp).css("left", this.frame[0]);
        $(popUp).css("top", this.frame[1]);
        $(popUp).css("width", this.frame[2]);
        $(popUp).css("height", this.frame[3]);
        _PopUp_setBodyHeight(popUp);
        PopUp_setToEventID(popUp, this.id);
        //PopUp_setID(popUp, this.id);
        //PopUp_setTitle(popUp, "Item "+this.id);
        if (this.hasFocus)
            PopUp_giveFocus(popUp);
    });
    PopUp_callOnRestoreListeners();
}

/***************************************************
 * Appearance
 **************************************************/

function PopUp_showClose(popUp)
{
    $(popUp).find(".popup-ctrl").removeClass("hide");
}

function PopUp_giveFocus(popUp)
{
    $(".popup").not(popUp).css("z-index", "100").find(".panel").addClass("panel-default").removeClass("panel-primary");
    $(popUp).css("z-index", "200");
    $(popUp).find(".panel").addClass("panel-primary").removeClass("panel-default")
}
function PopUp_giveFocusToID(id)
{
    popUp = $(".popup").find("#"+id).parent();
    PopUp_giveFocus(popUp);
}
function PopUp_hasFocus(popUp)
{
    return $(popUp).find(".panel").hasClass("panel-primary");
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
    var popUp = _PopUp_getPopUp(element);
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
        if ($(form).find("input").hasClass("withcustompicker"))
        {
            $(form).find("input").on("change keyup paste", function(){
                var tp = $(form).find("input")[0].tp;
                TP_select(tp, $(form).find("input").val());
            });
        }
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
    if ($(form).find("input").hasClass("withcustompicker") && !TP_validateType(_PopUp_Form_getValue(form)))
    {
        _PopUp_Form_giveFocus(form);
        return;
    }
    var popUp = _PopUp_getPopUp(form);
    // hide the form and unhide the text
    _PopUp_hideFormForElement(form);
    var text_id = _PopUp_Form_getElementIDForForm(form);
    $(popUp).find("#"+text_id).html(nl2br(_PopUp_Form_getValue(form)));
    PopUp_callEditListeners(PopUp_getID(popUp), POPUP_EDITDICT[text_id], _PopUp_Form_getValue(form)); 
}
function PopUp_clickedClose(popUpAnchor)
{
    popUp = popUpAnchor;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}

/***************************************************
 * Event Listeners from clients
 **************************************************/

function PopUp_addCloseListener(listener)
{
    PopUp_closeListeners.push(listener);
}
function PopUp_addEditListener(listener)
{
    PopUp_editListeners.push(listener);
}
function PopUp_callCloseListeners(id)
{
    $(PopUp_closeListeners).each(function(index) {
        this(id);
    });
}
function PopUp_callEditListeners(id, field, value)
{
    $(PopUp_editListeners).each(function(index) {
        this(id, field, value);
    });
}
function PopUp_addOnRestoreListener(listener)
{
    PopUp_onRestoreListeners.push(listener);
}
function PopUp_callOnRestoreListeners(listener)
{
    $.each(PopUp_onRestoreListeners, function(index){
        this();
    });
}

/***************************************************
 * Miscellaneous
 **************************************************/

function _PopUp_getPopUp(child)
{
    var popUp = child;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    return popUp;
}
function PopUp_map(apply)
{
    $(".popup").not("#popup-main").each(function(index) {
        apply(this, false);
    });
    $("#popup-main").each(function(index) {
        apply(this, true);
    });
}

