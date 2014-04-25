// REQUIRES UI module - isMain, isPinned, etc.
// REQUIRES SB module
var POPUP_CLASS = 'popup';
var POPUP_URL = 'popup-template';
var PopUp_closeListeners = [];
var PopUp_editListeners = [];
var PopUp_freedSpace = [];
var PopUp_space = 0;
var POPUP_INIT = false;
var POPUP_EDITDICT = {
    "popup-loc": "event_location",
    "popup-title": "event_title",
    "popup-date": "event_date",
    'popup-time-start': 'event_start',
    'popup-time-end': 'event_end',
    "popup-type": "event_type",
    "popup-section": "section_id",
    "popup-desc": "event_description"
}
var PopUp_Main_optFirstDrag = function(popUp){};
var POPUP_MAIN_FIRSTDRAG = function(popUp){
    if (PopUp_isMain(popUp))
    {
        popUp.id = "";
        //PopUp_showClose(popUp);
        PopUp_Main_optFirstDrag(popUp);
        UI_pin(PopUp_getID(popUp));
        UI_unsetMain();
        var rect = popUp.getBoundingClientRect();
        $(popUp).css({
            height: rect.height + 'px',
            width: rect.width + 'px',
        });
        $(popUp).appendTo('body');
        $(popUp).css({
            //position: 'fixed',
            top: rect.top,
            left: rect.left,
        });
        PopUp_makeResizable(popUp);
        SB_hide();
    }
};

/***************************************************
 * Creating/removing
 **************************************************/

function PopUp_insertPopUp(isMain)
{
    var popUpHTML = CacheMan_load(POPUP_URL);
    if (isMain)
        SB_push(popUpHTML);
    else
        $("body").append(popUpHTML);
    var popUp = $("#popup-main123");
    var firstDragStart = function(){
        POPUP_MAIN_FIRSTDRAG(popUp);
        if (popUp.space)
            PopUp_freedSpace.push(popUp.space);
        //if (isMain)
        //{
        //            }
        //else
        //{
        //    PopUp_freedSpace.push(popUp.space);
        //    delete popUp.space;
        //}
    };
   

    popUp.draggable({
        handle:'.panel > .panel-heading', 
        containment:"#content_bounds", 
        scroll: false, 
        appendTo: 'body',
        beforeStart: function(ev, ui){
            firstDragStart();
        }, 
        zIndex: 2000,
    })
    popUp = popUp[0];
    //$(popUp).css("height", $(popUp).find(".panel").css("height"));
    popUp.id = "popup-main";
    if (!isMain)
    {
        var space;
        if (PopUp_freedSpace.length == 0)
            space = ++PopUp_space;
        else
            space = PopUp_freedSpace.sort(function(a,b){return b-a}).pop();
        popUp.id = "";
        PopUp_makeResizable(popUp);
        //$(popUp).css({
        //    position: 'fixed',
        //});
        
        //PopUp_showClose(popUp);
        leftPos = parseInt($(popUp).css("left"));
        topPos = parseInt($(popUp).css("top"));
        $(popUp).css("left", (leftPos + 20*space) + "px").css("top", (topPos + 20*space) + "px");
        popUp.space = space;
    }
    popUp.onmousedown = function(){
        PopUp_giveFocus(this);
    };
    maxHeight = window.innerHeight - $(".navbar").height() - 100;
    $(popUp).css("max-height", maxHeight+"px");
    _PopUp_setBodyHeight(popUp); 
    PopUp_initialize(popUp);
    setTimeout(function(){
        PopUp_initialize_deferred(popUp);
    }, 300) // doesn't block
    return popUp;
}

function PopUp_initialize(popUp){};
function PopUp_initialize_deferred(popUp){};

function PopUp_close(popUp)
{
    if (UI_isMain(PopUp_getID(popUp)))
    {
        UI_unsetMain();
        SB_pop(popUp);
    }
    else
    {
        UI_unpin(PopUp_getID(popUp));
        $(popUp).remove();
    }
    SB_hideIfEmpty();
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
function PopUp_getPopUpByID(id)
{
    return $('.' + POPUP_CLASS).find("#"+id).parent()[0];
}
function PopUp_getID(popUp)
{
    return $(popUp).find(".panel")[0].id;
}
function PopUp_setID(popUp, id)
{
    var oldId = $(popUp).find(".panel")[0].id;
    $(popUp).find(".panel")[0].id = id;
    if (popUp.id == 'popup-main')
    {
        UI_setMain(id)
    }
    else 
    {
        UI_unpin(oldId);
        UI_pin(id)
    }
}
function _PopUp_setBodyHeight(popUp)
{
    var headHeight = $(popUp).find(".panel-heading").css("height");
    var height = $(popUp).css("height");
    $(popUp).find(".panel-body").css("height", (parseInt(height) - parseInt(headHeight)) + "px");
}
/***************************************************
 * Appearance
 **************************************************/

function PopUp_giveFocus(popUp)
{
    $('.' + POPUP_CLASS).not(popUp).css("z-index", "100").find(".panel").addClass("panel-default").removeClass("panel-primary");
    $(popUp).css("z-index", "200");
    $(popUp).find(".panel").addClass("panel-primary").removeClass("panel-default");
    if (UI_isMain(PopUp_getID(popUp)))
        SB_show();
}
function PopUp_giveFocusToID(id)
{
    popUp = $('.'+POPUP_CLASS).find("#"+id).parent();
    PopUp_giveFocus(popUp);
}
function PopUp_hasFocus(popUp)
{
    return $(popUp).find(".panel").hasClass("panel-primary");
}
function PopUp_updateSize(popUp)
{
    $(popUp).find('.panel').css({
        width: $(popUp).css('width'),
        height: $(popUp).css('height'),
    });
    _PopUp_setBodyHeight(popUp);
}
function PopUp_isMain(popUp)
{
    return popUp.id == 'popup-main';
}
function PopUp_makeMain(popUp)
{
    popUp.id = 'popup-main';
    var id = PopUp_getID(popUp);
    if (UI_isPinned(id))
        UI_unpin(id);
    UI_setMain(id);
    $(popUp).find('.panel').resizable('destroy');
}
function PopUp_hasMain(popUp)
{
    return $("#popup-main").length > 0;
}
function PopUp_makeResizable(popUp)
{
    $(popUp).find(".panel").resizable({
        stop: function(e, ui){
            $(this).parent().css("height", $(this).css("height"));
            $(this).parent().css("width", $(this).css("width")); 
            _PopUp_setBodyHeight(this);
        },
    });
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
    $('.' + POPUP_CLASS).not("#popup-main").each(function(index) {
        apply(this, false);
    });
    $("#popup-main").each(function(index) {
        apply(this, true);
    });
}
