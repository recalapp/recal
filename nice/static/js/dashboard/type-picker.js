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
        TP_selectListener($(button).parent()[0], toTitleCase(TP_MAP_INVERSE[button.id]));
}
function TP_select(tp, type)
{
    $(tp).find("button").addClass("btn-default").removeClass("btn-primary");
    if (TP_validateType(type))
    {
        var id = TP_MAP[type.toLowerCase()];
        $(tp).find("#"+id).addClass("btn-primary").removeClass("btn-default");
    }
}
function TP_setSelectListener(listener)
{
    TP_selectListener = listener;
}
function TP_validateType(type)
{
    return type.toLowerCase() in TP_MAP;
}
function TP_keyToText(key)
{
    return TP_MAP_INVERSE[key];
}
function TP_textToKey(text)
{
    return TP_MAP[text.toLowerCase()];
}
