define(["require", "exports", '../Core/InvalidArgumentException'], function(require, exports, InvalidArgumentException) {
    var Timer = (function () {
        function Timer(action, interval) {
            if (interval < 0) {
                throw new InvalidArgumentException("Intervals must be nonnegative");
            }
            setTimeout(action, interval);
        }
        return Timer;
    })();
    
    return Timer;
});
