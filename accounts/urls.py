from django.urls import path
from .views import (
    user_profile_list,
    user_profile_detail,
    user_interest_list,
    user_interest_detail,
)

urlpatterns = [
    # User Profile
    path("profiles/", user_profile_list, name="user_profile_list"),
    path("profiles/<int:pk>/", user_profile_detail, name="user_profile_detail"),

    # User Interest
    path("interests/", user_interest_list, name="user_interest_list"),
    path("interests/<int:pk>/", user_interest_detail, name="user_interest_detail"),
]
