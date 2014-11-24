# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ColorPalette',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('light', models.CharField(default=b'FFFFFF', max_length=6)),
                ('dark', models.CharField(default=b'000000', max_length=6)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='course_listing',
            name='course',
            field=models.ForeignKey(related_name='course_listings', to='course_selection.Course'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='meeting',
            name='section',
            field=models.ForeignKey(related_name='meetings', to='course_selection.Section'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='section',
            name='course',
            field=models.ForeignKey(related_name='sections', to='course_selection.Course'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='section',
            name='section_type',
            field=models.CharField(max_length=3, choices=[(b'CLA', b'class'), (b'DRI', b'drill'), (b'EAR', b'ear training'), (b'FIL', b'film'), (b'LAB', b'lab'), (b'LEC', b'lecture'), (b'PRE', b'precept'), (b'SEM', b'seminar'), (b'STU', b'studio')]),
            preserve_default=True,
        ),
    ]
