function SE_showSimilarEvents(eventID, similarEvents)
{
    var choices = [];
    $.each(similarEvents, function(index, eventDict){
        choices.push({
            eventID: eventID,
            eventDict: eventDict,
            buttons: [
                {
                    value: 'c',
                    pretty: 'Choose',
                }
            ],
        });
    });
    var ep = EP_init('Is this the same as your event?', choices);
    SB_setMainContent(ep);
    SB_fill();
}
