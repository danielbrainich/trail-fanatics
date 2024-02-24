from rest_framework import serializers, viewsets
from .models import Trail, SavedTrail


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


class SavedTrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedTrail
        fields = ["id", "user", "trail"]
