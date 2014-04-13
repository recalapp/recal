function SB_init()
{
    $('#sidebar').droppable({
        drop: function(ev, ui) {
            var popUp = ui.draggable[0];
            
            $(popUp).detach().appendTo('#sidebar').css({
                position: 'relative',
                width: '100%',
                height: '300px',
                left: 'auto',
                top: 'auto',
            });
            PopUp_updateSize(popUp);
        },

    });
}

function SB_show()
{
    $('#sidebar').addClass('in');
}
function SB_hide()
{
    return;
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
