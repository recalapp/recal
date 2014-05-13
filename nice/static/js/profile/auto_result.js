function AR_init()
{
    //var profHeaderHeight = $('#profHeader').css('height');
    //var courseListHeight = $('#course-list').parent().parent().css('height');
    $(window).on('resize', function(ev){
        AR_adjustHeight();
    });
    AR_adjustHeight();
}
function AR_adjustHeight()
{
    var topPos = $('#auto-results').offset().top;
    $('#auto-results').css('max-height', window.innerHeight - parseInt(topPos) -10 +"px");
}
function AR_reloadWithData(data, term)
{
    $('#auto-results').html('');

    term = term.replace(/\D\d+\D/g, function(text){
        return text.charAt(0) + ' ' + text.substring(1, text.length - 1) + ' ' + text.slice(-1);
    });
    term = term.replace(/\D\d+/g, function(text){
        return text.charAt(0) + ' ' + text.substring(1);
    });
    term = term.replace(/\d+\D/g, function(text){
        return text.substring(0, text.length - 1) + ' ' + text.slice(-1);
    });
    term = term.split(/\s+/g);
    term = $.grep(term,function(n){ return(n) }); // strip empty strings
    term = term.join('|');
    term = '(' + term + ')';
    
    var regEx = new RegExp(term, 'gi');
    $.each(data, function(index, courseDict){
        var $resultItem = $(CacheMan_load('/auto-template'));
        $resultItem.appendTo('#auto-results');
        var courseListings = courseDict.course_listings;
        $resultItem.find('#course-listing').html(AR_highlightWithRegex(courseDict.course_listings, regEx));
        $resultItem.find('#course-title').html(AR_highlightWithRegex(courseDict.course_title, regEx));
        $resultItem.data('course_id', courseDict.course_id);
        $resultItem.on('click', function(ev){
            ev.preventDefault();
            AR_select($(this));
        });
    });
}
function AR_highlightWithRegex(subject, regex)
{
    return subject.replace(regex, function(text){
        return '<span style="background-color: yellow">' + text + '</span>';
    });
}
function AR_select($resultItem)
{
    var courseID = $resultItem.data('course_id');
    CourseMan_enrollInCourseID(courseID);
    CL_selectID(courseID);
    $('#class').val('');
    $( "#class" ).autocomplete('destroy');
    $('#auto-results').html('');
    setTimeout(function(){
        createAuto();
    }, 10);
}
