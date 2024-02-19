from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from .models import UserInterest
from .serializers import UserInterestSerializer, CustomUserSerializer
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
import json

CustomUser = get_user_model()


@login_required
@api_view(["GET"])
def current_user(request):
    user_data = CustomUserSerializer(request.user).data
    return JsonResponse(user_data)


@api_view(["POST"])
def custom_logout(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully"})


@api_view(["POST"])
def custom_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"success": True, "message": "Login successful"})
    else:
        return Response(
            {"success": False, "message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["POST"])
def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"}, status=400
            )

        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = CustomUser.objects.create_user(username=username, password=password)

        return JsonResponse({"message": "User created successfully"})
    else:
        return JsonResponse({"error": "Method Not Allowed"}, status=405)


@api_view(["GET", "POST"])
def user_interest_list(request):
    if request.method == "GET":
        interests = UserInterest.objects.all()
        serializer = UserInterestSerializer(interests, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = UserInterestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def user_interest_detail(request, pk):
    interest = get_object_or_404(UserInterest, pk=pk)
    if request.method == "GET":
        serializer = UserInterestSerializer(interest)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = UserInterestSerializer(interest, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        interest.delete()
        return JsonResponse(
            {"message": "Interest deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


@api_view(["GET", "POST"])
def user_list(request):
    if request.method == "GET":
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def user_detail(request, pk):
    user = get_object_or_404(CustomUser, pk=pk)
    if request.method == "GET":
        serializer = CustomUserSerializer(user)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        user.delete()
        return JsonResponse(
            {"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )
