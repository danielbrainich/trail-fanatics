from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from .views import (
    signup_view,
    user_list,
    user_detail,
    user_interest_list,
    user_interest_detail,
    custom_login,
    custom_logout,
    current_user
)

urlpatterns = [
    # User Profile
    path("profiles/", user_list, name="user_profile_list"),
    path("profiles/<int:pk>/", user_detail, name="user_profile_detail"),
    # User Interest
    path("interests/", user_interest_list, name="user_interest_list"),
    path("interests/<int:pk>/", user_interest_detail, name="user_interest_detail"),
    # User Auth
    path('login/', custom_login, name='custom_login'),
    path("logout/", custom_logout, name="logout"),
    path("signup/", signup_view, name="signup"),
    path("current_user/", current_user, name="current_user"),

]
