from django.db import models
from django.contrib.auth.models import AbstractUser

AVATAR_CHOICES = (
    ("sunglasses", "Sunglasses"),
    ("dog", "Dog"),
    ("mountains", "Mountain"),
    ("map", "Map"),
    ("bottle", "Bottle"),
    ("shoe", "shoe"),
)


class CustomUser(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    avatar = models.CharField(max_length=100, choices=AVATAR_CHOICES, default="shoe")

    def __str__(self):
        return f"{self.username}'s profile"
