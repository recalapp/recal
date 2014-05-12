var CL_LOADING = false;

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
    if (CL_LOADING)
        return;
    CL_LOADING = true;
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
        
        CL_setColors($courseItem, courseDict);
    });
    if (THEME == 'w')
        $('.theme').removeClass('dark');
    else
        $('.theme').addClass('dark');
    CL_LOADING = false;
}

function CL_clickCourse(anchor)
{
    var coursePanel = $(anchor).find('.panel')[0];

    if (CL_isHighlighted(coursePanel))
    {
        var id = coursePanel.id;
        PopUp_giveFocusToID(id);
        var myCourseID = coursePanel.id;
        $.each($('#calendarui').fullCalendar('clientEvents'), function(index) {
            var eventDict = EventsMan_getEventByID(this.id);
            if (eventDict.course_id != myCourseID)
            {
                Cal_unhighlightEvent(this, true);
                console.log('unhighlight ' + eventDict.course_id);
            }
            else
            {
                Cal_highlightEvent(this, true);
                console.log('highlight ' + eventDict.course_id);
            }
        });    
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

    // find calendar events with the same course_id
    // then highlight them
    var myCourseID = coursePanel.id;
    $.each($('#calendarui').fullCalendar('clientEvents'), function(index) {
        var eventDict = EventsMan_getEventByID(this.id);
        if (eventDict.course_id != myCourseID)
        {
            Cal_unhighlightEvent(this, true);
            console.log('unhighlight ' + eventDict.course_id);
        }
        else
        {
            Cal_highlightEvent(this, true);
            console.log('highlight ' + eventDict.course_id);
        }
    });
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
    if (CL_isHighlighted(course))
        return;
    // var newColor = $(course).data('new-color');
    $(course).addClass('panel-primary').removeClass('panel-default');
    $(course).css('border-color', $(course).data('course-color'));
    // $(course).css('background-color', newColor);
}

function CL_unhighlight(course)
{
    if (!CL_isHighlighted(course))
        return;
    $(course).addClass('panel-default').removeClass('panel-primary');
    $(course).css('border-color', $(course).data('default-border'));
}

function CL_isHighlighted(course)
{
    return $(course).hasClass('panel-primary');
}

function CL_setColors(course, courseDict)
{
    var courseColor = COURSE_COLOR_MAP[courseDict.course_id];
    var defaultBorder = $(course).find('.panel').css('border-color');
    // $(course).data('new-color', courseColor);
    // $(course).find('.panel-default').addClass(courseColorClass).css('border-color', courseColor);
    $(course).find('.course-title').css('color', courseColor);
    $(course).find('.panel').data('default-border', defaultBorder);
    $(course).find('.panel').data('course-color', courseColor);
}
