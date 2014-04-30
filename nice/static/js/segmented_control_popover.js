function SCP_initOnElement(element, container, heading, choices)
{
    var sc = SC_initWithChoices(null, choices);
    $(sc).find('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
    $(element).popover({
        title: heading,
        placement: 'left',
        html: true,
        content: sc,
        trigger: 'focus',
        container: $(container)
    });
    return sc;
}
