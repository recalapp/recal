from functools import reduce

_DEBUG = True

def _flatten(nested_list):
    return reduce(lambda x, y: x + y, nested_list, [])

def _model_object_exists(id, model_object):
    try:
        model_object.objects.get(id=id)
        return True
    except model_object.DoesNotExist:
        return False

def check_schedule_invariants(schedule):

    def has_user(schedule):
        return schedule.user is not None

    def has_available_colors(schedule):
        return schedule.available_colors is not None

    def has_enrollments(schedule):
        return schedule.enrollments is not None

    def enrolled_courses_exist(schedule):
        """
        Check if the enrolled courses exist in the database.
        """
        import json
        from models import Course
        try:
            enrollments = json.loads(schedule.enrollments)
            results = [_model_object_exists(id=course["course_id"], model_object=Course) for course in enrollments]
            return reduce(lambda x, y: x and y, results, True)
        except:
            return False

    def enrolled_sections_exist(schedule):
        """
        Check if the enrolled sections exist in the database.
        """
        import json
        from models import Section
        try:
            enrollments = json.loads(schedule.enrollments)
            section_ids = _flatten([course["sections"] for course in enrollments])
            results = [_model_object_exists(id=section_id, model_object=Section) for section_id in section_ids]
            return reduce(lambda x, y: x and y, results, True)
        except:
            return False

    check_invariants = [
        has_user,
        has_available_colors,
        has_enrollments,
        enrolled_courses_exist,
        enrolled_sections_exist,
    ]
    results = [check(schedule) for check in check_invariants]
    if _DEBUG:
        i = 0
        for x in results:
            if not x:
                print "failed test #" + unicode(i)
            i += 1
    return reduce(lambda x, y : x and y, results, True)
