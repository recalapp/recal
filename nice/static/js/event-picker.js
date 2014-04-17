var EP_similarEvents;
function EP_initWithEvents(events)
{
    EP_similarEvents = events;
    SB_setMainContent(CacheMan_load('event-picker'));
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
    });
    SB_addWillCloseListener(function(){
        $('#event-picker').each(function(index){
            SB_pop(this);
        });
    });
}
