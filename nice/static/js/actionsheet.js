function AS_showActionSheetFromElement(element, container, title, choices, clickListener)
{
    var $content = $('<div>');
    $.each(choices, function(index){
        var $button = $('<a>').addClass('white-link-btn').addClass('prompt-btn').attr('id', index).text(this.text);
        if (this.important) {
            $button = $button.addClass('no');
        } else {
            $button = $button.addClass('yes');
        }
        $button.on('click', function(ev){
            ev.preventDefault();
            clickListener(index);
        });
        $content.append($button);
    });
    //$(element).attr('tabindex', 0); // allows focus
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
