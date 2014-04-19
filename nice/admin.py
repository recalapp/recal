from django.contrib import admin

# Register your models here.
from nice.models import *

admin.site.register(Event)
admin.site.register(Event_Group)
admin.site.register(Event_Group_Revision)
admin.site.register(Event_Revision)
admin.site.register(Course)
admin.site.register(Section)
admin.site.register(User_Section_Table)
admin.site.register(Semester)

# Define an inline admin descriptor for UserProfile model
# which acts a bit like a singleton -- see https://docs.djangoproject.com/en/1.6/topics/auth/customizing/

from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

class ProfileInline(admin.StackedInline):
    model = User_Profile
    can_delete = False
    verbose_name_plural = 'student'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (ProfileInline, )

class SemesterAdmin(admin.ModelAdmin):
    model = Semester
    list_display = ('term_code', 'start_date', 'end_date', )

class CourseAdmin(admin.ModelAdmin):
    model = Course
    list_display = ('__unicode__', 'title', 'course_listings', )
    list_filter  = ('semester', )
    ordering = ('-title',)
    search_fields = ['title']

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.unregister(Course)
admin.site.register(Course, CourseAdmin)
admin.site.unregister(Semester)
admin.site.register(Semester, SemesterAdmin)
