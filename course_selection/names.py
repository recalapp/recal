import os
import nice
from nice.models import *
from django.conf import settings
import settings.common as settings
import sys

def construct_netid_map():
    path = os.path.dirname(nice.__file__)
    source_name = path + '/netids.txt'
    print source_name

    count = 0
    try:
        with open(source_name) as f:
            content = f.read().splitlines()
    except:
        print 'getnetids failed: could not open file'
        return

    list_length = len(content)
    for x in xrange(0, list_length, 4):
        person = content[x:x+4]
        first_name = person[0]
        last_name = person[1]
        netid = person[2].split('@')[0]
        new_user, created = NetID_Name_Table.objects.get_or_create(
            netid = netid,
            first_name = first_name,
            last_name = last_name
        )

        if created:
            count += 1

    print "number of netids found: " + str(list_length / 4)
    print "new netids added: " + str(count)

def main(self):
    construct_netid_map()
