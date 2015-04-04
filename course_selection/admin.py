from django.contrib import admin

# Register your models here.
from course_selection.models import *

class SemesterAdmin(admin.ModelAdmin):
    model = Semester
    list_display = ('term_code', 'start_date', 'end_date', )

class CourseListingInline(admin.StackedInline):
    model = Course_Listing
    can_delete = False

class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = (CourseListingInline, )
    list_display = ('__unicode__', 'title', 'course_listings', )
    list_filter  = ('semester', )
    ordering = ('-title', )
    search_fields = ['title']

class ScheduleAdmin(admin.ModelAdmin):
    model = Schedule
    list_display = ('title', 'user', 'semester', )
    list_filter = ('semester', 'user', )
    search_fields = ['user__netid']

admin.site.register(Semester, SemesterAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Section)
admin.site.register(Meeting)
admin.site.register(Nice_User)
admin.site.register(Professor)
admin.site.register(Color_Palette)
admin.site.register(Course, CourseAdmin)
