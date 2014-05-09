function AS_showActionSheetFromElement(element, container, title, choices, clickListener)
{
    var $content = $('<div>');
    $.each(choices, function(index){
        var $button = $('<a>').addClass('white-link-btn').addClass('prompt-btn theme').attr('id', index).text(this.text);
        if (this.important) {
            $button = $button.addClass('no');
        } else {
            $button = $button.addClass('yes');
        }
        $button.on('click', function(ev){
            ev.preventDefault();
            $(element).blur();
            clickListener(index);
        });
        $content.append($button);
    });
    if (THEME == 'w')
        $content.find('.theme').removeClass('dark');
    else
        $content.find('.theme').addClass('dark');
    $(element).popover({
        title: title,
        placement: 'bottom',
        html: true,
        content: $content[0],
        trigger: 'focus',
        container: $(container)
    });
    $(element).focus();
}
