from django.shortcuts import get_object_or_404
from .models import Trail, SavedTrail
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import (
    TrailSerializer,
    SavedTrailSerializer,
    SimpleSavedTrailSerializer,
)


class TrailPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total": self.page.paginator.count,
                "page_size": self.page_size,
                "current_page": self.page.number,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )


# Trails views
@api_view(["GET", "POST"])
def trail_list(request):
    if request.method == "GET":
        trails = Trail.objects.all()
        paginator = TrailPagination()
        result_page = paginator.paginate_queryset(trails, request)
        serializer = TrailSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."}, status=401
            )
        serializer = TrailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "DELETE", "PUT"])
def trail_detail(request, pk):
    trail = get_object_or_404(Trail, pk=pk)
    if request.method == "GET":
        serializer = TrailSerializer(trail)
        return Response(serializer.data)
    elif request.method in ["DELETE", "PUT"]:
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."}, status=401
            )
        if request.user != trail.creator:
            return Response(
                {
                    "detail": "You do not have permission to modify or delete this trail."
                },
                status=403,
            )
        if request.method == "DELETE":
            trail.delete()
            return Response(status=204)
        elif request.method == "PUT":
            serializer = TrailSerializer(trail, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def saved_trails_list(request):
    saved_trails = SavedTrail.objects.filter(user=request.user)
    paginator = TrailPagination()
    result_page = paginator.paginate_queryset(saved_trails, request)
    serializer = SavedTrailSerializer(saved_trails, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_saved_trail(request, trail_id):
    if request.method == "POST":
        trail = get_object_or_404(Trail, pk=trail_id)
        saved_trail, created = SavedTrail.objects.get_or_create(
            user=request.user, trail=trail
        )
        if created:
            serializer = SimpleSavedTrailSerializer(saved_trail)
            return Response(serializer.data, status=201)
        else:
            return Response({"detail": "Trail already saved."}, status=400)
    elif request.method == "DELETE":
        saved_trail = get_object_or_404(
            SavedTrail, user=request.user, trail_id=trail_id
        )
        saved_trail.delete()
        return Response(status=204)
