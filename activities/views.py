from django.shortcuts import get_object_or_404
from .models import Trail, SavedTrail
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    TrailSerializer,
    SavedTrailSerializer,
)


# Trails views
@api_view(["GET", "POST"])
def trail_list(request):
    if request.method == "GET":
        trails = Trail.objects.all()
        serializer = TrailSerializer(trails, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)
        serializer = TrailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "DELETE", "PUT"])
def trail_detail(request, pk):
    trail = get_object_or_404(Trail, pk=pk)
    if request.method == 'GET':
        serializer = TrailSerializer(trail)
        return Response(serializer.data)
    elif request.method in ['DELETE', 'PUT']:
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)
        if request.user != trail.creator:
            return Response({"detail": "You do not have permission to modify or delete this trail."}, status=403)
        if request.method == 'DELETE':
            trail.delete()
            return Response(status=204)
        elif request.method == 'PUT':
            serializer = TrailSerializer(trail, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)


#Saved trail views
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def saved_trail_list(request):
    if request.method == "GET":
        saved_trails = SavedTrail.objects.filter(user=request.user)
        serializer = SavedTrailSerializer(saved_trails, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = SavedTrailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def saved_trail_detail(request, pk):
    saved_trail = get_object_or_404(SavedTrail, pk=pk, user=request.user)
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=401)
    saved_trail.delete()
    return Response(status=204)
