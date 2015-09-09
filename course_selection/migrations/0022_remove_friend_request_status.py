# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0021_auto_20150905_0817'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend_request',
            name='status',
        ),
    ]
