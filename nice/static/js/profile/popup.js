POPUP_CLASS = 'popup-course';
POPUP_URL = '/popup-course-template';

function PopUp_init()
{
    if (POPUP_INIT)
        return;
    POPUP_INIT = true;
    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };
    
    // setting bounds
    topPos = 0;
    height = window.innerHeight - topPos + 300;
    $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    $(window).on('resize', function(ev){
        topPos = 0;
        height = window.innerHeight - topPos + 300;
        $("#content_bounds").css("top",topPos + "px").css("height", height).css("left", "-20%").css("width", "140%");
    });
}

function PopUp_initialize(popUp)
{
    $(popUp).find('#delete_button').on('click', function(ev){
        ev.preventDefault();
        var id = PopUp_getID(popUp)
        PopUp_callCloseListeners(id)
        PopUp_close(popUp)
        CourseMan_unenrollCourseID(id);
    });
}

function PopUp_setToCourseID(popUp, courseID)
{
    PopUp_setID(popUp, courseID);
    var courseDict = CourseMan_getCourseByID(courseID);
    if (!courseDict)
    {
        console.log("errorneous course id");
        return;
    }

    var courseColor = COURSE_COLOR_MAP[courseID];
    if (!courseColor)
        courseColor = getUsableColor(courseID);

    PopUp_setListing(popUp, courseDict.course_listings);
    PopUp_setTitle(popUp, courseDict.course_title);
    PopUp_setDescription(popUp, courseDict.course_description);
    PopUp_setColor(popUp, courseColor);

    SC_removeAllFromContainer(popUp);
    var enrolledSections = CourseMan_getEnrolledSectionIDs(courseID);
    $.each(courseDict.sections, function(sectionType, sectionList){
        if (sectionType == 'ALL')
            return;
        var choices = [];
        var enrolled = false;
        $.each(sectionList, function(index){
            var section = CourseMan_getSectionByID(this);
            choices.push({
                value: section.section_id,
                pretty: section.section_name,
                selected: enrolledSections.contains(section.section_id),
            });
            enrolled |= enrolledSections.contains(section.section_id);
        });
        choices.sort(function(a, b){
            return a.pretty.localeCompare(b.pretty);
        });
        var segmented = SC_initWithChoices(sectionType, choices);
        if (!enrolled)
            CourseMan_enrollSectionID(courseID, choices[0].value);
        //$(popUp).find('#popup-title').after(segmented);
        $(popUp).find('#sections-container').append(segmented);
        $(segmented).on('select', function(ev, choices){
            $.each(choices, function(sectionID, enroll){
                if (enroll)
                    CourseMan_enrollSectionID(courseID, sectionID);
                else
                    CourseMan_unenrollSectionID(courseID, sectionID);
            });

            CL_selectID(courseID);
        });
    });
}
function PopUp_setListing(popUp, listing)
{
    $(popUp).find('#popup-listing').text(listing);
}
function PopUp_setTitle(popUp, title)
{
    $(popUp).find('#popup-title').text(title);
}
function PopUp_setDescription(popUp, description)
{
    $(popUp).find('#popup-desc').html(nl2br(description));
}

function PopUp_clickedClose(popUpAnchor)
{
    var popUp = _PopUp_getPopUp(popUpAnchor);
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));
    PopUp_close(popUp);
}
