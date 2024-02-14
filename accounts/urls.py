from django.urls import path
from accounts.views import (
    account_login,
    account_logout,
    account_signup,
    password_success,
)
from accounts.views import PasswordsChangeView

urlpatterns = [
    path("login/", account_login, name="login"),
    path("logout/", account_logout, name="logout"),
    path("signup/", account_signup, name="signup"),
    path(
        "password/",
        PasswordsChangeView.as_view(template_name="accounts/change_password.html"),
        name="change_password",
    ),
    path("password/success", password_success, name="password_success"),
]
