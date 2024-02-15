from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from .models import UserProfile, UserInterest
from .serializers import UserProfileSerializer, UserInterestSerializer
from rest_framework.parsers import JSONParser



# User Profile views
@require_http_methods(["GET", "POST"])
def user_profile_list(request):
    if request.method == 'GET':
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
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
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserProfileSerializer(profile, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        profile.delete()
        return JsonResponse({'message': 'Profile deleted successfully'}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


# User Interest views
@require_http_methods(["GET", "POST"])
def user_interest_list(request):
    if request.method == 'GET':
        interests = UserInterest.objects.all()
        serializer = UserInterestSerializer(interests, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
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
    if request.method == 'GET':
        serializer = UserInterestSerializer(interest)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserInterestSerializer(interest, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        interest.delete()
        return JsonResponse({'message': 'Interest deleted successfully'}, status=204)
    else:
        return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
