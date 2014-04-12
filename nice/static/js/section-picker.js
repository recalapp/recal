var SP_MAP;
var SP_MAP_INVERSE;
var SP_selectListener;


function SP_init()
{
    $.get('all-sections', function(data){
        SP_MAP = data;
        SP_MAP_INVERSE = {};
        $.each(SP_MAP, function (key, value) {
            SP_MAP_INVERSE[value.toLowerCase()] = key;
        });
    }, 'json');
}
function SP_clickedSection(button)
{
    $(button).parent().find('button').not(this).addClass('btn-default').removeClass('btn-primary');
    $(button).addClass('btn-primary').removeClass('btn-default');
    if (SP_selectListener)
        SP_selectListener($(button).parent()[0], SP_keyToText(button.id));
}
function SP_select(sp, section)
{
    $(sp).find('button').addClass('btn-default').removeClass('btn-primary');
    if (SP_validateSection(section))
    {
        var id = SP_textToKey(section);
        $(sp).find('#'+id).addClass('btn-primary').removeClass('btn-default');
    }
}

function SP_setSelectListener(listener)
{
    SP_selectListener = listener;
}
function SP_validateSection(section)
{
    return section.toLowerCase() in SP_MAP_INVERSE;
}
function SP_keyToText(key)
{
    return SP_MAP[key];
}
function SP_textToKey(text)
{
    return SP_MAP_INVERSE[text.toLowerCase()];
}
function SP_firstSectionKey()
{
    var first;
    $.each(SP_MAP, function(key, value){
        first = key;
        return false;
    })
    return first;
}
