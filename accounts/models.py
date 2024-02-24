from django.db import models
from django.contrib.auth.models import AbstractUser


class Avatar(models.Model):
    image = models.ImageField(upload_to="avatars/")
    description = models.CharField(max_length=100)

    def __str__(self):
        return self.description


class CustomUser(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    avatar = models.ForeignKey(
        Avatar,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    
    def __str__(self):
        return f"{self.username}'s profile"
