function Cal_init() {
    if (CAL_INIT)
        return;
    CAL_INIT = true;
    var height = '410';//window.innerHeight * 0.6;
    Cal_options.height = height;
    Cal_options.header = false;
    Cal_options.columnFormat = {
        month: 'ddd',    // Mon
        week: 'ddd', // Mon
        day: 'dddd M/d'  // Monday 9/7
    }
    $('#calendarui').fullCalendar(Cal_options);
}
