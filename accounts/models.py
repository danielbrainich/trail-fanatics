from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )

    def __str__(self):
        return f"{self.username}'s profile"


class UserInterest(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="interests"
    )
    tag = models.ForeignKey(
        "content.Tag", on_delete=models.CASCADE, related_name="interested_users"
    )

    class Meta:
        unique_together = ("user", "tag")

    def __str__(self):
        return f"{self.username}'s interest in {self.tag.name}"
