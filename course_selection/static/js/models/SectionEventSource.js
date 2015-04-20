define(["require", "exports"], function(require, exports) {
    var SectionEventSource = (function () {
        function SectionEventSource(section, course, colors) {
            this.id = section.id;
            this.course_id = course.id;
            this.textColor = colors.dark;
            this.borderColor = colors.dark;
            this.backgroundColor = colors.light;
            this.section_type = section.section_type;
            this.section_capacity = section.section_capacity;
            this.section_enrollment = section.section_enrollment;

            // by default, a newly constructed section is previewed until enrolled"
            this.className = "cal-unconfirmed";

            // for tooltip display
            var tooltipEnrollment = this.section_enrollment + "/" + this.section_capacity;

            var inputTimeFormat = "hh:mm a";
            var outputTimeFormat = "HH:mm:ss";
            this.events = [];
            for (var j = 0; j < section.meetings.length; j++) {
                var meeting = section.meetings[j];
                var days = meeting.days.split(' ');
                var numDays = days[days.length - 1] ? days.length : days.length - 1;

                for (var k = 0; k < numDays; k++) {
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
                        location: meeting.location,
                        enrollment: tooltipEnrollment
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
            var date = moment().add(diff, 'days').format('YYYY-MM-DD');
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
