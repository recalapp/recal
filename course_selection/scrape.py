"""
Scrapes OIT's Web Feeds to add courses and sections to database.

Procedure:

- Get list of departments (3-letter department codes)
- Run this: http://etcweb.princeton.edu/webfeeds/courseofferings/?term=current&subject=COS
- Parse it for courses, sections, and lecture times (as recurring events)
"""

from course_selection.models import *
from lxml import etree
import HTMLParser
import string
import sys
import urllib2
from bs4 import BeautifulSoup
import re
from datetime import datetime
from datetime import timedelta

def get_courses_for_term(term_code):
    TERM_CODE = term_code
    
    COURSE_OFFERINGS = "http://registrar.princeton.edu/course-offerings/"
    FEED_PREFIX = "http://etcweb.princeton.edu/webfeeds/courseofferings/"
    
    # Could also use 'current' instead of str(TERM_CODE), which automatically
    # gets the current semester. caveat: cannot get next semester's schedule
    # ahead of time
    TERM_PREFIX = FEED_PREFIX + "?term=" + str(TERM_CODE)
    DEP_PREFIX = TERM_PREFIX + "&subject="
    
    # for now hardwire the namespaces--too annoying
    PTON_NAMESPACE = u'http://as.oit.princeton.edu/xml/courseofferings-1_4'
    
    CURRENT_SEMESTER = ['']
    
    DAYS = {'M': 0, 'T': 1, 'W': 2, 'Th': 3, 'F': 4, 'Sa': 5, 'S':6}
    
    new_course_count = [0]
    course_count = [0]
    new_section_count = [0]
    section_count = [0]
    new_meeting_count = [0]
    meeting_count = [0]
    
    def get_current_semester():
        """ get semester according to TERM_CODE
    
        """
        #global CURRENT_SEMESTER
        if not CURRENT_SEMESTER[0]:
            try:
                CURRENT_SEMESTER[0] = Semester.objects.get(term_code=str(TERM_CODE))
            except:
                parser = etree.XMLParser(ns_clean=True)
                termxml = urllib2.urlopen(TERM_PREFIX)
                tree = etree.parse(termxml, parser)
                remove_namespace(tree, PTON_NAMESPACE)
                term = tree.getroot().find('term')
                start_date = term.find('start_date').text
                end_date = term.find('end_date').text
                end_date = datetime.strptime(end_date, "%Y-%m-%d")
                curr_sem = Semester(
                    start_date = start_date, 
                    end_date = end_date, 
                    term_code = str(TERM_CODE)
                )
                curr_sem.save()
                CURRENT_SEMESTER[0] = curr_sem
        return CURRENT_SEMESTER[0]
    
    def get_department_list(seed_page):
        """ get list of departments
    
        Parses seed_page and returns a list of the departments' names.
        Seed page should be "http://registrar.princeton.edu/course-offerings/"
        Automatically gets the courses for the current term.
        """
        soup = BeautifulSoup(seed_page)
        links = soup('a', href=re.compile(r'subject'))
        departments = [tag.string for tag in links]
        #print ' '.join(departments)
        return departments
    
    def scrape_all():
        """ scrape all events from Princeton's course webfeed
    
        """
        #global course_count
        #global section_count
        seed_page = urllib2.urlopen(COURSE_OFFERINGS)
        departments = get_department_list(seed_page)
        for department in departments:
            scrape(department)
        
        print str(new_course_count[0]) + " new courses"
        print str(course_count[0]) + " total courses"
        print str(new_section_count[0]) + " new sections"
        print str(section_count[0]) + " total sections"
        print str(new_meeting_count[0]) + " new meetings"
        print str(meeting_count[0]) + " total meetings"
    
    # goes through the listings for this department
    def scrape(department):
        """ Scrape all events listed under department
    
        """
        parser = etree.XMLParser(ns_clean=True)
        link = DEP_PREFIX + department
        xmldoc = urllib2.urlopen(link)
        tree = etree.parse(xmldoc, parser)
        dep_courses = tree.getroot()
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
        """ create a course with basic information. 
        
        """
        #global new_course_count
        #global course_count
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
        course_object.save()
    
        course_count[0] += 1
        if created:
            new_course_count[0] += 1 # for debugging
        else:
            # for now let's not update the listings/sections when run again
            return
    
        # handle course listings
        create_or_update_listings(course, subject, course_object)
        # add sections and events
        create_or_update_sections(course, course_object)
    
    def get_primary_listing(course, subject):
        sub = subject.find('code').text
        catalog = course.find('catalog_number').text
        return (sub, catalog)

    def get_rating(course):
        """ we contact easypce for the ratings"""
        #TODO 
        pass

    def create_or_update_listings(course, subject, course_object):
        """ Create or, if already exists, update a course
    
        """
        sub, catalog = get_primary_listing(course, subject)
        new_listing, created = Course_Listing.objects.get_or_create(
            course=course_object,
            dept=sub,
            number=catalog,
            is_primary=True
        )
    
        course_listings = []
        if course.find('crosslistings') is not None:
            for cross_listing in course.find('crosslistings'):
                course_listings.append((cross_listing.find('subject').text, cross_listing.find('catalog_number').text))
    
        # create course_listings
        for course_listing in course_listings:
            new_listing, created = Course_Listing.objects.get_or_create(
                course=course_object,
                dept=course_listing[0],
                number=course_listing[1],
                is_primary=False
            )
            
    def create_or_update_sections(course, course_object):
        """ Given a course, create or, if already exists, update all sections
    
        """
        #global new_section_count
        #global section_count
        #global new_meeting_count
        #global meeting_count
    
        # add sections
        classes = course.find('classes')
        for section in classes:
            section_name = section.find('section').text
            section_type = section.find('type_name').text
            section_capacity = section.find('capacity').text
            section_enrollment = section.find('enrollment').text
    
            # check if this section has a schedule attached to it
            try:
                schedule = section.find('schedule')
                meetings = schedule.find('meetings')
            except:
                # TODO: CAN'T DO THIS: STILL NEED TO CREATE OBJECT BEFORE RETURNS
                # thought in fact, these fields are never empty;
                # for courses that don't have meetings, the stream returns
                # meetings with invalid times
                print 'no schedule or meetings for ' + str(section_object.course)
                return
    
            # now we check if there is already an event for this section
            section_registrar_id = section.find('class_number')
            section_type = section.find('type_name').text
            section_type = section_type[0:3].upper()
    
            section_object, created = Section.objects.get_or_create(
                course = course_object,
                name = section_name,
            )

            section_object.section_type = section_type
            section_object.section_enrollment = section_enrollment
            section_object.section_capacity = section_capacity
            section_object.save()
    
            if created:
                new_section_count[0] += 1
            section_count[0] += 1
    
            ## generate meetings for this section
            for meeting in meetings:
                days = ""
                for day in meeting.find('days'):
                    days += day.text + ' '
    
                # the times are in the format:
                # HH:MM AM/PM
                str_end_time = meeting.find('end_time').text
                str_start_time = meeting.find('start_time').text
    
                try:
                    building = meeting.find('building').find('name').text 
                    room = meeting.find('room').text
                    location = building + " " + room
                except:
                    location = ""
    
                meeting_object, created = Meeting.objects.get_or_create(
                    section = section_object,
                    start_time = str_start_time,
                    end_time = str_end_time,
                    days = days,
                    location = location
                )
    
                if created:
                    new_meeting_count[0] += 1
                meeting_count[0] += 1
    
    def remove_namespace(doc, namespace):
        """Hack to remove namespace in the document in place.
    
        """
        ns = u'{%s}' % namespace
        nsl = len(ns)
        for elem in doc.getiterator():
            if elem.tag.startswith(ns):
                elem.tag = elem.tag[nsl:]

    scrape_all()
