# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0013_auto_20150101_0202'),
    ]

    operations = [
        migrations.AlterField(
            model_name='color_palette',
            name='dark',
            field=models.CharField(default=b'#000000', max_length=7),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='color_palette',
            name='light',
            field=models.CharField(default=b'#FFFFFF', max_length=7),
            preserve_default=True,
        ),
    ]
