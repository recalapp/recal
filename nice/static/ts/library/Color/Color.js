define(["require", "exports", '../Core/InvalidArgumentException'], function(require, exports, InvalidArgumentException) {
    var Color = (function () {
        function Color() {
            this._red = 0;
            this._green = 0;
            this._blue = 0;
        }
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return this._red;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return this._green;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this._blue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Color.prototype, "hexValue", {
            get: function () {
                return '#' + HexUtilities.numberToHex(this.red) + HexUtilities.numberToHex(this.green) + HexUtilities.numberToHex(this.blue);
            },
            enumerable: true,
            configurable: true
        });

        Color.fromHex = function (hexString) {
            if (hexString === null || hexString === undefined) {
                throw new InvalidArgumentException("HexString cannot be null.");
            }
            if (hexString.indexOf('#') === 0) {
                hexString = hexString.substring(1);
            }
            if (hexString.length === 3) {
                hexString = hexString[0] + hexString[0] + hexString[1] + hexString[1] + hexString[2] + hexString[2];
            } else if (hexString.length !== 6) {
                throw new InvalidArgumentException("HexString is of wrong format.");
            }
            if (!hexString.match(/[0-9a-fA-F]/)) {
                throw new InvalidArgumentException("HexString is of wrong format.");
            }
            var color = new Color();
            color._red = HexUtilities.hexToNumber(hexString.substring(0, 2));
            color._green = HexUtilities.hexToNumber(hexString.substring(2, 4));
            color._blue = HexUtilities.hexToNumber(hexString.substring(4, 6));
            return color;
        };

        Color.fromRGB = function (red, green, blue) {
            if (!HexUtilities.validateHexNumber(red) || !HexUtilities.validateHexNumber(blue) || !HexUtilities.validateHexNumber(green)) {
                throw new InvalidArgumentException("RGB must be between 0 and 255");
            }
            var color = new Color();
            color._red = red;
            color._blue = blue;
            color._green = green;
            return color;
        };
        return Color;
    })();

    var HexUtilities = (function () {
        function HexUtilities() {
        }
        HexUtilities.validateHexNumber = function (hex) {
            return hex >= 0 && hex <= 255;
        };

        HexUtilities.numberToHex = function (value) {
            return value.toString(16);
        };

        HexUtilities.hexToNumber = function (hex) {
            return parseInt(hex, 16);
        };
        return HexUtilities;
    })();

    
    return Color;
});
//# sourceMappingURL=Color.js.map
