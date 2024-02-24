from django.urls import path
from .views import (
    trail_list,
    trail_detail,
    saved_trail_list,
    saved_trail_detail,
)


urlpatterns = [
    # All trails
    path("trails/", trail_list, name="trail_list"),
    path("trails/<int:pk>/", trail_detail, name="trail_detail"),
    # Saved trails
    path("saved_trails/", saved_trail_list, name="saved_trail_list"),
    path("saved_trails/<int:pk>/", saved_trail_detail, name="saved_trail_detail"),
]
