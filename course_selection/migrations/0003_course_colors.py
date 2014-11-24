# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0002_auto_20141124_1144'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='colors',
            field=models.ForeignKey(default=1, to='course_selection.ColorPalette'),
            preserve_default=True,
        ),
    ]
