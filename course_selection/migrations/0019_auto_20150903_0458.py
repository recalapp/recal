# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0018_auto_20150830_0319'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='friend_relationship',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='friend_relationship',
            name='from_user',
        ),
        migrations.RemoveField(
            model_name='friend_relationship',
            name='to_user',
        ),
        migrations.RemoveField(
            model_name='nice_user',
            name='friends',
        ),
        migrations.DeleteModel(
            name='Friend_Relationship',
        ),
    ]
