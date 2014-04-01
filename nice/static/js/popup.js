// POPUP module
var PopUp_closeListeners = [];
var PopUp_freedSpace = [];
var PopUp_space = 0;

function PopUp_getMainPopUp(firstDrag)
{
    var main = $("#popup-main");
    if (main.length > 0)
    {
        main = $("#popup-main")[0];
        main.firstDrag = firstDrag;
    }
    else
        main = PopUp_insertPopUp(firstDrag, true);
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

function PopUp_insertPopUp(firstDrag, isMain)
{
    $("body").append('<div id="popup-main123" class="popup-container popup"><div class="panel panel-default panel-clipped"><div class="panel-heading panel-heading-handle"><h3 class="panel-title"><span class="popup-title">title</span><a href="" onclick="PopUp_clickedClose(this); return false;" class="popup-ctrl hide"><span class="glyphicon glyphicon-remove"></span></a></h3></div><div class="panel-body panel-body-scroll"><p>The content of the selected agenda will go here. This popup by default will change according to which agenda is selected. However, if the user drags this popup, it will stay forever.</p><p>The content of the selected agenda will go here. This popup by default will change according to which agenda is selected. However, if the user drags this popup, it will stay forever.</p><p>The content of the selected agenda will go here. This popup by default will change according to which agenda is selected. However, if the user drags this popup, it will stay forever.</p></div></div></div>');
    var popUp = $("#popup-main123");
    popUp.draggable({handle:'.panel > .panel-heading', containment:".tab-content", scroll: false}).find(".panel").resizable({
        stop: function(e, ui){
            $(this).parent().css("height", $(this).css("height"));
            $(this).parent().css("width", $(this).css("width")); 
            _PopUp_setBodyHeight(this);
        }
    });
    popUp = popUp[0];
    $(popUp).css("height", $(popUp).find(".panel").css("height"));
    popUp.firstDrag = firstDrag;
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
    $(popUp).find(".hide").removeClass("hide");
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
