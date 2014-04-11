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

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
