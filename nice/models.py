from django.db import models

# Create your models here.
# To start using the database: python manage.py syncdb
# Run python manage.py sql nice to see SQL for our models.
# To apply a model: python manage.py syncdb again. (This changes in later versions of Django, beware!)

class Event(models.Model):
    date = models.DateTimeField('event date')
    def __unicode__(self): 
		return repr(self.date.isoformat()) # self.date