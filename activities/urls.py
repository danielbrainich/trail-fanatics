from django.urls import path
from .views import (
    trail_list,
    trail_detail,
    saved_trails_list,
    manage_saved_trail,
)


urlpatterns = [
    # All trails
    path("trails/", trail_list, name="trail_list"),
    path("trails/<int:pk>/", trail_detail, name="trail_detail"),
    # Saved trails
    path('saved_trails/', saved_trails_list, name='saved_trails_detail_list'),
    path('saved_trails/<int:trail_id>/', manage_saved_trail, name='manage_saved_trail'),
]
