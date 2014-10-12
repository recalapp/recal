/// <reference path="../../typings/tsd.d.ts" />

import AssertionException = require('../Core/AssertionException');
import BrowserEvents = require('../Core/BrowserEvents');
import CustomInputs = require('./CustomInputs');
import DateTime = require('../DateTime/DateTime');
import Dictionary = require('../DataStructures/Dictionary');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import Date = require('../DateTime/Date');

import IDateInputView = CustomInputs.IDateInputView;

enum DateSelectionComponent
{
    months = 0, days = 1, years = 2
}
enum KeyCode
{
    left = 37, up = 38, right = 39, down = 40,
    enter = 13,
    tab = 9,
    zero = 48, one = 49, two = 50, three = 51, four = 52, five = 53, six = 54, seven = 55, eight = 56, nine = 57,
    zeroNumPad = 96, oneNumPad = 97, twoNumPad = 98, threeNumPad = 99, fourNumPad = 100,
    fiveNumPad = 101, sixNumPad = 102, sevenNumPad = 103, eightNumPad = 104, nineNumPad = 105,
    a = 65, p = 80,
}

class DateInputView extends FocusableView implements IDateInputView
{
    private MAX_YEARS = 2100;
    private MIN_YEARS = 2000;

    private _daysCountDict = new Dictionary<string, number>((a, b)=>{return a === b;}, {
        1: 31,
        2: 29, // TODO handle leap year
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
    private get daysCountDict(): Dictionary<string, number> { return this._daysCountDict; }

    private _value: Date = null;
    public get value(): Date { return this._value; }

    public set value(value: Date)
    {
        this._value = value;
        this.refresh();
    }

    private get inputElement(): HTMLInputElement
    {
        return <HTMLInputElement>this._$el[0];
    }

    private _selectedComponent: DateSelectionComponent = DateSelectionComponent.months;
    private get selectedComponent(): DateSelectionComponent { return this._selectedComponent; }

    private set selectedComponent(value: DateSelectionComponent)
    {
        this._selectedComponent = value;
        this.refreshSelection();
    }

    private _numericKeyStrokesCount = 0;
    private get numericKeyStrokesCount(): number { return this._numericKeyStrokesCount; }

    private set numericKeyStrokesCount(value: number)
    {
        this._numericKeyStrokesCount = value;
    }

    private _monthsCharactersBuffer: string = null;
    private get monthsCharactersBuffer(): string { return this._monthsCharactersBuffer; }

    private set monthsCharactersBuffer(value: string)
    {
        if (value.length === 1)
        {
            this._monthsCharactersBuffer = '0' + value;
        }
        else
        {
            this._monthsCharactersBuffer = value;
        }
        this.refreshWithCharBuffer();
    }

    private _daysCharactersBuffer: string = null;
    private get daysCharactersBuffer(): string { return this._daysCharactersBuffer; }

    private set daysCharactersBuffer(value: string)
    {
        if (value.length === 1)
        {
            this._daysCharactersBuffer = '0' + value;
        }
        else
        {
            this._daysCharactersBuffer = value;
        }
        this.refreshWithCharBuffer();
    }

    private _yearsCharactersBuffer: string = null;
    private get yearsCharactersBuffer(): string { return this._yearsCharactersBuffer; }

    private set yearsCharactersBuffer(value: string)
    {
        while (value.length < 4)
        {
            value = '0' + value;
        }
        this._yearsCharactersBuffer = value;
        this.refreshWithCharBuffer();
    }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        if (!$element.is('input'))
        {
            throw new InvalidArgumentException(
                "DateInputView can only be constructed from a HTML input element."
            );
        }
        this._value = this._$el.data("logical_value") || DateTime.fromUnix(0);
        this.attachEventHandler(BrowserEvents.mouseDown,
            (ev: JQueryEventObject)=>
            {
                ev.preventDefault();
            });
        this.attachEventHandler(BrowserEvents.keyDown, (ev: JQueryEventObject)=>
        {
            var keyCode = ev.keyCode || ev.which;
            switch (keyCode)
            {
                case KeyCode.tab:
                    this.handleTabCharacter(ev);
                    break;
                case KeyCode.zero:
                case KeyCode.zeroNumPad:
                case KeyCode.one:
                case KeyCode.oneNumPad:
                case KeyCode.two:
                case KeyCode.twoNumPad:
                case KeyCode.three:
                case KeyCode.threeNumPad:
                case KeyCode.four:
                case KeyCode.fourNumPad:
                case KeyCode.five:
                case KeyCode.fiveNumPad:
                case KeyCode.six:
                case KeyCode.sixNumPad:
                case KeyCode.seven:
                case KeyCode.sevenNumPad:
                case KeyCode.eight:
                case KeyCode.eightNumPad:
                case KeyCode.nine:
                case KeyCode.nineNumPad:
                    this.handleNumericCharacters(ev);
                    break;
                case KeyCode.up:
                case KeyCode.down:
                    this.handleVerticalArrowCharacter(ev, keyCode);
                    break;
                case KeyCode.enter:
                    this.handleEnterCharacter(ev);
                    break;
                default:
                    ev.preventDefault();
            }
        });
        this.refresh();
    }

    private handleEnterCharacter(ev: JQueryEventObject)
    {
        // don't prevent default
        this.blur();
    }

    private handleNumericCharacters(ev: JQueryEventObject)
    {
        ev.preventDefault();
        var inputChar = String.fromCharCode(ev.keyCode || ev.which);
        var shouldMoveForward = false;
        switch (this.selectedComponent)
        {
            case DateSelectionComponent.months:
                shouldMoveForward = this.appendNumericInputForMonths(inputChar);
                break;
            case DateSelectionComponent.days:
                shouldMoveForward = this.appendNumericInputForDays(inputChar);
                break;
            case DateSelectionComponent.years:
                shouldMoveForward = this.appendNumericInputForYears(inputChar);
                break;
            default:
                throw new AssertionException("should never get here");
                break;
        }
        // move to the next field automatically if the user has entered enough key strokes
        if (shouldMoveForward)
        {
            this.numericKeyStrokesCount = 0;
            ++this.selectedComponent;
        }
    }

    private appendNumericInputForMonths(inputChar: string): boolean
    {
        ++this.numericKeyStrokesCount;
        if (this.numericKeyStrokesCount === 1)
        {
            // first time pressing the keys. replace all the characters in buffer - this is more natural
            this.monthsCharactersBuffer = inputChar;
        }
        else
        {
            this.monthsCharactersBuffer =
            this.monthsCharactersBuffer.charAt(1) + inputChar;
            // if the key is not valid, we must make sure not to move to the next field.
            if (!this.validateMonthsBuffer())
            {
                --this.numericKeyStrokesCount;
            }
        }
        return this.numericKeyStrokesCount >= 2;
    }

    private appendNumericInputForDays(inputChar: string)
    {
        ++this.numericKeyStrokesCount;
        if (this.numericKeyStrokesCount === 1)
        {
            this.daysCharactersBuffer = inputChar;
        }
        else
        {
            this.daysCharactersBuffer =
            this.daysCharactersBuffer.charAt(1) + inputChar;
            if (!this.validateDaysBuffer())
            {
                --this.numericKeyStrokesCount;
            }
        }
        return this.numericKeyStrokesCount >= 2;
    }

    private appendNumericInputForYears(inputChar: string)
    {
        ++this.numericKeyStrokesCount;
        if (this.numericKeyStrokesCount === 1)
        {
            this.yearsCharactersBuffer = inputChar;
        }
        else
        {
            this.yearsCharactersBuffer =
            this.yearsCharactersBuffer.substr(1) + inputChar;
            if (!this.validateYearsBuffer() && this.numericKeyStrokesCount
                === 4)
            {
                --this.numericKeyStrokesCount;
            }
        }
        return false; // never move forward automatically
    }

    private handleVerticalArrowCharacter(ev: JQueryEventObject,
                                         keyCode: KeyCode)
    {
        ev.preventDefault();
        this.numericKeyStrokesCount = 0;
        switch (this.selectedComponent)
        {
            case DateSelectionComponent.months:
                var curVal = parseInt(this.monthsCharactersBuffer);
                keyCode === KeyCode.up ? ++curVal : --curVal;
                while (curVal < 0)
                {
                    curVal += 12;
                }
                curVal %= 12;
                if (curVal === 0)
                {
                    curVal = 12;
                }
                this.monthsCharactersBuffer = curVal.toString();
                break;
            case DateSelectionComponent.days:
                var curVal = parseInt(this.daysCharactersBuffer);
                keyCode === KeyCode.up ? ++curVal : --curVal;
                var limit = this.daysCountDict.get(parseInt(this.monthsCharactersBuffer).toString());
                while (curVal < 0)
                {
                    curVal += limit;
                }
                curVal %= limit;
                this.daysCharactersBuffer = curVal.toString();
                break;
            case DateSelectionComponent.years:
                var curVal = parseInt(this.yearsCharactersBuffer);
                keyCode === KeyCode.up ? ++curVal : --curVal;
                if (curVal > this.MAX_YEARS)
                {
                    curVal = this.MIN_YEARS + 1;
                }
                else if (curVal <= this.MIN_YEARS)
                {
                    curVal = this.MAX_YEARS;
                }
                this.yearsCharactersBuffer = curVal.toString();
                break;
            default:
                throw new AssertionException("should never get here");
                break;
        }
    }

    private handleTabCharacter(ev: JQueryEventObject)
    {
        this.numericKeyStrokesCount = 0;
        this.verifyAndFixSelection();
        if (ev.shiftKey)
        {
            if (this.selectedComponent != DateSelectionComponent.months)
            {
                --this.selectedComponent;
                ev.preventDefault();
            }
        }
        else
        {
            if (this.selectedComponent != DateSelectionComponent.years)
            {
                ++this.selectedComponent;
                ev.preventDefault();
            }
        }

    }

    private validateMonthsBuffer(): boolean
    {
        return parseInt(this.monthsCharactersBuffer) <= 12
            && parseInt(this.monthsCharactersBuffer) > 0;
    }

    private validateDaysBuffer(): boolean
    {
        var value = parseInt(this.daysCharactersBuffer);
        var limit = this.daysCountDict.get(parseInt(this.monthsCharactersBuffer).toString());
        return value <= limit && value > 0;
    }

    private validateYearsBuffer(): boolean
    {
        var value = parseInt(this.yearsCharactersBuffer);
        return value <= this.MAX_YEARS && value > this.MIN_YEARS;
    }

    private refresh(): void
    {
        this.monthsCharactersBuffer = (this.value.month + 1).toString();
        this.daysCharactersBuffer = this.value.date.toString();
        this.yearsCharactersBuffer = this.value.year.toString();
        this._$el.data("logical_value", this.value);
    }

    private save(): void
    {
        this.value.year = parseInt(this.yearsCharactersBuffer);
        this.value.month = parseInt(this.monthsCharactersBuffer) - 1;
        this.value.date = parseInt(this.daysCharactersBuffer);
    }

    private refreshSelection(): void
    {
        // 3 because there is a space or a colon. -1 makes sure we don't select that part.
        if (this.selectedComponent !== DateSelectionComponent.years)
        {
            this.inputElement.setSelectionRange(this.selectedComponent * 3,
                    (this.selectedComponent + 1) * 3 - 1);
        }
        else
        {
            this.inputElement.setSelectionRange(this.selectedComponent * 3,
                    (this.selectedComponent + 1) * 3 + 1)
        }
    }

    private refreshWithCharBuffer(): void
    {
        this._$el.val(this.monthsCharactersBuffer + "/"
                          + this.daysCharactersBuffer + "/"
            + this.yearsCharactersBuffer);
        this.refreshSelection();
    }

    public didFocus(): void
    {
        super.didFocus();
        this.refreshSelection();
    }

    public didBlur(): void
    {
        super.didBlur();
        this.verifyAndFixSelection();
        this.save();
    }

    private verifyAndFixSelection(): void
    {
        switch (this.selectedComponent)
        {
            case DateSelectionComponent.months:
                if (!this.validateMonthsBuffer())
                {
                    this.monthsCharactersBuffer = "09";
                }
                break;
            case DateSelectionComponent.days:
                if (!this.validateDaysBuffer())
                {
                    this.daysCharactersBuffer = "15";
                }
                break;
            case DateSelectionComponent.years:
                if (!this.validateYearsBuffer())
                {
                    this.yearsCharactersBuffer = "2014";
                }
                break;
        }
    }
}

export = DateInputView;