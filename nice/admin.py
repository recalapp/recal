from django.contrib import admin

# Register your models here.
from nice.models import *

admin.site.register(Event)
admin.site.register(Event_Group)
admin.site.register(Event_Group_Revision)
admin.site.register(Event_Revision)
admin.site.register(User_Section_Table)

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

class CourseListingInline(admin.StackedInline):
    model = Course_Listing
    can_delete = False

class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = (CourseListingInline, )
    list_display = ('__unicode__', 'title', 'course_listings', )
    list_filter  = ('semester', )
    ordering = ('-title',)
    search_fields = ['title']

class SectionAdmin(admin.ModelAdmin):
    model = Section
    list_display = ('__unicode__', 'course')
    list_filter  = ('course', )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Semester, SemesterAdmin)
admin.site.register(Section, SectionAdmin)
