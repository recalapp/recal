# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0006_auto_20141124_1441'),
    ]

    operations = [
        migrations.AlterField(
            model_name='semester',
            name='term_code',
            field=models.CharField(default=1152, unique=True, max_length=4, db_index=True),
            preserve_default=True,
        ),
    ]
