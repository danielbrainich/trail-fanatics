from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from .models import UserProfile, UserInterest
from .serializers import UserProfileSerializer, UserInterestSerializer, UserSerializer
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.http import require_POST
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required


import json


# User Auth views
User = get_user_model()

@login_required
def current_user(request):
    user_data = UserSerializer(request.user).data
    return JsonResponse(user_data)

@require_POST
def custom_logout(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully"})

@api_view(['POST'])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"success": True, "message": "Login successful"})
    else:
        return Response({"success": False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@require_http_methods(["POST"])
def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"}, status=400
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)

        return JsonResponse({"message": "User created successfully"})

    return JsonResponse({"error": "Method Not Allowed"}, status=405)


# User Profile views
@require_http_methods(["GET", "POST"])
def user_profile_list(request):
    if request.method == "GET":
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = UserProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@require_http_methods(["GET", "PUT", "DELETE"])
def user_profile_detail(request, pk):
    profile = get_object_or_404(UserProfile, pk=pk)
    if request.method == "GET":
        serializer = UserProfileSerializer(profile)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = UserProfileSerializer(profile, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == "DELETE":
        profile.delete()
        return JsonResponse({"message": "Profile deleted successfully"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


# User Interest views
@require_http_methods(["GET", "POST"])
def user_interest_list(request):
    if request.method == "GET":
        interests = UserInterest.objects.all()
        serializer = UserInterestSerializer(interests, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = UserInterestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@require_http_methods(["GET", "PUT", "DELETE"])
def user_interest_detail(request, pk):
    interest = get_object_or_404(UserInterest, pk=pk)
    if request.method == "GET":
        serializer = UserInterestSerializer(interest)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = UserInterestSerializer(interest, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == "DELETE":
        interest.delete()
        return JsonResponse({"message": "Interest deleted successfully"}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
