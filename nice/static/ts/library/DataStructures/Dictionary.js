define(["require", "exports"], function(require, exports) {
    var Wrapper = (function () {
        function Wrapper(key, value) {
            this.key = key;
            this.value = value;
        }
        return Wrapper;
    })();
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
            this._dict[key.toString()] = new Wrapper(key, value);
            return ret;
        };

        Dictionary.prototype.contains = function (key) {
            return key.toString() in this._dict;
        };

        Dictionary.prototype.get = function (key) {
            return this.contains(key) ? this._dict[key.toString()].value : null;
        };

        Dictionary.prototype.allKeys = function () {
            var ret = Array();
            for (var hash in this._dict) {
                ret.push(this._dict[hash].key);
            }
            return ret;
        };
        return Dictionary;
    })();
    
    return Dictionary;
});
