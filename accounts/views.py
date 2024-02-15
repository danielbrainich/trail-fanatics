from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import UserProfile, UserInterest

# UserProfile views
def user_profile_list(request):
    profiles = UserProfile.objects.all()
    # Serialize profiles and return JSON response
    return JsonResponse([...], safe=False)

def user_profile_detail(request, pk):
    profile = get_object_or_404(UserProfile, pk=pk)
    # Serialize profile and return JSON response
    return JsonResponse({...})

# UserInterest views
def user_interest_list(request):
    interests = UserInterest.objects.all()
    # Serialize interests and return JSON response
    return JsonResponse([...], safe=False)

def user_interest_detail(request, pk):
    interest = get_object_or_404(UserInterest, pk=pk)
    # Serialize interest and return JSON response
    return JsonResponse({...})
