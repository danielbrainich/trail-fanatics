from django.urls import path
from .views import (
    trail_list,
    trail_detail,
    user_trail_list,
    user_trail_detail,
)


urlpatterns = [
    # All trails
    path("trails/", trail_list, name="trail_list"),
    path("trails/<int:pk>/", trail_detail, name="trail_detail"),
    # User trails
    path("my_trails/", user_trail_list, name="user_trail_list"),
    path("my_trails/<int:pk>/", user_trail_detail, name="user_trail_detail"),
]
