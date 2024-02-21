from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "first_name", "last_name", "bio", "password"]
