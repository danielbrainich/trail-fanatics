from django.http import (
    JsonResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    HttpResponse,
)
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import Trail, UserTrail
from .models import Trail
from rest_framework.response import Response
import json


from .serializers import (
    TrailSerializer,
    UserTrailSerializer,
)


@require_http_methods(["GET", "POST"])
def trail_list(request):
    if request.method == "GET":
        trails = Trail.objects.all()
        serializer = TrailSerializer(trails, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        data = json.loads(request.body)
        serializer = TrailSerializer(data=data)
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
        data = json.loads(request.body)
        serializer = TrailSerializer(trail, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == "DELETE":
        trail.delete()
        return JsonResponse({"message": "Trail deleted"}, status=204)
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
