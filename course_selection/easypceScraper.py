# adopted from http://stackoverflow.com/questions/20039643/
# how-to-scrape-a-website-that-requires-login-first-with-python
#
# Author: Dyland Xue

##################################### Method 1
import mechanize
import cookielib
from bs4 import BeautifulSoup
import html2text
import getpass

# returns a mechanize browser logged into easypce
def login():
    # these fields are NOT encrypted. Be careful with them
    username = raw_input("netid: ")
    password = getpass.getpass()

    # Browser
    br = mechanize.Browser()

    # Cookie Jar
    cj = cookielib.LWPCookieJar()
    br.set_cookiejar(cj)

    # Browser options
    br.set_handle_equiv(True)
    br.set_handle_gzip(True)
    br.set_handle_redirect(True)
    br.set_handle_referer(True)
    br.set_handle_robots(False)
    br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time=1)

    br.addheaders = [('User-agent', 'Chrome')]

    # The site we will navigate into, handling it's session
    br.open('http://easypce.com/')

    # View available forms
    for f in br.forms():
        print f

    # Select the second (index one) form (the first form is a search query box)
    br.select_form(nr=0)

    # User credentials
    br.form['username'] = username
    br.form['password'] = password

    # Login
    br.submit()
    return br

# a course_average_tag looks like:
# <span class="average"><br><br> 4.17<span style="font-size:40%;">/5</span> </br></br></span>
def get_course_rating_from_page(course_page):
    soup = BeautifulSoup(course_page)
    average_tag = soup.find_all("span", "average")[0]
    return average_tag.contents[0].contents[0].contents[0]

def get_course_page_from_course(course):
    

# test
def main():
    br = login()

    course_number = raw_input("course number: ")
    course_page = br.open('http://easypce.com/courses/' + course_number).read()
    with open ('course_ratings/' + course_number, 'w') as f:
        f.write("course number: " + course_number + "\n")
        f.write("overall rating:" + get_course_rating(course_page))

main()
