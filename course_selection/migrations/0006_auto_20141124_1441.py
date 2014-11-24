# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0005_auto_20141124_1231'),
    ]

    operations = [
        migrations.AddField(
            model_name='enrollment',
            name='sections',
            field=models.ManyToManyField(to='course_selection.Section'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='schedule',
            name='available_colors',
            field=jsonfield.fields.JSONField(default={}),
            preserve_default=False,
        ),
    ]
