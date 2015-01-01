# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0012_course_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course_listing',
            name='course',
            field=models.ForeignKey(to='course_selection.Course'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='available_colors',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schedule',
            name='enrollments',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
    ]
