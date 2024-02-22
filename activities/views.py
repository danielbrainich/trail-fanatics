from django.shortcuts import get_object_or_404
from .models import Trail, UserTrail
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import (
    TrailSerializer,
    UserTrailSerializer,
)

# All trails views
@api_view(['GET'])
def trail_list(request):
    trails = Trail.objects.all()
    serializer = TrailSerializer(trails, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def trail_detail(request, pk):
    trail = get_object_or_404(Trail, pk=pk)
    serializer = TrailSerializer(trail)
    return Response(serializer.data)


# User trails views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_trail_list(request):
    if request.method == "GET":
        user_trails = UserTrail.objects.filter(user=request.user)
        serializer = UserTrailSerializer(user_trails, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = UserTrailSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_trail_detail(request, pk):
    user_trail = get_object_or_404(UserTrail, pk=pk, user=request.user)

    if request.method == "GET":
        serializer = UserTrailSerializer(user_trail)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserTrailSerializer(user_trail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == "DELETE":
        user_trail.delete()
        return Response(status=204)
