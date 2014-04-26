var MAIN_TIMEZONE = 'America/New_York';
var DAYS_DICT = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'S'];
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
