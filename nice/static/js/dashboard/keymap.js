var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SQ_BRACE_R = 221;
var KEY_SQ_BRACE_L = 219;
var KEY_SHIFT = 16;
var SHIFT_PRESSED = false;
$(document).keydown(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_UP:
            break;
        case KEY_DOWN:
            break;
        case KEY_LEFT:
            break;
        case KEY_RIGHT:
            break;
        case KEY_SQ_BRACE_R:
            $("#calendartab").tab('show');
            //Cal_init();
            break;
        case KEY_SQ_BRACE_L:
            $("#agendatab").tab('show');
            break;
        case KEY_SHIFT:
            SHIFT_PRESSED = true;
            break;
    }
});
$(document).keyup(function(e){
    var keyCode = e.keyCode || e.which;
    switch (keyCode)
    {
        case KEY_SHIFT:
            SHIFT_PRESSED = false;
            break;
    }
});
