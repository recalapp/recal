define(["require", "exports"], function(require, exports) {
    var Wrapper = (function () {
        function Wrapper(key, value) {
            this.key = key;
            this.value = value;
        }
        return Wrapper;
    })();
    var Dictionary = (function () {
        function Dictionary(primitiveObject) {
            this._dict = {};
            if (primitiveObject) {
                for (var key in primitiveObject) {
                    var value = primitiveObject[key];
                    this.set(key, value);
                }
            }
        }
        /**
        * Set the value in the dictionary, and return the old value (null
        * no old value)
        */
        Dictionary.prototype.set = function (key, value) {
            var wrapper = this.findWrapper(key);
            if (wrapper !== null && wrapper !== undefined) {
                var ret = wrapper.value;
                wrapper.value = value;
                return ret;
            }
            this.getOrCreateBin(key).push(new Wrapper(key, value));
            return null;
        };

        Dictionary.prototype.unset = function (key) {
            if (this.contains(key)) {
                var bin = this.getOrCreateBin(key);
                for (var i = 0; i < bin.length; ++i) {
                    if (bin[i].key === key) {
                        var ret = bin[i].value;
                        bin.splice(i, i + 1);
                        return ret;
                    }
                }
            }
            return null;
        };

        Dictionary.prototype.contains = function (key) {
            return this.findWrapper(key) !== null;
        };

        Dictionary.prototype.getOrCreateBin = function (key) {
            var keyString = key.toString();
            if (!(keyString in this._dict)) {
                this._dict[keyString] = new Array();
            }
            return this._dict[keyString];
        };

        Dictionary.prototype.findWrapper = function (key) {
            if (key.toString() in this._dict) {
                var bin = this._dict[key.toString()];
                for (var i = 0; i < bin.length; ++i) {
                    if (bin[i].key === key) {
                        return bin[i];
                    }
                }
            }
            return null;
        };

        Dictionary.prototype.get = function (key) {
            var wrapper = this.findWrapper(key);
            if (wrapper !== null && wrapper !== undefined) {
                return wrapper.value;
            }
            return null;
        };

        /**
        * Gets the value associated with the key if it exists. Otherwise,
        * set the key to dictionary with default value, and return the
        * default value.
        * @param key
        * @param defaultValue
        */
        Dictionary.prototype.getOrCreate = function (key, defaultValue) {
            if (this.contains(key)) {
                return this.get(key);
            }
            this.set(key, defaultValue);
            return defaultValue;
        };

        Dictionary.prototype.allKeys = function () {
            var ret = Array();
            for (var hash in this._dict) {
                var bin = this._dict[hash];
                for (var i = 0; i < bin.length; ++i) {
                    ret.push(bin[i].key);
                }
            }
            return ret;
        };

        /**
        * Assumes that key.toString() is unique.
        */
        Dictionary.prototype.primitiveObject = function () {
            var allKeys = this.allKeys();
            var ret = {};
            for (var i = 0; i < allKeys.length; ++i) {
                var key = allKeys[i];
                ret[key.toString()] = this.get(key);
            }
            return ret;
        };
        return Dictionary;
    })();
    
    return Dictionary;
});
//# sourceMappingURL=Dictionary.js.map
