function CL_init()
{
    CourseMan_addUpdateListener(function(){
        CL_reload();
    });
    CL_reload();
    PopUp_addCloseListener(function(id){
        CL_unhighlight($('#'+id+'.course-item.panel'));
    });
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
            if (section.section_name == "All Students")
                return;
            sectionNames.push(section.section_name);
        });
        sectionNames.sort();
        $courseItem.find('.course-sections').text(sectionNames.join(', '));
        $courseItem.find('.panel')[0].id = this;
        $courseItem.find('a').on('click', function(ev){
            ev.preventDefault();
            CL_clickCourse(this);
        });
        if (UI_isMain(this) || UI_isPinned(this))
            CL_highlight($courseItem.find('.panel'));
    });
}

function CL_clickCourse(anchor)
{
    var coursePanel = $(anchor).find('.panel')[0];

    if (CL_isHighlighted(coursePanel))
    {
        var id = coursePanel.id;
        PopUp_giveFocusToID(id);
        return;
    }

    if (SHIFT_PRESSED)
    {
    }

    CL_unhighlight($('.panel-primary.course-item').filter(function(){
        return !UI_isPinned(this.id);
    }));
    CL_highlight(coursePanel);

    var popUp = PopUp_getMainPopUp();
    PopUp_setToCourseID(popUp, coursePanel.id);
    PopUp_giveFocus(popUp);
}

function CL_selectID(courseID)
{
    var coursePanel = $('#'+courseID+'.panel.course-item').parent()[0];
    CL_clickCourse(coursePanel);
}

/***************************************************
 * Appearance
 **************************************************/
function CL_highlight(course)
{
    $(course).addClass('panel-primary').removeClass('panel-default');
}

function CL_unhighlight(course)
{
    $(course).addClass('panel-default').removeClass('panel-primary');
}

function CL_isHighlighted(course)
{
    return $(course).hasClass('panel-primary');
}
