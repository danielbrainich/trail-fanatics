from rest_framework import serializers, viewsets
from .models import Trail, SavedTrail
from accounts.serializers import CustomUserSerializer



class TrailSerializer(serializers.ModelSerializer):
    creator = CustomUserSerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()


    class Meta:
        model = Trail
        fields = [
            "id",
            "creator",
            "name",
            "description",
            "image",
            "is_saved",
            "coordinates",
            "created_at",
            "updated_at",
        ]

    def get_is_saved(self, obj):
        user = self.context.get('request').user if 'request' in self.context else None
        if user and user.is_authenticated:
            return SavedTrail.objects.filter(user=user, trail=obj).exists()
        return False


class TrailViewSet(viewsets.ModelViewSet):
    queryset = Trail.objects.all()
    serializer_class = TrailSerializer


class SavedTrailSerializer(serializers.ModelSerializer):
    trail = TrailSerializer(read_only=True)

    class Meta:
        model = SavedTrail
        fields = ['id', 'trail']


class SimpleSavedTrailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedTrail
        fields = ['id', 'trail']
