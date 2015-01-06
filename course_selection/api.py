from django.conf.urls import patterns, include, url
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.utils import trailing_slash
from tastypie.cache import SimpleCache
from tastypie.authorization import Authorization
from tastypie.http import HttpGone
from tastypie import fields
from course_selection.models import *

class SemesterResource(ModelResource):
    class Meta:
        queryset = Semester.objects.all()
        resource_name = 'semester'
        excludes = ['']
        allowed_methods = ['get']
        authorization = Authorization()
        filtering = {
            'term_code': ALL
        }
    
    def dehydrate(self, bundle):
        # give the semester a readable name
        term_code = bundle.data['term_code']
        end_year = int(term_code[1:3])
        start_year = end_year - 1
        if int(term_code[-1]) == 2:
            sem = 'Fall'
        else:
            sem = 'Spring'
        name = str(start_year) + '-' + str(end_year) + ' ' + sem

        bundle.data['name'] = name
        return bundle

    def prepend_urls(self):
        return [
            #url(r"^(?P<resource_name>%s)/(?P<term_code>[\w\d_.-]+)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
            #url(r"^(?P<resource_name>%s)/(?P<term_code>[\w\d_.-]+)/course%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_course'), name="api_get_course"),
        ]

    #def get_course(self, request, **kwargs):
    #    try:
    #        bundle = self.build_bundle(data={'term_code': kwargs['term_code']}, request=request)
    #        obj = self.cached_obj_get(bundle=bundle, **self.remove_api_resource_names(kwargs))
    #    except ObjectDoesNotExist:
    #        return HttpGone()
    #    except MultipleObjectsReturned:
    #        return HttpMultipleChoices("More than one resource is found at this URI.")

    #    course_resource = CourseResource()
    #    return course_resource.get_list(request, semester=obj.pk)


class CourseListingResource(ModelResource):
    course = fields.ForeignKey('course_selection.api.CourseResource', 'course')

    class Meta:
        queryset = Course_Listing.objects.all()
        resource_name = 'course_listing'
        excludes = ['course', '']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class CourseResource(ModelResource):
    semester = fields.ForeignKey(SemesterResource, 'semester')
    course_listings = fields.ToManyField(CourseListingResource, 'course_listings', null=True, full=True)
    sections = fields.ToManyField('course_selection.api.SectionResource', 'sections', full=True)

    def alter_list_data_to_serialize(self, request, data):
        if request.GET.get('meta_only'):
            return {'meta': data['meta']}
        return data

    class Meta:
        queryset = Course.objects.all()
        resource_name = 'course'
        excludes = ['registrar_id']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)
        limit = 0
        max_limit = 0
        filtering = {
            'semester' : ALL_WITH_RELATIONS
        }

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
        excludes = ['']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

class ColorPaletteResource(ModelResource):
    class Meta:
        queryset = Color_Palette.objects.all()
        resource_name = 'color_palette'
        excludes = ['']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

# class EnrollmentResource(ModelResource):
#     class Meta:
#         queryset = Enrollment.objects.all()
#         resource_name = 'enrollment'
#         allowed_methods = []

class ScheduleResource(ModelResource):
    #enrollments = fields.ToManyField(EnrollmentResource, 'enrollments', full=True, null=True)
    semester = fields.ForeignKey(SemesterResource, 'semester', full=True)
    user = fields.ForeignKey('course_selection.api.UserResource', 'user')

    class Meta:
        queryset = Schedule.objects.all()
        resource_name = 'schedule'
        excludes = []
        allowed_methods = ['get', 'post', 'put', 'delete']
        cache = SimpleCache(timeout=10)
        authorization = Authorization()
        always_return_data = True
        limit = 0
        max_limit = 0
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'semester': ALL_WITH_RELATIONS
        }

    # def obj_create(self, bundle, **kwargs):
    #     import pdb; pdb.set_trace()
    #     return super(ScheduleResource, self).obj_create(bundle, user=bundle.request.user)

    # def apply_authorization_limits(self, request, object_list):
    #     import pdb; pdb.set_trace()
    #     return object_list.filter(user=request.user)

class UserResource(ModelResource):
    class Meta:
        queryset = Nice_User.objects.all()
        resource_name= 'user'
        excludes = ['password']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)
        authorization = Authorization()
        filtering = {
            'netid': ALL_WITH_RELATIONS
        }

    def prepend_urls(self):
        return [
            #url(r"^(?P<resource_name>%s)/(?P<netid>[\w\d_.-]+)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/schedule%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_schedule'), name="api_get_schedule"),
        ]

    def get_schedule(self, request, **kwargs):
        try:
            bundle = self.build_bundle(data={'pk': kwargs['pk']}, request=request)
            obj = self.cached_obj_get(bundle=bundle, **self.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return HttpGone()
        except MultipleObjectsReturned:
            return HttpMultipleChoices("More than one resource is found at this URI.")

        schedule_resource = ScheduleResource()
        return schedule_resource.get_list(request, user=4991)

class ProfessorResource(ModelResource):
    class Meta:
        queryset = Professor.objects.all()
        resource_name = 'professor'
        excludes = []
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()
