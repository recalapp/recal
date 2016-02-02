# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0022_remove_friend_request_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='ical_uuid',
            field=models.UUIDField(default=uuid.uuid4, unique=True),
        ),
        migrations.AlterField(
            model_name='nice_user',
            name='last_login',
            field=models.DateTimeField(null=True, verbose_name='last login', blank=True),
        ),
        migrations.AlterField(
            model_name='semester',
            name='term_code',
            field=models.CharField(default=1162, unique=True, max_length=4, db_index=True),
        ),
    ]
