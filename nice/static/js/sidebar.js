
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
