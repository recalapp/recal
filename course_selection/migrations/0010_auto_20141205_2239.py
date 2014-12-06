# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0009_remove_semester_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='section_capacity',
            field=models.IntegerField(default=999),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='section',
            name='section_enrollment',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
