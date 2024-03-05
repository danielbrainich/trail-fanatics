from django.urls import path
from .views import (
    signup_view,
    user_detail,
    custom_login,
    custom_logout,
    current_user,
)

urlpatterns = [
    # User Profile
    path("profiles/<int:pk>/", user_detail, name="user_profile_detail"),
    # User Auth
    path("login/", custom_login, name="custom_login"),
    path("logout/", custom_logout, name="logout"),
    path("signup/", signup_view, name="signup"),
    path("current_user/", current_user, name="current_user")
]
