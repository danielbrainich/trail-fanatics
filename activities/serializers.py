from rest_framework import serializers
from .models import Trail, Race, UserTrail, UserRace

class TrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trail
        fields = ['id', 'creator', 'name', 'description', 'link', 'image', 'created_at', 'updated_at']

class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ['id', 'creator', 'name', 'description', 'link', 'image', 'created_at', 'updated_at']

class UserTrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTrail
        fields = ['id', 'user', 'trail']

class UserRaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRace
        fields = ['id', 'user', 'race']
