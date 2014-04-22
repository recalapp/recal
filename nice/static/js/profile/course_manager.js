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

var courseManager = null;
var CourseMan_updateListeners = [];

function CourseMan_init()
{
    courseManager = new CourseManager();
    CourseMan_pullEnrolledCourseIDs(function(){
        CourseMan_cacheEnrolledCourses();
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
            for (var i in data.sections)
            {
                var section = data.sections[i];
                courseManager.allSections[section.section_id] = section;
            }
            delete data.sections;
            courseManager.allCourses[data.course_id] = data;
            CourseMan_callUpdateListeners();
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
