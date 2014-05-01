function SCP_initOnElement(element, container, heading, choices)
{
    if ($(element).data('scp'))
    {
        var scp = $(element).data('scp');
        SC_setToChoices(scp, choices);
        return scp;
    }
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
    $(element).data('scp', sc);
    return sc;
}
