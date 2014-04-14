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
            $(popUp).detach().appendTo('#sidebar').css({
                position: 'relative',
                width: '100%',
                height: '300px',
                left: 'auto',
                top: 'auto',
            });
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
    return $('#sidebar').find('.popup').length == 0;
}
function SB_show()
{
    $('#sidebar').addClass('in');
}
function SB_hide()
{
    $('#sidebar').removeClass('in');
}
function SB_isShown()
{
    return $('#sidebar').hasClass('in');
}
function SB_push(content)
{
    $('#sidebar').append(content);
    if (!SB_isShown())
        SB_show();
}
