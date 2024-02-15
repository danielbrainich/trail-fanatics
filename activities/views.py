from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Trail, Race, UserTrail, UserRace

# Trail views
def trail_list(request):
    trails = Trail.objects.all()
    # Serialize trails and return JSON response
    return JsonResponse([...], safe=False)

def trail_detail(request, pk):
    trail = get_object_or_404(Trail, pk=pk)
    # Serialize trail and return JSON response
    return JsonResponse({...})

# Race views
def race_list(request):
    races = Race.objects.all()
    # Serialize races and return JSON response
    return JsonResponse([...], safe=False)

def race_detail(request, pk):
    race = get_object_or_404(Race, pk=pk)
    # Serialize race and return JSON response
    return JsonResponse({...})

# UserTrail views
def usertrail_list(request):
    usertrails = UserTrail.objects.all()
    # Serialize usertrails and return JSON response
    return JsonResponse([...], safe=False)

# UserRace views
def userrace_list(request):
    userraces = UserRace.objects.all()
    # Serialize userraces and return JSON response
    return JsonResponse([...], safe=False)
