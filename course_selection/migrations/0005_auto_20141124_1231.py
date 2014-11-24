# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0004_auto_20141124_1148'),
    ]

    operations = [
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('color', models.ForeignKey(to='course_selection.Color_Palette')),
                ('course', models.ForeignKey(related_name='enrollment', to='course_selection.Course')),
                ('schedule', models.ForeignKey(to='course_selection.Schedule')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='course',
            name='colors',
        ),
    ]
