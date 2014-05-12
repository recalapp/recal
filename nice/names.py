from nice.models import NetID_Name_Table

source_name = 'netids.txt'

def construct_netid_map():
    count = 0
    with open(source_name) as f:
        content = f.read().splitlines()

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

    print "number of netids found: " + (list_length / 4)
    print "new netids added: " + count
