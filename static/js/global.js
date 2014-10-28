var PRINCETON_TIMEZONE = 'America/New_York';
var MAIN_TIMEZONE = PRINCETON_TIMEZONE;
var DAYS_DICT = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'S'];
var TYPE_MAP_INVERSE = {
    "assignment":"AS",
    "exam":"EX",
    "lab":"LA",
    "lecture":"LE",
    "office hours":"OH",
    "precept":"PR",
    "review session":"RS"
}
var TYPE_MAP = {
    AS: "assignment",
    EX: "exam",
    LA: "lab",
    LE: "lecture",
    OH: "office hours",
    PR: "precept",
    RS: "review session"
}
String.prototype.escapeHTML = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};
Array.prototype.contains = function(a){
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == a)
            return true;
    }
    return false;
}
Array.prototype.find = function(a){
    for (var i = 0; i < this.length; i++) {
        if (this[i] == a)
            return i;
    };
    return -1;
}
Array.prototype.equals = function(a){
    var i;
    for (i = 0; i < this.length; i++) {
        if (i >= a.length)
            return false;
        else if (this[i] != a[i])
            return false;
    }
    return i == a.length;
}
