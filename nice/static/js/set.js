/***********************************************************
 * A generic set data structure
 **********************************************************/

var Set = function()
{ 
}
Set.prototype.size = 0;
Set.prototype.add = function(item) {
    this[item] = true;
    this.size++;
}
Set.prototype.remove = function(item) {
    if (item in this)
    {
        delete this[item];
        this.size--;
    }
}
Set.prototype.fromArray = function(array){
    var ret = new Set();
    for (var i = 0; i < array.length; i++) {
        ret.add(array[i]);
    };
    return ret;
}
Set.prototype.toArray = function(){
    var ret = [];
    for (var key in this) {
        if (typeof this[key] != 'function' && key != 'size')
            ret.push(key);
    };
    ret.sort();
    return ret;
};
Set.prototype.contains = function(a){
    for (var key in a) {
        if (!(key in this))
            return false;
    };
    return true;
};
Set.prototype.equals = function(a){
    return this.contains(a) && a.contains(this);
};
Set.prototype.isEmpty = function(a){
    return this.size <= 0;
}
