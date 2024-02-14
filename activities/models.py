from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Trail(models.Model):
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_trails",
    )
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=280)
    link = models.URLField(max_length=200, null=True, help_text="Enter a valid URL")
    image = models.ImageField(upload_to="trail_images/", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Race(models.Model):
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_races"
    )
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=280)
    link = models.URLField(max_length=200, null=True, help_text="Enter a valid URL")
    image = models.ImageField(upload_to="race_images/", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserTrail(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_trails",
    )
    trail = models.ForeignKey(
        Trail, on_delete=models.CASCADE, related_name="trail_followers"
    )


class UserRace(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="races"
    )
    race = models.ForeignKey(
        Race, on_delete=models.CASCADE, related_name="race_followers"
    )
