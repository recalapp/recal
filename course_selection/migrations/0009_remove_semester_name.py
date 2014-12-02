# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0008_auto_20141201_1526'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='semester',
            name='name',
        ),
    ]
