# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0007_auto_20141125_1618'),
    ]

    operations = [
        migrations.AddField(
            model_name='semester',
            name='name',
            field=models.CharField(default=b'', max_length=10),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='nice_user',
            name='netid',
            field=models.CharField(unique=True, max_length=20),
            preserve_default=True,
        ),
    ]
