var SP_MAP;
var SP_MAP_INVERSE;
function SP_init()
{
    $.get('all-sections', function(data){
        SP_MAP = data;
        SP_MAP_INVERSE = {};
        $.each(SP_MAP, function (key, value) {
            SP_MAP_INVERSE[value] = key;
        });
    }, 'json');
}
