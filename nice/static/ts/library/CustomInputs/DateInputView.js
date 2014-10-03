/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/AssertionException', '../Core/BrowserEvents', '../DateTime/DateTime', '../DataStructures/Dictionary', '../CoreUI/FocusableView', '../Core/InvalidArgumentException'], function(require, exports, AssertionException, BrowserEvents, DateTime, Dictionary, FocusableView, InvalidArgumentException) {
    var DateSelectionComponent;
    (function (DateSelectionComponent) {
        DateSelectionComponent[DateSelectionComponent["months"] = 0] = "months";
        DateSelectionComponent[DateSelectionComponent["days"] = 1] = "days";
        DateSelectionComponent[DateSelectionComponent["years"] = 2] = "years";
    })(DateSelectionComponent || (DateSelectionComponent = {}));
    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["left"] = 37] = "left";
        KeyCode[KeyCode["up"] = 38] = "up";
        KeyCode[KeyCode["right"] = 39] = "right";
        KeyCode[KeyCode["down"] = 40] = "down";
        KeyCode[KeyCode["enter"] = 13] = "enter";
        KeyCode[KeyCode["tab"] = 9] = "tab";
        KeyCode[KeyCode["zero"] = 48] = "zero";
        KeyCode[KeyCode["one"] = 49] = "one";
        KeyCode[KeyCode["two"] = 50] = "two";
        KeyCode[KeyCode["three"] = 51] = "three";
        KeyCode[KeyCode["four"] = 52] = "four";
        KeyCode[KeyCode["five"] = 53] = "five";
        KeyCode[KeyCode["six"] = 54] = "six";
        KeyCode[KeyCode["seven"] = 55] = "seven";
        KeyCode[KeyCode["eight"] = 56] = "eight";
        KeyCode[KeyCode["nine"] = 57] = "nine";
        KeyCode[KeyCode["zeroNumPad"] = 96] = "zeroNumPad";
        KeyCode[KeyCode["oneNumPad"] = 97] = "oneNumPad";
        KeyCode[KeyCode["twoNumPad"] = 98] = "twoNumPad";
        KeyCode[KeyCode["threeNumPad"] = 99] = "threeNumPad";
        KeyCode[KeyCode["fourNumPad"] = 100] = "fourNumPad";
        KeyCode[KeyCode["fiveNumPad"] = 101] = "fiveNumPad";
        KeyCode[KeyCode["sixNumPad"] = 102] = "sixNumPad";
        KeyCode[KeyCode["sevenNumPad"] = 103] = "sevenNumPad";
        KeyCode[KeyCode["eightNumPad"] = 104] = "eightNumPad";
        KeyCode[KeyCode["nineNumPad"] = 105] = "nineNumPad";
        KeyCode[KeyCode["a"] = 65] = "a";
        KeyCode[KeyCode["p"] = 80] = "p";
    })(KeyCode || (KeyCode = {}));

    var DateInputView = (function (_super) {
        __extends(DateInputView, _super);
        function DateInputView($element, cssClass) {
            var _this = this;
            _super.call(this, $element, cssClass);
            this.MAX_YEARS = 2100;
            this.MIN_YEARS = 2000;
            this._daysCountDict = new Dictionary({
                1: 31,
                2: 29,
                3: 31,
                4: 30,
                5: 31,
                6: 30,
                7: 31,
                8: 31,
                9: 30,
                10: 31,
                11: 30,
                12: 31
            });
            this._value = null;
            this._selectedComponent = 0 /* months */;
            this._numericKeyStrokesCount = 0;
            this._monthsCharactersBuffer = null;
            this._daysCharactersBuffer = null;
            this._yearsCharactersBuffer = null;
            if (!$element.is('input')) {
                throw new InvalidArgumentException("DateInputView can only be constructed from a HTML input element.");
            }
            this._value = this._$el.data("logical_value") || DateTime.fromUnix(0);
            this.attachEventHandler(BrowserEvents.mouseDown, function (ev) {
                ev.preventDefault();
            });
            this.attachEventHandler(BrowserEvents.keyDown, function (ev) {
                var keyCode = ev.keyCode || ev.which;
                switch (keyCode) {
                    case 9 /* tab */:
                        _this.handleTabCharacter(ev);
                        break;
                    case 48 /* zero */:
                    case 96 /* zeroNumPad */:
                    case 49 /* one */:
                    case 97 /* oneNumPad */:
                    case 50 /* two */:
                    case 98 /* twoNumPad */:
                    case 51 /* three */:
                    case 99 /* threeNumPad */:
                    case 52 /* four */:
                    case 100 /* fourNumPad */:
                    case 53 /* five */:
                    case 101 /* fiveNumPad */:
                    case 54 /* six */:
                    case 102 /* sixNumPad */:
                    case 55 /* seven */:
                    case 103 /* sevenNumPad */:
                    case 56 /* eight */:
                    case 104 /* eightNumPad */:
                    case 57 /* nine */:
                    case 105 /* nineNumPad */:
                        _this.handleNumericCharacters(ev);
                        break;
                    case 38 /* up */:
                    case 40 /* down */:
                        _this.handleVerticalArrowCharacter(ev, keyCode);
                        break;
                    case 13 /* enter */:
                        _this.handleEnterCharacter(ev);
                        break;
                    default:
                        ev.preventDefault();
                }
            });
            this.refresh();
        }
        Object.defineProperty(DateInputView.prototype, "daysCountDict", {
            get: function () {
                return this._daysCountDict;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DateInputView.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DateInputView.prototype, "inputElement", {
            get: function () {
                return this._$el[0];
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DateInputView.prototype, "selectedComponent", {
            get: function () {
                return this._selectedComponent;
            },
            set: function (value) {
                this._selectedComponent = value;
                this.refreshSelection();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DateInputView.prototype, "numericKeyStrokesCount", {
            get: function () {
                return this._numericKeyStrokesCount;
            },
            set: function (value) {
                this._numericKeyStrokesCount = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DateInputView.prototype, "monthsCharactersBuffer", {
            get: function () {
                return this._monthsCharactersBuffer;
            },
            set: function (value) {
                if (value.length === 1) {
                    this._monthsCharactersBuffer = '0' + value;
                } else {
                    this._monthsCharactersBuffer = value;
                }
                this.refreshWithCharBuffer();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DateInputView.prototype, "daysCharactersBuffer", {
            get: function () {
                return this._daysCharactersBuffer;
            },
            set: function (value) {
                if (value.length === 1) {
                    this._daysCharactersBuffer = '0' + value;
                } else {
                    this._daysCharactersBuffer = value;
                }
                this.refreshWithCharBuffer();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DateInputView.prototype, "yearsCharactersBuffer", {
            get: function () {
                return this._yearsCharactersBuffer;
            },
            set: function (value) {
                while (value.length < 4) {
                    value = '0' + value;
                }
                this._yearsCharactersBuffer = value;
                this.refreshWithCharBuffer();
            },
            enumerable: true,
            configurable: true
        });


        DateInputView.prototype.handleEnterCharacter = function (ev) {
            // don't prevent default
            this.blur();
        };

        DateInputView.prototype.handleNumericCharacters = function (ev) {
            ev.preventDefault();
            var inputChar = String.fromCharCode(ev.keyCode || ev.which);
            var shouldMoveForward = false;
            switch (this.selectedComponent) {
                case 0 /* months */:
                    shouldMoveForward = this.appendNumericInputForMonths(inputChar);
                    break;
                case 1 /* days */:
                    shouldMoveForward = this.appendNumericInputForDays(inputChar);
                    break;
                case 2 /* years */:
                    shouldMoveForward = this.appendNumericInputForYears(inputChar);
                    break;
                default:
                    throw new AssertionException("should never get here");
                    break;
            }

            // move to the next field automatically if the user has entered enough key strokes
            if (shouldMoveForward) {
                this.numericKeyStrokesCount = 0;
                ++this.selectedComponent;
            }
        };

        DateInputView.prototype.appendNumericInputForMonths = function (inputChar) {
            ++this.numericKeyStrokesCount;
            if (this.numericKeyStrokesCount === 1) {
                // first time pressing the keys. replace all the characters in buffer - this is more natural
                this.monthsCharactersBuffer = inputChar;
            } else {
                this.monthsCharactersBuffer = this.monthsCharactersBuffer.charAt(1) + inputChar;

                // if the key is not valid, we must make sure not to move to the next field.
                if (!this.validateMonthsBuffer()) {
                    --this.numericKeyStrokesCount;
                }
            }
            return this.numericKeyStrokesCount >= 2;
        };

        DateInputView.prototype.appendNumericInputForDays = function (inputChar) {
            ++this.numericKeyStrokesCount;
            if (this.numericKeyStrokesCount === 1) {
                this.daysCharactersBuffer = inputChar;
            } else {
                this.daysCharactersBuffer = this.daysCharactersBuffer.charAt(1) + inputChar;
                if (!this.validateDaysBuffer()) {
                    --this.numericKeyStrokesCount;
                }
            }
            return this.numericKeyStrokesCount >= 2;
        };

        DateInputView.prototype.appendNumericInputForYears = function (inputChar) {
            ++this.numericKeyStrokesCount;
            if (this.numericKeyStrokesCount === 1) {
                this.yearsCharactersBuffer = inputChar;
            } else {
                this.yearsCharactersBuffer = this.yearsCharactersBuffer.substr(1) + inputChar;
                if (!this.validateYearsBuffer() && this.numericKeyStrokesCount === 4) {
                    --this.numericKeyStrokesCount;
                }
            }
            return false;
        };

        DateInputView.prototype.handleVerticalArrowCharacter = function (ev, keyCode) {
            ev.preventDefault();
            this.numericKeyStrokesCount = 0;
            switch (this.selectedComponent) {
                case 0 /* months */:
                    var curVal = parseInt(this.monthsCharactersBuffer);
                    keyCode === 38 /* up */ ? ++curVal : --curVal;
                    while (curVal < 0) {
                        curVal += 12;
                    }
                    curVal %= 12;
                    if (curVal === 0) {
                        curVal = 12;
                    }
                    this.monthsCharactersBuffer = curVal.toString();
                    break;
                case 1 /* days */:
                    var curVal = parseInt(this.daysCharactersBuffer);
                    keyCode === 38 /* up */ ? ++curVal : --curVal;
                    var limit = this.daysCountDict.get(parseInt(this.monthsCharactersBuffer).toString());
                    while (curVal < 0) {
                        curVal += limit;
                    }
                    curVal %= limit;
                    this.daysCharactersBuffer = curVal.toString();
                    break;
                case 2 /* years */:
                    var curVal = parseInt(this.yearsCharactersBuffer);
                    keyCode === 38 /* up */ ? ++curVal : --curVal;
                    if (curVal > this.MAX_YEARS) {
                        curVal = this.MIN_YEARS + 1;
                    } else if (curVal <= this.MIN_YEARS) {
                        curVal = this.MAX_YEARS;
                    }
                    this.yearsCharactersBuffer = curVal.toString();
                    break;
                default:
                    throw new AssertionException("should never get here");
                    break;
            }
        };

        DateInputView.prototype.handleTabCharacter = function (ev) {
            this.numericKeyStrokesCount = 0;
            this.verifyAndFixSelection();
            if (ev.shiftKey) {
                if (this.selectedComponent != 0 /* months */) {
                    --this.selectedComponent;
                    ev.preventDefault();
                }
            } else {
                if (this.selectedComponent != 2 /* years */) {
                    ++this.selectedComponent;
                    ev.preventDefault();
                }
            }
        };

        DateInputView.prototype.validateMonthsBuffer = function () {
            return parseInt(this.monthsCharactersBuffer) <= 12 && parseInt(this.monthsCharactersBuffer) > 0;
        };

        DateInputView.prototype.validateDaysBuffer = function () {
            var value = parseInt(this.daysCharactersBuffer);
            var limit = this.daysCountDict.get(parseInt(this.monthsCharactersBuffer).toString());
            return value <= limit && value > 0;
        };

        DateInputView.prototype.validateYearsBuffer = function () {
            var value = parseInt(this.yearsCharactersBuffer);
            return value <= this.MAX_YEARS && value > this.MIN_YEARS;
        };

        DateInputView.prototype.refresh = function () {
            this.monthsCharactersBuffer = (this.value.month + 1).toString();
            this.daysCharactersBuffer = this.value.date.toString();
            this.yearsCharactersBuffer = this.value.year.toString();
            this._$el.data("logical_value", this.value);
        };

        DateInputView.prototype.save = function () {
            this.value.year = parseInt(this.yearsCharactersBuffer);
            this.value.month = parseInt(this.monthsCharactersBuffer) - 1;
            this.value.date = parseInt(this.daysCharactersBuffer);
        };

        DateInputView.prototype.refreshSelection = function () {
            // 3 because there is a space or a colon. -1 makes sure we don't select that part.
            if (this.selectedComponent !== 2 /* years */) {
                this.inputElement.setSelectionRange(this.selectedComponent * 3, (this.selectedComponent + 1) * 3 - 1);
            } else {
                this.inputElement.setSelectionRange(this.selectedComponent * 3, (this.selectedComponent + 1) * 3 + 1);
            }
        };

        DateInputView.prototype.refreshWithCharBuffer = function () {
            this._$el.val(this.monthsCharactersBuffer + "/" + this.daysCharactersBuffer + "/" + this.yearsCharactersBuffer);
            this.refreshSelection();
        };

        DateInputView.prototype.didFocus = function () {
            _super.prototype.didFocus.call(this);
            this.refreshSelection();
        };

        DateInputView.prototype.didBlur = function () {
            _super.prototype.didBlur.call(this);
            this.verifyAndFixSelection();
            this.save();
        };

        DateInputView.prototype.verifyAndFixSelection = function () {
            switch (this.selectedComponent) {
                case 0 /* months */:
                    if (!this.validateMonthsBuffer()) {
                        this.monthsCharactersBuffer = "09";
                    }
                    break;
                case 1 /* days */:
                    if (!this.validateDaysBuffer()) {
                        this.daysCharactersBuffer = "15";
                    }
                    break;
                case 2 /* years */:
                    if (!this.validateYearsBuffer()) {
                        this.yearsCharactersBuffer = "2014";
                    }
                    break;
            }
        };
        return DateInputView;
    })(FocusableView);

    
    return DateInputView;
});
//# sourceMappingURL=DateInputView.js.map
