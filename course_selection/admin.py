from django.contrib import admin
from course_selection.models import *

class SemesterAdmin(admin.ModelAdmin):
    model = Semester
    list_display = ('term_code', 'start_date', 'end_date', )

class CourseListingInline(admin.TabularInline):
    model = Course_Listing
    can_delete = False

class ProfessorInLine(admin.TabularInline):
    model = Course.professors.through
    readonly_fields = ['prof_name']

    def prof_name(self, instance):
        return instance.professor.name
    prof_name.short_description = 'prof name'

class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = (CourseListingInline, ProfessorInLine)
    list_display = ('__unicode__', 'title', 'course_listings', )
    list_filter = ('semester', )
    ordering = ('-title', )
    search_fields = ['title']

class ScheduleAdmin(admin.ModelAdmin):
    model = Schedule
    list_display = ('title', 'user', 'semester', )
    list_filter = ('semester', 'user', )
    search_fields = ['user__netid']

class ProfessorAdmin(admin.ModelAdmin):
    model = Professor
    list_display = ('name', )
    search_fields = ['name']

class FriendRelationshipFromInline(admin.TabularInline):
    model = Friend_Relationship
    fk_name = 'from_user'
    verbose_name = 'friend-relationship-from'
    extra = 1

class FriendRelationshipToInline(admin.TabularInline):
    model = Friend_Relationship
    fk_name = 'to_user'
    verbose_name = 'friend-relationship-to'
    extra = 1

class Nice_UserAdmin(admin.ModelAdmin):
    model = Nice_User
    inlines = [FriendRelationshipFromInline, FriendRelationshipToInline, ]
    excludes = ('friends')
    list_display = ('netid', )

admin.site.register(Semester, SemesterAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Section)
admin.site.register(Meeting)
admin.site.register(Nice_User, Nice_UserAdmin)
admin.site.register(Professor, ProfessorAdmin)
admin.site.register(Color_Palette)
admin.site.register(Course, CourseAdmin)
