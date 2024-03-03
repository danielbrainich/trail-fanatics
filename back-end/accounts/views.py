from django.shortcuts import get_object_or_404
from .serializers import CustomUserSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import login, authenticate, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser


CustomUser = get_user_model()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    user_data = CustomUserSerializer(request.user).data
    response = Response(user_data)
    response["Access-Control-Allow-Credentials"] = "true"
    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def custom_logout(request):
    logout(request)
    response = Response({"success": True, "message": "Logged out successfully"})
    response["Access-Control-Allow-Credentials"] = "true"  
    return response


@api_view(["POST"])
def custom_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        response = Response({"success": True, "message": "Login successful"})
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    else:
        return Response(
            {"success": False, "message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["POST"])
def signup_view(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = CustomUser.objects.create_user(username=username, password=password)
        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def user_list(request):
    users = CustomUser.objects.all()
    serializer = CustomUserSerializer(users, many=True)
    response = Response(serializer.data)
    response["Access-Control-Allow-Credentials"] = "true"
    return response


@api_view(["GET", "PUT"])
def user_detail(request, pk):
    user = get_object_or_404(CustomUser, pk=pk)

    if request.method == "GET":
        serializer = CustomUserSerializer(user)
        response = Response(serializer.data)
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    if request.method == "PUT":
        if request.user.is_authenticated and request.user.pk == user.pk:
            serializer = CustomUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response = Response(serializer.data)
                response["Access-Control-Allow-Credentials"] = "true"
                return response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        else:
            return Response(
                {"detail": "You do not have permission to edit this user."},
                status=status.HTTP_403_FORBIDDEN,
            )
