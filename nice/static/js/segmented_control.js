/*
 * choices = [
 *  {
 *      value:
 *      pretty:
 *      selected: 
 *  }
 * ]
 */
function SC_initWithChoices(heading, choices)
{
    $container = $('<div>').addClass('segmented-control').append($('<h5>'));
    $container.find('h5').text(heading);
    var $control = $('<div>').addClass('btn-group');
    $.each(choices, function(index){
        var $button = $('<button>').addClass('btn').addClass('btn-sm').text(this.pretty).data('value', this.value).on('click', function(ev){
            ev.preventDefault();
            SC_select(this);
        });;
        $control.append($button);
        if (this.selected)
            SC_select($button);
    });
    $container.append($control);
    return $container[0];
}

function SC_removeAllFromContainer(container)
{
    $(container).find('.segmented-control').remove();
}

function SC_select(button)
{
    SC_unhighlight($(button).parent().find('.btn-primary'));
    SC_highlight(button);
    var choices = {};
    $(button).parent().find('.btn').each(function(index){
        choices[$(this).data('value')] = $(this).hasClass('btn-primary')
    });
    $(button).trigger('select', choices);
}
function SC_highlight(button)
{
    $(button).addClass('btn-primary');
}
function SC_unhighlight(button)
{
    $(button).removeClass('btn-primary');
}
function SC_isHighlighted(button)
{
    return $(button).hasClass('btn-primary');
}
