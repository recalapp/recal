# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0010_auto_20141205_2239'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='enrollment',
            name='color',
        ),
        migrations.RemoveField(
            model_name='enrollment',
            name='course',
        ),
        migrations.RemoveField(
            model_name='enrollment',
            name='schedule',
        ),
        migrations.RemoveField(
            model_name='enrollment',
            name='sections',
        ),
        migrations.DeleteModel(
            name='Enrollment',
        ),
        migrations.AddField(
            model_name='schedule',
            name='enrollments',
            field=jsonfield.fields.JSONField(null=True),
            preserve_default=True,
        ),
    ]
