from django.contrib import admin
from .models import UserProfile, UserInterest

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(UserInterest)
