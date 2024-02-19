from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser, UserInterest


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio']


class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = ["id", "user", "tag"]
