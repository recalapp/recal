var SB_willCloseListeners = [];


function SB_init()
{
    $('#sidebar').droppable({
        drop: function(ev, ui) {
            if (PopUp_hasMain())
            {
                var main = PopUp_getMainPopUp();
                PopUp_callCloseListeners(PopUp_getID(main));
                $(main).remove();
            }
            var popUp = ui.draggable[0];
            $(popUp).detach().appendTo('#sb-left-container').css({
                //position: 'relative',
                width: '100%',
                height: '350px',
                left: 'auto',
                top: 'auto',
            });
            $(popUp).addClass('sb-left-content');
            $(popUp).addClass('in');
            PopUp_updateSize(popUp);
            PopUp_makeMain(popUp);
        },
        hoverClass: 'hover-active'
    });
    $('#sidebar-target').droppable({
        over: function(ev, ui){
            SB_show();
        },
        out: function(ev, ui){
            if (SB_isEmpty())
                SB_hide();
        },
    });
}
function SB_isEmpty()
{
    return $('#sidebar').find('.in').length == 0;
}
function SB_show()
{
    $('#sidebar').addClass('in');
    $('#sb-handle').find('.glyphicon').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
}
function SB_hide()
{
    SB_callWillCloseListeners();
    SB_unfill();
    $('#sidebar').removeClass('in');
    $('#sb-handle').find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');

}
function SB_hideIfEmpty()
{
    if (SB_isEmpty())
        SB_hide();
}
function SB_isShown()
{
    return $('#sidebar').hasClass('in');
}
function SB_push(content)
{
    content = $(content).addClass('sb-left-content')[0];
    $('#sb-left-container').append(content);
    if (!SB_isShown())
        SB_show();
    setTimeout("$('#sb-left-container').find('.sb-left-content').addClass('in')", 10);
}
function SB_pop(content)
{
    $(content).removeClass('in').on('transitionend', function(){
        $(content).remove();
        //SB_hideIfEmpty();
    });
}
function SB_setMainContent(content)
{
    content = $(content).addClass('sb-full-content')[0];
    $('#sb-full-container').append(content);
    setTimeout("$('#sb-full-container').find('.sb-full-content').addClass('in')", 10);
}
function SB_fill()
{
    $('#sidebar').addClass('full');
    disableAllInteractions();
}
function SB_unfill()
{
    $('#sidebar').removeClass('full');
    enableAllInteractions();
}
function SB_toggle()
{
    if (SB_isShown())
        SB_hide();
    else
        SB_show();
}
function SB_addWillCloseListener(listener)
{
    SB_willCloseListeners.push(listener);
}
function SB_callWillCloseListeners()
{
    $.each(SB_willCloseListeners, function(index){
        this();
    });
}
