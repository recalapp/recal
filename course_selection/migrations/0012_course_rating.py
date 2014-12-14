# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0011_auto_20141208_1145'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='rating',
            field=models.FloatField(default=0),
            preserve_default=True,
        ),
    ]
