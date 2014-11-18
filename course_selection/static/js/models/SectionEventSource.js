define(["require", "exports"], function(require, exports) {
    var SectionEventSource = (function () {
        function SectionEventSource(section, course, color) {
            this.id = section.id;
            this.color = color;
            this.section_type = section.section_type;

            var inputTimeFormat = "hh:mm a";
            var outputTimeFormat = "HH:mm:ss";
            this.events = [];
            for (var j = 0; j < section.meetings.length; j++) {
                var meeting = section.meetings[j];
                var days = meeting.days.split(' ');

                for (var k = 0; k < days.length - 1; k++) {
                    var day = days[k];
                    var date = this.getAgendaDate(day);
                    var startTime = moment(meeting.start_time, inputTimeFormat).format(outputTimeFormat);
                    var endTime = moment(meeting.end_time, inputTimeFormat).format(outputTimeFormat);
                    var start = date + 'T' + startTime;
                    var end = date + 'T' + endTime;
                    this.events.push({
                        title: course.primary_listing + " " + section.name,
                        start: start,
                        end: end,
                        location: meeting.location
                    });
                }
            }
        }
        /**
        * gets the date of the day in the current week
        */
        SectionEventSource.prototype.getAgendaDate = function (day) {
            var todayOffset = moment().isoWeekday();
            var dayOffset = SectionEventSource.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().add('days', diff).format('YYYY-MM-DD');
            return date;
        };
        SectionEventSource.DAYS = {
            'M': 1,
            'T': 2,
            'W': 3,
            'Th': 4,
            'F': 5
        };
        return SectionEventSource;
    })();

    
    return SectionEventSource;
});
