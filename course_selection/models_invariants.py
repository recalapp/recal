def check_schedule_invariants(schedule):
    from models import Course

    def has_user(schedule):
        return schedule.user is not None

    def has_available_colors(schedule):
        return schedule.available_colors is not None

    def has_enrollments(schedule):
        return schedule.enrollments is not None

    def enrolled_courses_exist(schedule):
        import json
        try:
            enrollments = json.parse(schedule.enrollments)
            def course_exists(course):
                course_id = course["course_id"]
                try:
                    Course.objects.get(id=course_id)
                    return True
                except Course.DoesNotExist:
                    return False
            results = [course_exists(course) for course in enrollments]
            return reduce(lambda x, y: x and y, results, initializer=True)
        except:
            return False

    check_invariants = [
        has_user,
        has_available_colors,
        has_enrollments,
        enrolled_courses_exist,
    ]
    results = [check(schedule) for check in check_invariants]
    return reduce(lambda x, y : x and y, results, initializer = True)
