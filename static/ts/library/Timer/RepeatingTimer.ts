/// <reference path="../../typings/tsd.d.ts" />

import $ = require("jquery");

import InvalidArgumentException = require('../Core/InvalidArgumentException');

class Timer
{
    private _isIdle = false;
    private get isIdle(): boolean { return this._isIdle; }

    private set isIdle(value: boolean) { this._isIdle = value; }

    /**
     * The timeout id of the observer used to check whether or not a system is
     * idle
     * @type {number}
     * @private
     */
    private _observerTimeoutId: number = null;
    private get observerTimeoutId(): number { return this._observerTimeoutId; }

    private set observerTimeoutId(value: number)
    {
        this._observerTimeoutId = value;
    }

    /**
     * The timeout id of the recurring function.
     * @type {number}
     * @private
     */
    private _intervalId: number = null;
    private get intervalId(): number { return this._intervalId; }

    private set intervalId(value: number) { this._intervalId = value; }

    /**
     * The timeout id of the recurring function when idle
     * @type {number}
     * @private
     */
    private _idleIntervalId: number = null;
    private get idleIntervalId(): number { return this._idleIntervalId; }

    private set idleIntervalId(value: number) { this._idleIntervalId = value; }

    constructor(action: ()=>void, interval: number, optionals: { idleInterval?: number; idleTimeout?: number})
    {
        var idleLimit = optionals.idleTimeout || (60 * 1000);
        var idleInterval = optionals.idleInterval;
        if (idleInterval === undefined || idleInterval === null)
        {
            idleInterval = interval;
        }
        if (interval < 0 || idleInterval < 0)
        {
            throw new InvalidArgumentException("Intervals must be nonnegative");
        }
        setInterval(()=>
        {
            if (!this.isIdle)
            {
                action();
            }
        }, interval);
        setInterval(()=>
        {
            if (this.isIdle)
            {
                action();
            }
        }, idleInterval);
        $(window).on('mousemove click keydown', ()=>
        {
            if (this.observerTimeoutId !== null)
            {
                clearTimeout(this.observerTimeoutId);
                this.observerTimeoutId = null;
            }
            this.isIdle = false;
            this.observerTimeoutId = setTimeout(()=> { this.isIdle = true; },
                idleLimit);
        });
    }

    public stop(): void
    {
        if (this.idleIntervalId !== null)
        {
            clearInterval(this.idleIntervalId);
            this.idleIntervalId = null;
        }
        if (this.intervalId !== null)
        {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.observerTimeoutId !== null)
        {
            clearTimeout(this.observerTimeoutId);
            this.observerTimeoutId = null;
        }
    }
}
export = Timer;