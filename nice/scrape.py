"""
Scrapes OIT's Web Feeds to add courses and sections to database.

Procedure:

- Get list of departments (3-letter department codes)
- Run this: http://etcweb.princeton.edu/webfeeds/courseofferings/?term=current&subject=COS
- Parse it for courses, sections, and lecture times (as recurring events)
"""

from nice.models import *
from nice.queries import *
from lxml import etree
import HTMLParser
import string
import sys
import urllib2
from bs4 import BeautifulSoup
import re
from datetime import datetime
import settings

#TERM_CODE = 1144  # spring 2014
TERM_CODE = settings.CURR_TERM
COURSE_OFFERINGS = "http://registrar.princeton.edu/course-offerings/"
FEED_PREFIX = "http://etcweb.princeton.edu/webfeeds/courseofferings/"
TERM_PREFIX = FEED_PREFIX + "?term=" + str(TERM_CODE)
DEP_PREFIX = TERM_PREFIX + "&subject="
PTON_NAMESPACE = u'http://as.oit.princeton.edu/xml/courseofferings-1_3'

CURRENT_SEMESTER = ''
community_user = get_community_user()

DAYS = {'M': 0, 'T': 1, 'W': 2, 'Th': 3, 'F': 4, 'Sa': 5, 'S':6}

new_course_count = 0
course_count = 0
new_section_count = 0
section_count = 0
new_event_count = 0

def get_current_semester():
    global CURRENT_SEMESTER
    if not CURRENT_SEMESTER:
        try:
            CURRENT_SEMESTER = Semester.objects.get(term_code=str(TERM_CODE))
        except:
            parser = etree.XMLParser(ns_clean=True)
            termxml = urllib2.urlopen(TERM_PREFIX)
            tree = etree.parse(termxml, parser)
            remove_namespace(tree, PTON_NAMESPACE)
            term = tree.getroot().find('term')
            start_date = term.find('start_date').text
            end_date = term.find('end_date').text
            curr_sem = Semester(
                start_date = start_date, 
                end_date = end_date, 
                term_code = str(TERM_CODE)
            )
            curr_sem.save()
            CURRENT_SEMESTER = curr_sem
    return CURRENT_SEMESTER

# Seed page should be
# "http://registrar.princeton.edu/course-offerings/"
# Automatically gets the courses for the current term
def get_department_list(seed_page):
    soup = BeautifulSoup(seed_page)
    links = soup('a', href=re.compile(r'subject'))
    return [tag.string for tag in links]

# for each department, scrape all course listings from the webfeed
def scrape_all():
    global course_count
    global section_count
    seed_page = urllib2.urlopen(COURSE_OFFERINGS)
    departments = get_department_list(seed_page)
    for department in departments:
        scrape(department)
    
    print str(new_course_count) + " new courses"
    print str(course_count) + " total courses"
    print str(new_section_count) + " new sections"
    print str(section_count) + " total sections"
    print str(new_event_count) + " new events"

# goes through the listings for this department
def scrape(department):
    parser = etree.XMLParser(ns_clean=True)
    link = DEP_PREFIX + department
    xmldoc = urllib2.urlopen(link)
    tree = etree.parse(xmldoc, parser)
    dep_courses = tree.getroot()
    """ for now hardwire the namespaces--too annoying"""
    remove_namespace(dep_courses, PTON_NAMESPACE)
    for term in dep_courses:
        for subjects in term:
            for subject in subjects:
                for courses in subject:
                    for course in courses:
                        parse_course(course, subject)

## Parse it for courses, sections, and lecture times (as recurring events)
## If the course with this ID exists in the database, we update the course
## Otherwise, create new course with the information
def parse_course(course, subject):
    """ create a course with the basic information. """

    global new_course_count
    global course_count
    h = HTMLParser.HTMLParser()
    title = h.unescape(course.find('title').text)
    description = course.find('detail').find('description').text
    if not description:
        description = ''
    description = h.unescape(description)
        
    guid = course.find('guid').text

    # if we have a course with this registrar_id, get it 
    course_object, created = Course.objects.get_or_create(
        registrar_id = guid,
        semester = get_current_semester(),
    )

    course_object.title = title
    course_object.description = description
    course_object.professor = ''
    course_object.save()

    course_count += 1
    if created:
        new_course_count += 1 # for debugging
    else:
        # for now let's not update the listings/sections when run again
        return

    # handle course listings
    create_or_update_listings(course, subject, course_object)
    # add sections and events
    create_or_update_sections(course, course_object)

def create_or_update_listings(course, subject, course_object):
    sub = subject.find('code').text
    catalog = course.find('catalog_number').text
    course_listings = [(sub, catalog)]
    if course.find('crosslistings') is not None:
        for cross_listing in course.find('crosslistings'):
            course_listings.append((cross_listing.find('subject').text, cross_listing.find('catalog_number').text))

    # create course_listings
    for course_listing in course_listings:
        new_listing, created = Course_Listing.objects.get_or_create(
            course=course_object,
            dept=course_listing[0],
            number=course_listing[1]
        )
        
def create_or_update_sections(course, course_object):
    global new_section_count
    global section_count
    # add sections
    classes = course.find('classes')
    for section in classes:
        section_name = section.find('section').text
        section_type = section.find('type_name').text
        section_object, created = Section.objects.get_or_create(
            course = course_object,
            name = section_name,
            section_type = section_type[0:3].upper()
        )
        if created:
            new_section_count += 1
        section_count += 1

        # add events
        create_or_update_events(section, section_object)

# section is the class Node in the xml tree, 
# section_object is a section django object
def create_or_update_events(section, section_object):
    global new_event_count

    # check if this section has a schedule attached to it
    try:
        schedule = section.find('schedule')
        meetings = schedule.find('meetings')
    except:
        print 'no schedule or meetings for ' + str(section_object.course)
        return

    # now we check if there is already an event for this section
    # TODO: try to prevent creating duplicate events
    section_registrar_id = section.find('class_number')

    section_type = section.find('type_name').text

    # the dates are in the format:
    # YYYY-MM-DD
    str_start_date = schedule.find('start_date').text
    str_end_date = schedule.find('end_date').text
    end_date = datetime.strptime(str_end_date, "%Y-%m-%d")

    # count the occurrences of this event
    # so the titles can be: 'Lecture 1', 'Lecture 2', and so on
    event_count = 0

    for meeting in meetings:
        event_count += 1

        # the times are in the format:
        # HH:MM AM/PM
        str_end_time = meeting.find('end_time').text
        str_end_date_time = str_start_date + str_end_time
        end_date_time = datetime.strptime(str_end_date_time, '%Y-%m-%d%I:%M %p')

        str_start_time = meeting.find('start_time').text
        str_start_date_time = str_start_date + str_start_time
        start_date_time = datetime.strptime(str_start_date_time, '%Y-%m-%d%I:%M %p')

        try:
            location = meeting.find('building').find('name').text + ' ' + meeting.find('room').text
        except:
            location = ''

        # create event_group
        days = []
        for day in meeting.find('days'):
            days.append(DAYS[day.text])

        event_type = section_object.section_type[0:2]
        type_is_valid = False
        for choice in Event_Revision.TYPE_CHOICES:
            if event_type == choice[0]:
                type_is_valid = True
                break

        if not type_is_valid:
            # print 'new section type: ' + section_type
            # Force everything unseen before into a Lecture
            event_type = 'LE'

        event_title = section_type

        # we need start_date_time, end_time, end_date
        # start_date_time is start_date and start_time
        # create event_group_revision
        modify_events(community_user.username, [{
            'event_start': start_date_time,
            'event_end' : end_date_time,
            'event_title': event_title,
            'event_description': '',
            # TODO: figure out how to pass the real type
            'event_type': event_type,
            # -1 for new event
            'event_id': -1,
            'event_location': location,
            'section_id': section_object.pk,
            'recurring': True,
            'recurrence_days' : days,
            # we assume the class is weekly
            'recurrence_interval': 1,
            'recurrence_end': end_date,
        }])
        
        # create event
        new_event_count += 1

def remove_namespace(doc, namespace):
    """Hack to remove namespace in the document in place."""
    ns = u'{%s}' % namespace
    nsl = len(ns)
    for elem in doc.getiterator():
        if elem.tag.startswith(ns):
            elem.tag = elem.tag[nsl:]

# scrape_all()
