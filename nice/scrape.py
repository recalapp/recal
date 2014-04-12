"""
Scrapes OIT's Web Feeds to add courses and sections to database.

Procedure:

- Get list of departments (3-letter department codes)
- Run this: http://etcweb.princeton.edu/webfeeds/courseofferings/?term=current&subject=COS
- Parse it for courses, sections, and lecture times (as recurring events)

TODO(Dyland): write this!

"""
from nice.models import *
from nice import queries
import json



