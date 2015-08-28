# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0016_auto_20150410_1747'),
    ]

    operations = [
        migrations.AddField(
            model_name='friend_relationship',
            name='request_accepted',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
