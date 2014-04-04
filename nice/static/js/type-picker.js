var TP_MAP = {
    "assignment":"AS",
    "exam":"EX",
    "lab":"LA",
    "lecture":"LE",
    "office hours":"OH",
    "precept":"PR",
    "review session":"RS"
}
var TP_MAP_INVERSE = {
    AS: "assignment",
    EX: "exam",
    LA: "lab",
    LE: "lecture",
    OH: "office hours",
    PR: "precept",
    RS: "review session"
}

var TP_selectListener;
function TP_clickedType(button)
{
    $(button).parent().find("button").not(this).addClass("btn-default").removeClass("btn-primary");
    $(button).addClass("btn-primary").removeClass("btn-default");
    if (TP_selectListener)
        TP_selectListener($(button).parent()[0], TP_MAP_INVERSE[button.id]);
}
function TP_select(tp, type)
{
    if (type.toLowerCase() in TP_MAP)
    {
        id = TP_MAP[type.toLowerCase()];
        $(tp).find("button").not("#"+id).addClass("btn-default").removeClass("btn-primary");
        $(tp).find("#"+id).addClass("btn-primary").removeClass("btn-default");
    }
}
function TP_setSelectListener(listener)
{
    TP_selectListener = listener;
}
