from scrape_parse import get_courses_for_term

def get_all_courses():
    # we can generate these given settings.CURR_TERM
    term_codes = [1162]
    courses = []
    for term_code in term_codes:
        courses += get_courses_for_term(term_code)
    print courses
