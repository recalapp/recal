// POPUP module
var PopUp_closeListeners = [];
var PopUp_freedSpace = [];
var PopUp_space = 0;
var POPUP_INIT = false;

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
    PopUp_load();
    $(window).bind("beforeunload", function() {
        PopUp_save();
    });
}

function PopUp_getMainPopUp()
{
    var main = $("#popup-main");
    if (main.length > 0)
    {
        main = $("#popup-main")[0];
        //main.firstDrag = firstDrag;
    }
    else
        main = PopUp_insertPopUp(true);
    return main;
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

function PopUp_setFirstDrag(popUp, firstDrag)
{
    popUp.firstDrag = firstDrag;
}

function PopUp_insertPopUp(isMain)
{
    $("body").append('<div id="popup-main123" class="popup-container popup"><div class="panel panel-default panel-clipped"><div class="panel-heading panel-heading-handle"><h3 class="panel-title"><span class="popup-title">title</span><a href="#" onclick="PopUp_clickedClose(this); return false;" class="popup-ctrl hide"><span class="glyphicon glyphicon-remove"></span></a></h3></div><div class="panel-body panel-body-scroll"><h4 id="popup-date" onclick="PopUp_clickedElement(this)">April 11, 2014 at 11:00AM</h4><div class="input-group hide" id="popup-date-form"><input type="text" class="form-control"><span class="input-group-btn"><button class="btn btn-success" type="button" onclick="PopUp_clickedSaveElement($(this).parent().parent()[0])"><span class="glyphicon glyphicon-ok"></span></button><button class="btn btn-danger" type="button" onclick="PopUp_clickedCancelElement($(this).parent().parent()[0])"><span class="glyphicon glyphicon-remove" ></span></button></span></div><h4 id="popup-loc" onclick="PopUp_clickedElement(this)">CS Building</h4><div class=" hide" id="popup-loc-form"><input type="text" class="form-control"></div><p id="popup-type">Assignment</p><p id="popup-desc">The content of the selected agenda will go here. This popup by default will change according to which agenda is selected. However, if the user drags this popup, it will stay forever. <br>The content of the selected agenda will go here. This popup by default will change according to which agenda is selected. However, if the user drags this popup, it will stay forever.</p></div></div></div>');
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
    return popUp;
}

function PopUp_showClose(popUp)
{
    $(popUp).find(".popup-ctrl").removeClass("hide");
}

function PopUp_close(popUp)
{
    $(popUp).remove();
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

function PopUp_map(apply)
{
    $(".popup").not("#popup-main").each(function(index) {
        apply(this, false);
    });
    $("#popup-main").each(function(index) {
        apply(this, true);
    });
}

function PopUp_addCloseListener(listener)
{
    PopUp_closeListeners.push(listener);
}

function PopUp_clickedClose(popUpAnchor)
{
    popUp = popUpAnchor;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    $(PopUp_closeListeners).each(function(index) {
        this(PopUp_getID(popUp));
    });
    PopUp_close(popUp);
}
function _PopUp_setBodyHeight(popUp)
{
    headHeight = $(popUp).find(".panel-heading").css("height");
    height = $(popUp).css("height");
    $(popUp).find(".panel-body").css("height", (parseInt(height) - parseInt(headHeight)) + "px");
}
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
        PopUp_setID(popUp, this.id);
        PopUp_setTitle(popUp, "Item "+this.id);
        if (this.hasFocus)
            PopUp_giveFocus(popUp);
    });
}
function PopUp_hasFocus(popUp)
{
    return $(popUp).find(".panel").hasClass("panel-primary");
}
function PopUp_showFormForElement(element)
{
    var popUp = _PopUp_getPopUp(element);
    $(element).addClass("hide");
    var form_id = element.id + "-form";
    var form = $(popUp).find("#" + form_id).removeClass("hide")[0];
    return form_id;
}
function PopUp_hideFormForElement(form)
{
    var popUp = _PopUp_getPopUp(form);
    $(form).addClass("hide");
    var text_id = form.id.split("-").slice(0, -1).join("-");
    $(popUp).find("#"+text_id).removeClass("hide");
    return text_id;
}
function PopUp_clickedElement(element)
{
    var popUp = _PopUp_getPopUp(element);
    // make the corresponding form visible and hide the element
    var form_id = PopUp_showFormForElement(element);
    var form = $(popUp).find("#"+form_id)[0];
    $(form).find("input")[0].value = element.innerHTML;
    $(form).find("input")[0].focus();
    if (!$(form).hasClass("input-group"))
    {
        $(form).find("input").bind("blur", function(){
            PopUp_clickedSaveElement(form);
        });
    }
}

// MUST CHECK FOR EMPTY FIELD
function PopUp_clickedSaveElement(form)
{
    var popUp = _PopUp_getPopUp(form);
    // hide the form and unhide the text
    var text_id = PopUp_hideFormForElement(form);
    $(popUp).find("#"+text_id)[0].innerHTML = $(form).find("input")[0].value;
}
function PopUp_clickedCancelElement(form)
{
    var popUp = _PopUp_getPopUp(form);
    // hide the form and unhide the text
    PopUp_hideFormForElement(form);
}
function _PopUp_getPopUp(child)
{
    var popUp = child;
    while (!$(popUp).hasClass("popup"))
        popUp = $(popUp).parent()[0];
    return popUp;
}
