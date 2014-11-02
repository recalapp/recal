from tastypie.resources import ModelResource
from tastypie.cache import SimpleCache
from tastypie import fields
from course_selection.models import *

class SemesterResource(ModelResource):
    class Meta:
        queryset = Semester.objects.all()
        resource_name = 'semester'
        excludes = []
        allowed_methods = ['get']

class CourseListingResource(ModelResource):
    course = fields.ForeignKey('course_selection.api.CourseResource', 'course')

    class Meta:
        queryset = Course_Listing.objects.all()
        resource_name = 'course_listing'
        excludes = ['course', 'id']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class CourseResource(ModelResource):
    semester = fields.ForeignKey(SemesterResource, 'semester', full=True)
    course_listings = fields.ToManyField(CourseListingResource, 'course_listings', null=True, full=True)
    sections = fields.ToManyField('course_selection.api.SectionResource', 'sections', full=True)

    class Meta:
        queryset = Course.objects.all()
        resource_name = 'course'
        excludes = []
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class SectionResource(ModelResource):
    course = fields.ForeignKey(CourseResource, 'course')
    meetings = fields.ToManyField('course_selection.api.MeetingResource', 'meetings', full=True)

    class Meta:
        queryset = Section.objects.all()
        resource_name = 'section'
        excludes = ['isDefault']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class MeetingResource(ModelResource):
    section = fields.ForeignKey(SectionResource, 'section')

    class Meta:
        queryset = Meeting.objects.all()
        resource_name = 'meeting'
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)
