# from django.db.models import Q
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.cache import SimpleCache
from tastypie.cache import NoCache
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized
from tastypie import fields
from django.conf import settings
from course_selection.models import (Nice_User, Schedule, Semester,
                                     Course_Listing, Course, Section,
                                     Meeting, Color_Palette, Professor,
                                     Friend_Request)


def get_nice_user(user):
    return Nice_User.objects.get(netid=user.username)


class UserAuthorization(Authorization):

    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        filtered = [obj for obj in object_list if obj.netid ==
                    bundle.request.user.username]
        if len(filtered) > 0:
            return filtered
        else:
            raise Unauthorized("Sorry, no peeking!")

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        if bundle.obj.netid == bundle.request.user.username:
            return True
        else:
            raise Unauthorized("Sorry, no peeking!")

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return [obj for obj in object_list if obj.netid == bundle.request.user.username]

    def create_detail(self, object_list, bundle):
        return bundle.obj.netid == bundle.request.user.username

    def update_list(self, object_list, bundle):
        return [obj for obj in object_list if obj.netid == bundle.request.user.username]

    def update_detail(self, object_list, bundle):
        return bundle.obj.netid == bundle.request.user.username

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Sorry, no deletes.")


# you can only use it if you own this object
class UserObjectsOnlyAuthorization(Authorization):

    def read_list(self, object_list, bundle):
        filtered = [obj for obj in object_list if obj.user.netid ==
                    bundle.request.user.username]
        return filtered

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        if bundle.obj.user.netid == bundle.request.user.username:
            return True
        else:
            raise Unauthorized("Sorry, no peeking!")

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return [obj for obj in object_list if obj.user.netid == bundle.request.user.username]

    def create_detail(self, object_list, bundle):
        return bundle.obj.user.netid == bundle.request.user.username

    def update_list(self, object_list, bundle):
        return [obj for obj in object_list if obj.user.netid == bundle.request.user.username]

    def update_detail(self, object_list, bundle):
        return bundle.obj.user.netid == bundle.request.user.username

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no deleting lists.")
        # return [obj for obj in object_list if obj.user.netid == bundle.request.user.username]
        # return object_list

    def delete_detail(self, object_list, bundle):
        return bundle.obj.user.netid == bundle.request.user.username


# you can see the objects if a) you are the owner OR b) you and the owner are friends
# currently this should apply to schedules
class UserObjectOrFriendAuthorization(UserObjectsOnlyAuthorization):

    def is_owner_or_friend(self, user, owner):
        """
        Returns true if user is either the owner, or related to the owner
        via a Friend_Relationship.
        """
        if user.username == owner.netid:
            return True

        nice_user = get_nice_user(user)
        return nice_user.friends.filter(pk=owner.pk).exists()

    def read_list(self, object_list, bundle):
        filtered = [o for o in object_list if self.is_owner_or_friend(
            bundle.request.user, o.user)]
        return filtered

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        if self.is_owner_or_friend(bundle.request.user, bundle.obj.user):
            return True
        else:
            raise Unauthorized("Sorry, no peeking!")


class SemesterResource(ModelResource):

    class Meta:
        queryset = Semester.objects.all()
        resource_name = 'semester'
        excludes = ['']
        allowed_methods = ['get']
        authorization = Authorization()
        filtering = {
            'term_code': ALL,
            # 'active' filter is also supported, but is not a value of the
            # semester itself.
        }

    def build_filters(self, filters=None):
        # See: http://django-tastypie.readthedocs.io/en/latest/resources.html#ModelResource.build_filters
        if filters is None:
            filters = {}

        orm_filters = super(SemesterResource, self).build_filters(filters)
        if 'active' in filters:
            orm_filters['term_code__in'] = set(settings.ACTIVE_TERMS)

        return orm_filters

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


class CourseListingResource(ModelResource):
    course = fields.ForeignKey('course_selection.api.CourseResource', 'course')

    class Meta:
        queryset = Course_Listing.objects.all()
        resource_name = 'course_listing'
        excludes = ['course', '']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)


class CourseResource(ModelResource):
    semester = fields.ForeignKey(SemesterResource, 'semester', full=True)
    course_listings = fields.ToManyField(
        CourseListingResource, 'course_listing_set', null=True, full=True)
    sections = fields.ToManyField(
        'course_selection.api.SectionResource', 'sections', full=True)

    def alter_list_data_to_serialize(self, request, data):
        if request.GET.get('meta_only'):
            return {'meta': data['meta']}
        return data

    class Meta:
        queryset = Course.objects.all()
        resource_name = 'course'
        excludes = ['']
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)
        limit = 0
        max_limit = 0
        filtering = {
            'semester': ALL_WITH_RELATIONS
        }


class SectionResource(ModelResource):
    course = fields.ForeignKey(CourseResource, 'course')
    meetings = fields.ToManyField(
        'course_selection.api.MeetingResource', 'meetings', full=True)

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


class ScheduleResource(ModelResource):
    #enrollments = fields.ToManyField(EnrollmentResource, 'enrollments', full=True, null=True)
    semester = fields.ForeignKey(SemesterResource, 'semester', full=True)
    user = fields.ForeignKey('course_selection.api.UserResource', 'user')

    class Meta:
        queryset = Schedule.objects.all()
        resource_name = 'schedule'
        excludes = ['user']
        allowed_methods = ['get', 'post', 'put', 'delete']
        cache = NoCache()
        authorization = UserObjectOrFriendAuthorization()
        always_return_data = True
        limit = 0
        max_limit = 0
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'semester': ALL_WITH_RELATIONS
        }

    def obj_create(self, bundle, **kwargs):
        nice_user = get_nice_user(bundle.request.user)
        return super(ScheduleResource, self).obj_create(bundle, user=nice_user)

    # def apply_authorization_limits(self, request, object_list):
    #     return object_list.filter(Q(user__netid=request.user.username))


class FriendResource(ModelResource):
    """
    This is a private resource used for saving Friend_Relationship.
    """
    class Meta:
        queryset = Nice_User.objects.all()
        resource_name = 'friend'
        excludes = ['password', 'resource_uri', 'last_login']
        allowed_methods = ['get', 'post', 'put']
        cache = SimpleCache(timeout=10)
        limit = 0
        max_limit = 0
        # there is no authorization on this class on purpose--
        # we want to be able to update a Nice_User object
        # when we save a Friend_Relationship object
        authorization = Authorization()
        filtering = {
            'netid': ALL_WITH_RELATIONS
        }


class FriendRequestAuthorization(Authorization):
    def user_is_in_this_request(self, rel, user):
        return rel.from_user == user or rel.to_user == user

    def authorize_detail(self, obj, bundle):
        nice_user = get_nice_user(bundle.request.user)
        return self.user_is_in_this_request(obj, nice_user)

    def authorize_list(self, object_list, bundle):
        return [o for o in object_list if self.authorize_detail(o, bundle)]

    def read_list(self, object_list, bundle):
        return self.authorize_list(object_list, bundle)

    def read_detail(self, object_list, bundle):
        return self.authorize_detail(bundle.obj, bundle)

    def create_list(self, object_list, bundle):
        raise Unauthorized("Sorry, no operation on lists.")

    def create_detail(self, object_list, bundle):
        return self.authorize_detail(bundle.obj, bundle)

    def update_list(self, object_list, bundle):
        raise Unauthorized("Sorry, no operation on lists.")

    def update_detail(self, object_list, bundle):
        return self.authorize_detail(bundle.obj, bundle)

    def delete_list(self, object_list, bundle):
        raise Unauthorized("Sorry, no operation on lists.")

    def delete_detail(self, object_list, bundle):
        return self.authorize_detail(bundle.obj, bundle)


class FriendRequestResource(ModelResource):
    from_user = fields.ForeignKey(FriendResource, 'from_user', full=True)
    to_user = fields.ForeignKey(FriendResource, 'to_user', full=True)

    class Meta:
        queryset = Friend_Request.objects.all()
        resource_name = 'friend_request'
        allowed_methods = ['get', 'post', 'put', 'delete']
        authorization = FriendRequestAuthorization()
        always_return_data = True
        limit = 0
        max_limit = 0
        filtering = {
            'from_user': ALL_WITH_RELATIONS,
            'to_user': ALL_WITH_RELATIONS
        }


class UserResource(ModelResource):
    friends = fields.ToManyField(FriendResource, 'friends', full=True)

    class Meta:
        queryset = Nice_User.objects.all()
        resource_name = 'user'
        excludes = ['password']
        allowed_methods = ['get', 'post']
        cache = SimpleCache(timeout=10)
        authorization = UserAuthorization()
        filtering = {
            'netid': ALL_WITH_RELATIONS
        }


class ProfessorResource(ModelResource):

    class Meta:
        queryset = Professor.objects.all()
        resource_name = 'professor'
        excludes = []
        allowed_methods = ['get']
        authorization = Authorization()
