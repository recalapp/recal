/// <reference path="../../typings/tsd.d.ts" />

import AssertionException = require('../Core/AssertionException');
import BrowserEvents = require('../Core/BrowserEvents');
import CustomInputs = require('./CustomInputs');
import DateTime = require('../DateTime/DateTime');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import Time = require('../DateTime/Time');

import ITimeInputView = CustomInputs.ITimeInputView;

enum TimeSelectionComponent
{
    hours = 0, minutes = 1, periods = 2
}
enum KeyCode
{
    left=37, up=38, right=39, down=40,
    enter=13,
    tab = 9,
    zero=48,one=49,two=50,three=51,four=52,five=53,six=54,seven=55,eight=56,nine=57,
    zeroNumPad=96,oneNumPad=97,twoNumPad=98,threeNumPad=99,fourNumPad=100,
    fiveNumPad=101,sixNumPad=102,sevenNumPad=103,eightNumPad=104,nineNumPad=105,
    a=65,p=80,
}

class TimeInputView extends FocusableView implements ITimeInputView
{
    private _value: Time = null;
    public get value(): Time { return this._value; }

    public set value(value: Time)
    {
        this._value = value;
        this.refresh();
    }

    private get inputElement(): HTMLInputElement
    {
        return <HTMLInputElement>this._$el[0];
    }

    private _selectedComponent: TimeSelectionComponent = TimeSelectionComponent.hours;
    private get selectedComponent(): TimeSelectionComponent { return this._selectedComponent; }

    private set selectedComponent(value: TimeSelectionComponent)
    {
        this._selectedComponent = value;
        this.refreshSelection();
    }

    private _numericKeyStrokesCount = 0;
    private get numericKeyStrokesCount(): number { return this._numericKeyStrokesCount; }
    private set numericKeyStrokesCount(value: number) { this._numericKeyStrokesCount = value; }

    private _hoursCharactersBuffer: string = null;
    private get hoursCharactersBuffer(): string { return this._hoursCharactersBuffer; }
    private set hoursCharactersBuffer(value: string)
    {
        if (value.length === 1)
        {
            this._hoursCharactersBuffer = '0' + value;
        }
        else
        {
            this._hoursCharactersBuffer = value;
        }
        this.refreshWithCharBuffer();
    }

    private _minutesCharactersBuffer: string = null;
    private get minutesCharactersBuffer(): string { return this._minutesCharactersBuffer; }
    private set minutesCharactersBuffer(value: string)
    {
        if (value.length === 1)
        {
            this._minutesCharactersBuffer = '0' + value;
        }
        else
        {
            this._minutesCharactersBuffer = value;
        }
        this.refreshWithCharBuffer();
    }

    private _periodsCharacterBuffer: string = null;
    private get periodsCharacterBuffer(): string { return this._periodsCharacterBuffer; }
    private set periodsCharacterBuffer(value: string)
    {
        this._periodsCharacterBuffer = value;
        this.refreshWithCharBuffer();
    }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        if (!$element.is('input'))
        {
            throw new InvalidArgumentException(
                "TimeInputView can only be constructed from a HTML input element."
            );
        }
        this._value = this._$el.data("logical_value") || DateTime.fromUnix(0);
        this.attachEventHandler(BrowserEvents.mouseDown, (ev: JQueryEventObject)=>{
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
                case KeyCode.a:
                case KeyCode.p:
                    this.handlePeriodCharacter(ev);
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
        if (this.selectedComponent === TimeSelectionComponent.periods)
        {
            return;
        }
        ++this.numericKeyStrokesCount;
        var inputChar = String.fromCharCode(ev.keyCode || ev.which);
        if (this.selectedComponent === TimeSelectionComponent.hours)
        {
            if (this.numericKeyStrokesCount === 1)
            {
                // first time pressing the keys. replace all the characters in buffer - this is more natural
                this.hoursCharactersBuffer = inputChar;
            }
            else
            {
                this.hoursCharactersBuffer =
                this.hoursCharactersBuffer.charAt(1) + inputChar;
                // if the key is not valid, we must make sure not to move to the next field.
                if (!this.validateHoursBuffer())
                {
                    --this.numericKeyStrokesCount;
                }
            }
        }
        else
        {
            if (this.numericKeyStrokesCount === 1)
            {
                this.minutesCharactersBuffer = inputChar;
            }
            else
            {
                this.minutesCharactersBuffer =
                this.minutesCharactersBuffer.charAt(1) + inputChar;
                if (!this.validateMinutesBuffer())
                {
                    --this.numericKeyStrokesCount;
                }
            }
        }
        // move to the next field automatically if the user has entered two key strokes
        if (this.numericKeyStrokesCount >= 2)
        {
            this.numericKeyStrokesCount = 0;
            ++this.selectedComponent;
        }
    }

    private handleVerticalArrowCharacter(ev: JQueryEventObject, keyCode: KeyCode)
    {
        ev.preventDefault();
        this.numericKeyStrokesCount = 0;
        switch (this.selectedComponent)
        {
            case TimeSelectionComponent.hours:
                var curVal = parseInt(this.hoursCharactersBuffer);
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
                this.hoursCharactersBuffer = curVal.toString();
                break;
            case TimeSelectionComponent.minutes:
                var curVal = parseInt(this.minutesCharactersBuffer);
                keyCode === KeyCode.up ? ++curVal : --curVal;
                while (curVal < 0)
                {
                    curVal += 60;
                }
                curVal %= 60;
                this.minutesCharactersBuffer = curVal.toString();
                break;
            case TimeSelectionComponent.periods:
                this.periodsCharacterBuffer = this.periodsCharacterBuffer === 'AM' ? 'PM':'AM';
                break;
            default:
                throw new AssertionException("should never get here");
                break;
        }
    }

    private handlePeriodCharacter(ev: JQueryEventObject): void
    {
        ev.preventDefault();
        if (this.selectedComponent !== TimeSelectionComponent.periods)
        {
            return;
        }
        var inputChar = String.fromCharCode(ev.keyCode || ev.which).toLowerCase();
        if (inputChar === 'a')
        {
            this.periodsCharacterBuffer = "AM";
        }
        else if (inputChar === 'p')
        {
            this.periodsCharacterBuffer = "PM";
        }
    }

    private handleTabCharacter(ev: JQueryEventObject)
    {
        this.numericKeyStrokesCount = 0;
        switch(this.selectedComponent)
        {
            case TimeSelectionComponent.hours:
                if (!this.validateHoursBuffer())
                {
                    this.hoursCharactersBuffer = "08";
                }
                break;
            case TimeSelectionComponent.minutes:
                if (!this.validateMinutesBuffer())
                {
                    this.minutesCharactersBuffer = "00";
                }
                break;
        }
        if (ev.shiftKey)
        {
            if (this.selectedComponent != TimeSelectionComponent.hours)
            {
                --this.selectedComponent;
                ev.preventDefault();
            }
        }
        else
        {
            if (this.selectedComponent != TimeSelectionComponent.periods)
            {
                ++this.selectedComponent;
                ev.preventDefault();
            }
        }

    }

    private validateHoursBuffer(): boolean
    {
        return parseInt(this.hoursCharactersBuffer) <= 12 && parseInt(this.hoursCharactersBuffer) > 0;
    }
    private validateMinutesBuffer(): boolean
    {
        return parseInt(this.minutesCharactersBuffer) < 60;
    }

    private refresh(): void
    {
        this.hoursCharactersBuffer = (this.value.hours % 12).toString();
        this.minutesCharactersBuffer = this.value.minutes.toString();
        this.periodsCharacterBuffer = parseInt((this.value.hours / 12).toString()) === 1 ? 'PM' : 'AM';
        if (this.periodsCharacterBuffer === 'PM' && this.hoursCharactersBuffer === '00')
        {
            this.hoursCharactersBuffer = '12'; // handle 12PM case, as 12 % 12 = 0
        }
        this._$el.data("logical_value", this.value);
        this.refreshWithCharBuffer();
    }

    private save(): void
    {
        var hours = parseInt(this.hoursCharactersBuffer);
        var minutes = parseInt(this.minutesCharactersBuffer);
        if (this.periodsCharacterBuffer === 'PM' && hours != 12)
        {
            hours += 12;
            if (hours === 24)
            {
                hours = 0;
            }
        }
        this.value.hours = hours;
        this.value.minutes = minutes;
    }

    private refreshSelection(): void
    {
        // 3 because there is a space or a colon. -1 makes sure we don't select that part.
        this.inputElement.setSelectionRange(this.selectedComponent * 3,
                (this.selectedComponent + 1) * 3 - 1);
    }
    private refreshWithCharBuffer(): void
    {
        this._$el.val(this.hoursCharactersBuffer + ":" + this.minutesCharactersBuffer + " " + this.periodsCharacterBuffer);
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
        this.save();
    }
}

export = TimeInputView;