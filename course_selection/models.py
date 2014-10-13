from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from colorfield.fields import ColorField
from django.core.cache import cache
from django.template import Template, Context
import datetime

class Course(models.Model):
    title = models.TextField()
