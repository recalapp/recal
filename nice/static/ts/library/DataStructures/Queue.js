define(["require", "exports", '../Core/InvalidActionException'], function(require, exports, InvalidActionException) {
    var Queue = (function () {
        function Queue() {
            this._array = new Array();
        }
        Object.defineProperty(Queue.prototype, "count", {
            get: function () {
                return this._array.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Queue.prototype, "empty", {
            get: function () {
                return this.count === 0;
            },
            enumerable: true,
            configurable: true
        });

        Queue.prototype.enqueue = function (val) {
            this._array.push(val);
        };

        Queue.prototype.dequeue = function () {
            if (this.empty) {
                throw new InvalidActionException('Cannot dequeue an empty queue');
            }
            return this._array.shift();
        };

        Queue.prototype.peek = function () {
            if (this.empty) {
                throw new InvalidActionException('Cannot peek at an empty queue');
            }
            return this._array[0];
        };
        return Queue;
    })();

    
    return Queue;
});
