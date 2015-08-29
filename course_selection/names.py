import os
import course_selection
# TODO remove import *
from course_selection.models import *  # NOQA


def construct_netid_map():
    path = os.path.dirname(course_selection.__file__)
    source_name = path + '/netids.txt'
    print 'reading from ' + source_name + '...'

    mapping_count = 0
    user_count = 0
    try:
        with open(source_name) as f:
            content = f.read().splitlines()
    except:
        print 'getnetids failed: could not open file'
        return

    list_length = len(content)
    for x in xrange(0, list_length, 4):
        person = content[x:x + 4]
        first_name = person[0]
        last_name = person[1]
        netid = person[2].split('@')[0]
        new_user, created = NetID_Name_Table.objects.get_or_create(
            netid=netid,
            first_name=first_name,
            last_name=last_name
        )
        if created:
            mapping_count += 1

        nice_user, created = Nice_User.objects.get_or_create(
            netid=netid
        )

        if created:
            user_count += 1

    print "number of netids found: " + str(list_length / 4)
    print "new netids added: " + str(mapping_count)
    print "new users added: " + str(user_count)


def main(self):
    construct_netid_map()
