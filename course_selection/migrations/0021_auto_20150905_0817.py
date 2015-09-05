# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0020_auto_20150903_0501'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend_request',
            name='accepted',
        ),
        migrations.AddField(
            model_name='friend_request',
            name='status',
            field=models.CharField(default=b'PEN', max_length=3, choices=[(b'PEN', b'Pending'), (b'ACC', b'Accepted'), (b'REJ', b'Rejected')]),
            preserve_default=True,
        ),
    ]
