# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField()),
                ('description', models.TextField()),
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
                ('course', models.ForeignKey(to='course_selection.Course')),
            ],
            options={
                'ordering': ['dept', 'number'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Friend_Relationship',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_time', models.CharField(max_length=20)),
                ('end_time', models.CharField(max_length=20)),
                ('days', models.CharField(max_length=10)),
                ('location', models.CharField(max_length=50)),
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
            name='Nice_User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(default=django.utils.timezone.now, verbose_name='last login')),
                ('netid', models.CharField(max_length=20)),
                ('friends', models.ManyToManyField(to='course_selection.Nice_User', through='course_selection.Friend_Relationship')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'schedule', max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('isDefault', models.BooleanField(default=False)),
                ('section_type', models.CharField(max_length=3, choices=[(b'CLA', b'class'), (b'DRI', b'drill'), (b'LAB', b'lab'), (b'LEC', b'lecture'), (b'PRE', b'precept'), (b'SEM', b'seminar'), (b'STU', b'studio')])),
                ('course', models.ForeignKey(to='course_selection.Course')),
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
                ('term_code', models.CharField(default=1152, max_length=4)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='schedule',
            name='semester',
            field=models.ForeignKey(to='course_selection.Semester'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='schedule',
            name='user',
            field=models.ForeignKey(to='course_selection.Nice_User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='meeting',
            name='section',
            field=models.ForeignKey(to='course_selection.Section'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='friend_relationship',
            name='from_user',
            field=models.ForeignKey(related_name='from_users', to='course_selection.Nice_User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='friend_relationship',
            name='to_user',
            field=models.ForeignKey(related_name='to_users', to='course_selection.Nice_User'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='friend_relationship',
            unique_together=set([('from_user', 'to_user')]),
        ),
        migrations.AddField(
            model_name='course',
            name='professors',
            field=models.ManyToManyField(to='course_selection.Professor'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='course',
            name='semester',
            field=models.ForeignKey(to='course_selection.Semester'),
            preserve_default=True,
        ),
    ]
