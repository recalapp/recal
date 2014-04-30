function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    eventsManager.loadedCourseIDs = new Set();
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
    var courseIDs = CourseMan_getEnrolledCourses();
    var filtered = [];
    for (var i = 0; i < courseIDs.length; i++) {
        var id = courseIDs[i];
        if (!(id in eventsManager.loadedCourseIDs))
            filtered.push(id);
    };
    if (filtered.length == 0)
        return;
    LO_show();
    eventsManager.isIdle = false;
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
            LO_hide();
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
            for (var i = 0; i < filtered.length; i++) {
                eventsManager.loadedCourseIDs.add(filtered[i]);
            };
            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
            LO_showError();
            //LO_hide();
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
        if (sectionIDs.contains(eventDict.section_id))
            ret.push(eventID);
    });
    return ret;
}
