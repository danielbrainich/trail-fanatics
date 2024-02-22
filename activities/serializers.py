from rest_framework import serializers, viewsets
from .models import Trail, UserTrail


class TrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trail
        fields = [
            "id",
            "creator",
            "name",
            "description",
            "image",
            "coordinates",
            "created_at",
            "updated_at",
        ]


class TrailViewSet(viewsets.ModelViewSet):
    queryset = Trail.objects.all()
    serializer_class = TrailSerializer


class UserTrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTrail
        fields = ["id", "user", "trail"]
