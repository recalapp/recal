function Set_new()
{
    this.add = function(item) {
        this[item] = true;
    };
    this.remove = function(item) {
        delete this[item];
    };
    return this;
}
