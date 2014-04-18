var EP_similarEvents;
function EP_initWithEvents(oldEventID, events)
{
    EP_similarEvents = events;
    SB_setMainContent(CacheMan_load('event-picker'));
    $('#event-picker').data('count', events.length);
    $.each(events, function(index){
        var $pickerItem = $(CacheMan_load('event-picker-item')).appendTo('#event-picker > .carousel-inner');
        if (index == 0)
            $pickerItem.addClass('active');
        var popUp = $pickerItem.find('.popup-ep')[0];
        PopUp_setTitle(popUp, this.event_title);
        PopUp_setDescription(popUp, this.event_description);
        PopUp_setLocation(popUp, this.event_location);
        PopUp_setSection(popUp, this.section_id);
        PopUp_setType(popUp, this.event_type);
        PopUp_setDate(popUp, this.event_start);
        PopUp_setStartTime(popUp, this.event_start);
        PopUp_setEndTime(popUp, this.event_end);
        _PopUp_setBodyHeight(popUp);

        var eventDict = this;
        // set up event listener for choosing
        $pickerItem.find('#choose-btn').on('click', function(ev){
            ev.preventDefault();
            EventsMan_replaceUncommittedEventIDWithEvent(oldEventID, eventDict);
            PopUp_markIDAsNotEditing(eventDict.event_id);
            SB_pop($('#event-picker')[0]);
            SB_unfill();
        });
    });
    SB_addWillCloseListener(function(){
        $('#event-picker').each(function(index){
            SB_pop(this);
        });
    });
    EP_updateButtons();
    $('#event-picker').on('slid.bs.carousel', function(ev){
        EP_updateButtons();
    });
}
function EP_updateButtons()
{
    var $ep = $('#event-picker');
    var activeIndex = $ep.find('.item.active').index();
    // enable all buttons first
    $ep.find('.ep-control').removeClass('disabled-btn');
    if (activeIndex == 0)
    {
        // disable left button
        $ep.find('.left.ep-control').addClass('disabled-btn');
    }
    if (activeIndex == $ep.data('count') - 1)
    {
        // disable right button
        $ep.find('.right.ep-control').addClass('disabled-btn');
    }
}
