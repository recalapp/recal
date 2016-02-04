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
    """
    NOTE: ical_uuid must be migrated in a careful way to create unique field.
    See https://github.com/django/django/commit/1f9e44030e9c5300b97ef7b029f482c53a66f13b and https://docs.djangoproject.com/en/1.9/howto/writing-migrations/#migrations-that-add-unique-fields
    """


    dependencies = [
        ('course_selection', '0022_remove_friend_request_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='ical_uuid',
            field=models.UUIDField(default=uuid.uuid4, null=True),
        ),
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='schedule',
            name='ical_uuid',
            field=models.UUIDField(default=uuid.uuid4, unique=True),
        ),
        migrations.AlterField(
            model_name='nice_user',
            name='last_login',
            field=models.DateTimeField(null=True, verbose_name='last login', blank=True),
        ),
        migrations.AlterField(
            model_name='semester',
            name='term_code',
            field=models.CharField(default=1162, unique=True, max_length=4, db_index=True),
        ),
    ]
