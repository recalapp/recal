from scrape import get_courses_for_term

def get_all_courses():
    # we can generate these given settings.CURR_TERM
    term_codes = [1154, 1162]
    for term_code in term_codes:
        get_courses_for_term(term_code)
