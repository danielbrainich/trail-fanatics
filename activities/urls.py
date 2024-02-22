from django.urls import path
from .views import (
    trail_list,
    trail_detail,
)


urlpatterns = [
    # Trails
    path("trails/", trail_list, name="trail_list"),
    path("trails/<int:pk>/", trail_detail, name="trail_detail"),
]
