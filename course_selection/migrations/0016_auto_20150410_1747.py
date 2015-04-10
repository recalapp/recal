# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0015_auto_20150105_0217'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='section_registrar_id',
            field=models.CharField(default=b'', max_length=20),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='course_listing',
            name='course',
            field=models.ForeignKey(related_name='course_listing_set', to='course_selection.Course'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='semester',
            name='term_code',
            field=models.CharField(default=1154, unique=True, max_length=4, db_index=True),
            preserve_default=True,
        ),
    ]
