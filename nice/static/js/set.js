var Set = function()
{
}
Set.prototype.add = function(item) {
    this[item] = true;
}
Set.prototype.remove = function(item) {
    delete this[item];
}
