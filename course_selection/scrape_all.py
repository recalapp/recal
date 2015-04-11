from scrape_parse import scrape_parse_semester
from scrape_validate import validate_course
from scrape_import import scrape_import_course

def get_all_courses():
    # we can generate these given settings.CURR_TERM
    term_codes = [1162]
    for term_code in term_codes:
        try:
            courses = scrape_parse_semester(term_code)
            [validate_course(x) for x in courses] # just a sanity check in case we ever modify scrape_parse
            [scrape_import_course(x) for x in courses]
        except Exception as e:
            print e
