# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0014_auto_20150103_0906'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course_listing',
            name='course',
            field=models.ForeignKey(related_name='course_listings', to='course_selection.Course'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='title',
            field=models.CharField(default=b'schedule', max_length=100),
            preserve_default=True,
        ),
    ]
