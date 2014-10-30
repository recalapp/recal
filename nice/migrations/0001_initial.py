# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import colorfield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('professor', models.CharField(max_length=100, null=True, blank=True)),
                ('registrar_id', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Course_Listing',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dept', models.CharField(max_length=10)),
                ('number', models.CharField(max_length=10)),
                ('is_primary', models.BooleanField(default=False)),
                ('course', models.ForeignKey(to='nice.Course')),
            ],
            options={
                'ordering': ['dept', 'number'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Event_Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('registrar_id', models.CharField(max_length=10, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Event_Group_Revision',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('modified_time', models.DateTimeField()),
                ('approved', models.BooleanField(default=True)),
                ('recurrence_days', models.CharField(default=None, max_length=300, null=True, blank=True)),
                ('recurrence_interval', models.IntegerField(default=None, null=True, blank=True)),
                ('event_group', models.ForeignKey(to='nice.Event_Group')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Event_Revision',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_title', models.CharField(max_length=100)),
                ('event_type', models.CharField(max_length=2, choices=[(b'AS', b'assignment'), (b'EX', b'exam'), (b'LA', b'lab'), (b'LE', b'lecture'), (b'OH', b'office hours'), (b'PR', b'precept'), (b'RS', b'review session'), (b'ST', b'studio')])),
                ('event_start', models.DateTimeField()),
                ('event_end', models.DateTimeField()),
                ('event_description', models.TextField()),
                ('event_location', models.CharField(max_length=100)),
                ('modified_time', models.DateTimeField()),
                ('approved', models.CharField(default=b'S_PE', max_length=4, choices=[(b'S_AP', b'Approved'), (b'S_PE', b'Pending'), (b'S_RE', b'Rejected')])),
                ('event', models.ForeignKey(to='nice.Event')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NetID_Name_Table',
            fields=[
                ('netid', models.CharField(max_length=100, serialize=False, primary_key=True)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PointChange',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('when', models.DateTimeField()),
                ('score', models.IntegerField()),
                ('relationship', models.IntegerField(default=9, choices=[(1, b'an Approved Submission'), (2, b'a Rejected Submission'), (3, b'an Upvote'), (4, b'a Downvote'), (5, b'an Upvote of an Approved Submission'), (6, b'an Upvote of a Rejected Submission'), (7, b'a Downvote of a Rejected Submission'), (8, b'a Downvote of an Approved Submission'), (9, b'Other')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'all_students', max_length=100)),
                ('isDefault', models.BooleanField(default=False)),
                ('section_type', models.CharField(max_length=3, choices=[(b'ALL', b'all students'), (b'CLA', b'class'), (b'DRI', b'drill'), (b'LAB', b'lab'), (b'LEC', b'lecture'), (b'PRE', b'precept'), (b'SEM', b'seminar'), (b'STU', b'studio')])),
                ('course', models.ForeignKey(to='nice.Course')),
            ],
            options={
                'ordering': ['course', 'name'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Semester',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('term_code', models.CharField(default=b'1144', max_length=4)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User_Profile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100, null=True, blank=True)),
                ('lastActivityTime', models.DateTimeField()),
                ('ui_state_restoration', models.TextField(null=True, blank=True)),
                ('hidden_events', models.TextField(null=True, blank=True)),
                ('ui_agenda_pref', models.TextField(null=True, blank=True)),
                ('ui_calendar_pref', models.TextField(null=True, blank=True)),
                ('ui_pref', models.TextField(null=True, blank=True)),
                ('current_points', models.IntegerField(default=0, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User_Section_Table',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('color', colorfield.fields.ColorField(default=b'#8441A5', max_length=7)),
                ('add_date', models.DateTimeField()),
                ('section', models.ForeignKey(to='nice.Section')),
                ('user', models.ForeignKey(to='nice.User_Profile')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('when', models.DateTimeField()),
                ('score', models.IntegerField(default=1)),
                ('voted_on', models.ForeignKey(to='nice.Event_Revision')),
                ('voter', models.ForeignKey(to='nice.User_Profile')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='user_profile',
            name='sections',
            field=models.ManyToManyField(to='nice.Section', null=True, through='nice.User_Section_Table', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='user_profile',
            name='user',
            field=models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pointchange',
            name='user',
            field=models.ForeignKey(to='nice.User_Profile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pointchange',
            name='why',
            field=models.ForeignKey(blank=True, to='nice.Event_Revision', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='event_revision',
            name='modified_user',
            field=models.ForeignKey(to='nice.User_Profile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='event_group_revision',
            name='modified_user',
            field=models.ForeignKey(to='nice.User_Profile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='event_group',
            name='section',
            field=models.ForeignKey(to='nice.Section'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='event',
            name='group',
            field=models.ForeignKey(to='nice.Event_Group'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='course',
            name='semester',
            field=models.ForeignKey(to='nice.Semester'),
            preserve_default=True,
        ),
    ]
