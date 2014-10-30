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
    course = fields.ForeignKey('course_selection.api.CourseResource', 'course', full=True)

    class Meta:
        queryset = Course_Listing.objects.all()
        resource_name = 'course_listing'
        excludes = []
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class CourseResource(ModelResource):
    semester = fields.ForeignKey(SemesterResource, 'semester')
    course_listings = fields.ToManyField(CourseListingResource, 'course_listing', null=True)

    class Meta:
        queryset = Course.objects.all()
        resource_name = 'course'
        excludes = []
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class SectionResource(ModelResource):
    course = fields.ForeignKey(CourseResource, 'course')

    class Meta:
        queryset = Section.objects.all()
        resource_name = 'section'
        excludes = ['isDefault']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)
