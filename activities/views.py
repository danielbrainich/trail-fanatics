from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Trail, Race, UserTrail, UserRace
from .serializers import (
    TrailSerializer,
    RaceSerializer,
    UserTrailSerializer,
    UserRaceSerializer,
)

# Trail views
@require_http_methods(["GET", "POST"])
def trail_list(request):
    if request.method == "GET":
        trails = Trail.objects.all()
        serializer = TrailSerializer(trails, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = TrailSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def trail_detail(request, pk):
    trail = get_object_or_404(Trail, pk=pk)
    if request.method == "GET":
        serializer = TrailSerializer(trail)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = TrailSerializer(trail, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        trail.delete()
        return JsonResponse({"message": "Trail deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# Race views
@require_http_methods(["GET", "POST"])
def race_list(request):
    if request.method == "GET":
        races = Race.objects.all()
        serializer = RaceSerializer(races, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = RaceSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@require_http_methods(["GET", "PUT", "DELETE"])
def race_detail(request, pk):
    race = get_object_or_404(Race, pk=pk)
    if request.method == "GET":
        serializer = RaceSerializer(race)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = RaceSerializer(race, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        race.delete()
        return JsonResponse({"message": "Race deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# UserTrail views
@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_trail_list(request):
    if request.method == "GET":
        user_trails = UserTrail.objects.filter(user=request.user)
        serializer = UserTrailSerializer(user_trails, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = UserTrailSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def user_trail_detail(request, pk):
    user_trail = get_object_or_404(UserTrail, pk=pk, user=request.user)

    if request.method == "GET":
        serializer = UserTrailSerializer(user_trail)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        serializer = UserTrailSerializer(user_trail, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == "DELETE":
        user_trail.delete()
        return JsonResponse({"message": "UserTrail deleted"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])

# UserRace views
@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_race_list(request):
    if request.method == "GET":
        user_races = UserRace.objects.filter(user=request.user)
        serializer = UserRaceSerializer(user_races, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        serializer = UserRaceSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def user_race_detail(request, pk):
    user_race = get_object_or_404(UserRace, pk=pk, user=request.user)

    if request.method == "GET":
        serializer = UserRaceSerializer(user_race)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        serializer = UserRaceSerializer(user_race, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == "DELETE":
        user_race.delete()
        return JsonResponse({"message": "UserRace deleted"}, status=204)

    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
