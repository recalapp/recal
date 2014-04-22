/*
 * choices = [
 *  {
 *      value:
 *      pretty:
 *  }
 * ]
 */
function SC_initWithChoices(heading, choices)
{
    $container = $('<div>').addClass('segmented-control').append($('<h5>'));
    $container.find('h5').text(heading);
    var $control = $('<div>').addClass('btn-group');
    $.each(choices, function(index){
        var $button = $('<button>').addClass('btn').addClass('btn-default').text(this.pretty).data('value', this.value).on('click', function(ev){
            ev.preventDefault();
        });;
        $control.append($button);
    });
    $container.append($control);
    return $container[0];
}

function SC_removeAllFromContainer(container)
{
    $(container).find('.segmented-control').remove();
}
