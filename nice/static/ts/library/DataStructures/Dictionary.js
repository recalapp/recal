define(["require", "exports"], function(require, exports) {
    var Dictionary = (function () {
        function Dictionary() {
            this._dict = {};
        }
        /**
        * Set the value in the dictionary, and return the old value (null
        * no old value)
        */
        Dictionary.prototype.set = function (key, value) {
            var ret = null;
            if (this.contains(key)) {
                ret = this.get(key);
            }
            this._dict[key.toString()] = value;
            return ret;
        };

        Dictionary.prototype.contains = function (key) {
            return key.toString() in this._dict;
        };

        Dictionary.prototype.get = function (key) {
            return this.contains(key) ? this._dict[key.toString()] : null;
        };

        Dictionary.prototype.allKeys = function () {
            var ret = Array();
            for (var key in this._dict) {
                ret.push(key);
            }
            return ret;
        };
        return Dictionary;
    })();
    
    return Dictionary;
});
