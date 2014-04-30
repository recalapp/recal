/*
 * [
 *  {
 *      eventID: the id in events manager
 *      eventDict: the dictionary of the new event
 *      buttons: [
 *          {
 *              value:
 *              pretty:
 *          }
 *      ]
 *  }
 * ]
 */
function EP_init(heading, choices)
{
   var $ep = $(CacheMan_load('event-picker'));
   $ep.find('#ep-title').text(heading);
   $ep.data('count', choices.length);
   $.each(choices, function(index, choice){
        // create picker item
        var $pickerItem = $(CacheMan_load('event-picker-item'));
        if (index == 0)
            $pickerItem.addClass('active');
        
        // picker item uses a popup component. set the properties
        var popUp = $pickerItem.find('.popup-ep')[0];
        var eventDict = choice.eventDict;
        PopUp_setTitle(popUp, eventDict.event_title);
        PopUp_setDescription(popUp, eventDict.event_description);
        PopUp_setLocation(popUp, eventDict.event_location);
        PopUp_setSection(popUp, eventDict.section_id);
        PopUp_setType(popUp, eventDict.event_type);
        PopUp_setDate(popUp, eventDict.event_start);
        PopUp_setStartTime(popUp, eventDict.event_start);
        PopUp_setEndTime(popUp, eventDict.event_end);
        //_PopUp_setBodyHeight(popUp);

        $.each(choice.buttons, function(index, buttonDict){
            var $button = $('<a>').addClass('white-link-btn').addClass('theme');
            $button.text(buttonDict.pretty);
            $button.data('value', buttonDict.value);
            $button.on('click', function(ev){
                ev.preventDefault();
                $ep.trigger('ep.select', {
                    eventID: choice.eventID,
                    eventDict: choice.eventDict,
                    button: $(this).data('value'),
                });
            });
            $pickerItem.find('#ep-item-controls').append($button);
        });
        $ep.find('#ep-container').append($pickerItem);
   });
   $ep.find('#cancel_button').on('click', function(ev){
       ev.preventDefault();
       $ep.trigger('ep.cancel');
   });
   $ep.on('slid.bs.carousel', function(ev){
       _EP_updateButtons(this);
       var index = $(ep).find('.item.active').index();
       var choice = choices[index];
       $(this).trigger('ep.slid', {
           eventID: choice.eventID,
           eventDict: choice.eventDict
       });
   });
   _EP_updateButtons($ep[0]);
   return $ep[0];
}
function _EP_updateButtons(ep)
{
    var $ep = $(ep);
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
