function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    eventsManager.courseEventsMap = {};
    eventsManager.sectionEventsMap = {};
    EventsMan_pullFromServer(function(){
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
    });
    CourseMan_addUpdateListener(function(){
        EventsMan_pullFromServer();
        _EventsMan_callUpdateListeners();
    });
}
function EventsMan_pullFromServer(complete)
{
    if (!eventsManager.isIdle)
        return;
    eventsManager.isIdle = false;
    var courseIDs = CourseMan_getEnrolledCourses();
    var start = moment.unix(CUR_SEM.start_date);
    var end = moment.unix(CUR_SEM.start_date);
    end.week(start.week() + 1);
    $.ajax('/get/bycourses/0/' + start.unix() + '/' + end.unix(), {
        dataType: 'json',
        type: 'GET',
        data: {
            'courseIDs': JSON.stringify(courseIDs)
        },
        success: function(data){
            var eventsArray = data;
            if (data.length == 0)
            {
                eventsManager.isIdle = true;
                _EventsMan_callUpdateListeners();
                return;
            }
            for (var i = 0; i < eventsArray.length; i++)
            {
                var eventsDict = eventsArray[i]; 
                eventsManager.events[eventsDict.event_id] = eventsDict;
            }
            EventsMan_constructOrderArray();
            eventsManager.lastSyncedTime = moment().unix();
            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
        }
    });
}

function EventsMan_getEnrolledEvents()
{
    var sectionIDs = [];
    $.each(CourseMan_getEnrolledCourses(), function(index){
        $.each(CourseMan_getEnrolledSectionIDs(this), function(index){
            sectionIDs.push(parseInt(this));
        });
    });
    var ret = [];
    $.each(eventsManager.events, function(eventID, eventDict){
        if ($.inArray(eventDict.section_id, sectionIDs) > -1)
            ret.push(eventID);
    });
    return ret;
}
