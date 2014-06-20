define(["require", "exports", './Dictionary'], function(require, exports, Dictionary) {
    var Set = (function () {
        function Set(initialItems) {
            this._dict = new Dictionary();
            this._size = 0;
            if (initialItems) {
                for (var i = 0; i < initialItems.length; i++) {
                    this.add(initialItems[i]);
                }
            }
        }
        Set.prototype.size = function () {
            return this._size;
        };

        Set.prototype.add = function (a) {
            if (this.contains(a)) {
                return;
            }
            this._size++;
            this._dict.set(a, true);
        };
        Set.prototype.contains = function (a) {
            return this._dict.get(a) === true;
        };
        Set.prototype.remove = function (a) {
            if (!this.contains(a)) {
                return;
            }
            this._size--;
            return this._dict.set(a, false);
        };
        Set.prototype.toArray = function () {
            return this._dict.allKeys();
        };
        Set.prototype.containsSet = function (other) {
            var otherItems = other.toArray();
            for (var i = 0; i < otherItems.length; i++) {
                if (!this.contains(otherItems[i])) {
                    return false;
                }
            }
            return true;
        };
        Set.prototype.equals = function (other) {
            return this.containsSet(other) && other.containsSet(this);
        };
        return Set;
    })();
    
    return Set;
});
