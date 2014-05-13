KEY_UP = 38;
KEY_DOWN = 40;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_SQ_BRACE_R = 221;
KEY_SQ_BRACE_L = 219;
KEY_SHIFT = 16;
var SHIFT_PRESSED = false;
$(document).keydown(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_SHIFT:
            SHIFT_PRESSED = true;
            break;
    }
});
$(document).keyup(function(){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_SHIFT:
            SHIFT_PRESSED = false;
            break;
    }
});
