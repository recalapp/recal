# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0024_auto_20160204_1722'),
    ]

    operations = [
    migrations.AlterField(
            model_name='schedule',
            name='ical_uuid',
            field=models.UUIDField(default=uuid.uuid4, unique=True, null=False),
        ),
    ]
