# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid

def gen_uuid(apps, schema_editor):
    Schedule = apps.get_model('course_selection', 'Schedule')
    for row in Schedule.objects.all():
        row.ical_uuid = uuid.uuid4()
        row.save()


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0023_auto_20160201_2156'),
    ]

    operations = [
    # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
        
    ]
