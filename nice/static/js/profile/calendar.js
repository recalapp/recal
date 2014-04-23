function Cal_init() {
    if (CAL_INIT)
        return;
    CAL_INIT = true;
    var height = '410';//window.innerHeight * 0.6;
    Cal_options.height = height;
    Cal_options.header = false;
    Cal_options.columnFormat = {
        month: 'ddd',    // Mon
        week: 'ddd', // Mon
        day: 'dddd M/d'  // Monday 9/7
    }
    $('#calendarui').fullCalendar(Cal_options);
    EventsMan_addUpdateListener(function(){
        Cal_reload();
    });
}

function Cal_reload()
{
    //try{
        var eventIDs = EventsMan_getEnrolledEvents();
        Cal_eventSource.events = [];
        $.each(eventIDs, function(index){
            eventDict = EventsMan_getEventByID(this);
            Cal_eventSource.events.push({
                id: eventDict.event_id,
                title: eventDict.event_title,
                start: moment.unix(eventDict.event_start).tz(MAIN_TIMEZONE).toISOString(),
                end: moment.unix(eventDict.event_end).tz(MAIN_TIMEZONE).toISOString(),
                backgroundColor: '#74a2ca'
            });
        });
        $("#calendarui").fullCalendar("refetchEvents");
    //}
    //catch(err){
    //}
}
