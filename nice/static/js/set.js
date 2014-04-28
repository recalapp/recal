var Set = function()
{
}
Set.prototype.size = 0;
Set.prototype.add = function(item) {
    this[item] = true;
    this.size++;
}
Set.prototype.remove = function(item) {
    delete this[item];
    this.size--;
}
