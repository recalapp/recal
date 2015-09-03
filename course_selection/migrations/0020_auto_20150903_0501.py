# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_selection', '0019_auto_20150903_0458'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friend_Request',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('accepted', models.BooleanField(default=False)),
                ('from_user', models.ForeignKey(related_name='from_users', to='course_selection.Nice_User')),
                ('to_user', models.ForeignKey(related_name='to_users', to='course_selection.Nice_User')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='friend_request',
            unique_together=set([('from_user', 'to_user')]),
        ),
        migrations.AddField(
            model_name='nice_user',
            name='friends',
            field=models.ManyToManyField(related_name='friends_rel_+', to='course_selection.Nice_User'),
            preserve_default=True,
        ),
    ]
