# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0017_friend_relationship_request_accepted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nice_user',
            name='friends',
            field=models.ManyToManyField(related_name='related_to', through='course_selection.Friend_Relationship', to='course_selection.Nice_User'),
            preserve_default=True,
        ),
    ]
