function SCM_initWithChoices(heading, choices)
{
    var sc = SC_initWithChoices(heading, choices);
    $(sc).find('button').each(function(index){
        $(this).off('click');
        $(this).on('click', function(ev){
            ev.preventDefault();
            if (SC_isHighlighted(this))
                SCM_deselect(this);
            else
                SCM_select(this);
        });
        for (var i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (choice.value == $(this).data('value'))
            {
                if (choice.selected)
                    SCM_select(this);
                break;
            }
        };
    });
    return sc;
}
function SCM_select(button)
{
    SC_highlight(button);
    var choices = {};
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
function SCM_deselect(button)
{
    SC_unhighlight(button);
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
