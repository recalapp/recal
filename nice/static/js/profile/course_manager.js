var CourseManager = function(){};
CourseManager.prototype.courseSectionsMap = {};
CourseManager.prototype.enrolledCourses = function(){
    var ret = [];
    for (var courseID in this.courseSectionsMap)
        ret.push(courseID);
    return ret;
};
CourseManager.prototype.allCourses = {};
CourseManager.prototype.allSections = {};
CourseManager.prototype.isIdle = true;
CourseManager.prototype.queue = [];
CourseManager.prototype.modified = false;

var courseManager = null;
var CourseMan_updateListeners = [];

function CourseMan_init()
{
    courseManager = new CourseManager();
    CourseMan_pullEnrolledCourseIDs(function(){
        CourseMan_cacheEnrolledCourses();
    }); 
    setInterval(function(){
        CourseMan_pushChanges(true);
    }, 10 * 1000); 
    $(window).on('beforeunload', function(){
        CourseMan_pushChanges(false);
    });
}

/**************************************************
 * Client methods
 * These are strictly interactions between the event
 * manager and the client. It does NOT talk to 
 * the server.
 **************************************************/

/*
 * {
 *  course_id:
 *  course_name:
 *  course_description:
 *  course_professor:
 *  course_listings:
 *  sections: {
 *      section_type: [section_id]
 *  }
 * }
 */
function CourseMan_getCourseByID(id)
{
    if (!(id in courseManager.allCourses))
        CourseMan_pullCourseByID(id, false);
    return courseManager.allCourses[id];
}

function CourseMan_getEnrolledCourses()
{
    return courseManager.enrolledCourses();
}

function CourseMan_getEnrolledSectionIDs(courseID)
{
    return courseManager.courseSectionsMap[courseID];
}

/*
 * {
 *  section_id:
 *  section_name:
 * }
 */
function CourseMan_getSectionByID(id)
{
    return courseManager.allSections[id];
}

function CourseMan_courseEnrolled(courseID)
{
    return courseID in courseManager.courseSectionsMap;
}

function CourseMan_enrollInCourseID(courseID)
{
    if (CourseMan_courseEnrolled(courseID))
        return;
    var course = CourseMan_getCourseByID(courseID);
    // enroll in All Students
    var allStudentsID = course.sections.ALL[0];
    courseManager.courseSectionsMap[courseID] = [allStudentsID];
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}
function CourseMan_unenrollCourseID(courseID)
{
    if (!CourseMan_courseEnrolled(courseID))
        return;
    delete courseManager.courseSectionsMap[courseID];
    courseManager.modified = true;
    CourseMan_callUpdateListeners();
}

/***************************************************
 * Server code
 **************************************************/
 
function CourseMan_pullEnrolledCourseIDs(complete)
{
    if (!courseManager.isIdle)
    {
        courseManager.queue.push({
            call: CourseMan_pullEnrolledCourses,
            arg1: complete,
        });
        return;
    }
    courseManager.isIdle = false;
    $.ajax('/get/sections', {
        dataType: 'json',
        success: function(data){
            courseManager.courseSectionsMap = data;
            courseManager.isIdle = true;
            if (complete)
                complete();
            CourseMan_handleQueue();
            CourseMan_callUpdateListeners();
        },
        error: function(data){
            courseManager.isIdle = true;
            CourseMan_handleQueue();
        }
    });
}

function CourseMan_pullCourseByID(courseID, async)
{
    // does not have to respect idleness because it deals with
    // a different data structure
    $.ajax('/get/course/'+courseID, {
        dataType: 'json',
        async: async,
        success: function(data){
            CourseMan_saveCourseDict(data);
            CourseMan_callUpdateListeners();
        }
    });
}

function CourseMan_pushChanges(async)
{
    if (!courseManager.modified)
        return;
    if (!courseManager.isIdle)
    {
        courseManager.queue.push({
            call: CourseMan_pushChanges,
            arg1: async,
        });
        return;
    }
    courseManager.isIdle = false;
    $.ajax('/put/sections', {
        async: async,
        type: 'POST',
        data: {
            sections: JSON.stringify(courseManager.courseSectionsMap),
        },
        success: function(data){
            courseManager.isIdle = true;
            courseManager.modified = false;
            CourseMan_handleQueue();
        },
        error: function(data){
            courseManager.isIdle = true;
            CourseMan_handleQueue();
        }
    });
}

function CourseMan_cacheEnrolledCourses()
{
    for (var courseID in courseManager.enrolledCourses())
    {
        if (!(courseID in courseManager.allCourses))
            CourseMan_pullCourseByID(courseID, true);
    }
}

function CourseMan_handleQueue()
{
    if (courseManager.queue.length > 0)
    {
        var queued = courseManager.queue.shift();
        queued.call(queued.arg1);
    }
}

function CourseMan_pullAutoComplete(request, complete)
{
    $.getJSON('/api/classlist', request, function(data, status, xhr){
        // process data
        $.each(data, function(index){
            CourseMan_saveCourseDict(this);
        });
        if (complete)
            complete(data);
    });
}

function CourseMan_saveCourseDict(courseDict)
{
    for (var type in courseDict.sections)
    {
        for (var i in courseDict.sections[type])
        {
            var section = courseDict.sections[type][i];
            courseManager.allSections[section.section_id] = section;
            courseDict.sections[type][i] = section.section_id;
        }
    }
    courseManager.allCourses[courseDict.course_id] = courseDict;
}

/***************************************************
 * Client event listeners
 **************************************************/

function CourseMan_addUpdateListener(listener)
{
    CourseMan_updateListeners.push(listener);
}

function CourseMan_callUpdateListeners()
{
    $.each(CourseMan_updateListeners, function(index){
        this();
    });
}
