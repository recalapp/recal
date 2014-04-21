
function CL_init()
{
    CourseMan_addUpdateListener(function(){
        CL_reload();
    });
    CL_reload();
}

function CL_reload()
{
    var courseList = $('#course-list')[0];
    courseList.innerHTML = null;
    $.each(CourseMan_getEnrolledCourses(), function(index){
        var courseDict = CourseMan_getCourseByID(this);
        var $courseItem = $(CacheMan_load('/course-template')).appendTo(courseList);
        $courseItem.find('.course-title').text(courseDict.course_listings)[0];
        var sectionNames = [];
        $.each(CourseMan_getEnrolledSectionIDs(this), function(index){
            var section = CourseMan_getSectionByID(this);
            sectionNames.push(section.section_name);
        });
        $courseItem.find('.course-sections').text(sectionNames.join(', '))
    });
}
