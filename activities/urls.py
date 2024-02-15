from django.urls import path
from .views import (
    trail_list,
    trail_detail,
    race_list,
    race_detail,
)

urlpatterns = [
    # Trails
    path("trails/", trail_list, name="trail_list"),
    path("trails/<int:pk>/", trail_detail, name="trail_detail"),

    # Races
    path("races/", race_list, name="race_list"),
    path("races/<int:pk>/", race_detail, name="race_detail"),
]
