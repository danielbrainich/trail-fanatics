from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from accounts.forms import LoginForm, SignupForm, Custom_Password_Change_Form
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


def account_login(request):
    if request.method == "POST":
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            username = login_form.cleaned_data["username"]
            password = login_form.cleaned_data["password"]
            user = authenticate(
                request,
                username=username,
                password=password,
            )
            if user is not None:
                login(request, user)
                return redirect("home")
    else:
        login_form = LoginForm()

    context = {"login_form": login_form}
    return render(request, "accounts/login.html", context)


@login_required
def account_logout(request):
    logout(request)
    return redirect("login")


def account_signup(request):
    if request.method == "POST":
        signup_form = SignupForm(request.POST)
        if signup_form.is_valid():
            username = signup_form.cleaned_data["username"]
            password = signup_form.cleaned_data["password"]
            if User.objects.filter(username=username).exists():
                signup_form.add_error("username", "The username is already taken")
            else:
                user = User.objects.create_user(username, password=password)
                login(request, user)
                return redirect("home")
        else:
            signup_form.add_error(
                None, "Could not create account. Please check the form"
            )
    else:
        signup_form = SignupForm()

    context = {
        "signup_form": signup_form,
    }
    return render(request, "accounts/signup.html", context)


class PasswordsChangeView(PasswordChangeView, LoginRequiredMixin, TemplateView):
    form_class = Custom_Password_Change_Form
    success_url = reverse_lazy("password_success")


@login_required
def password_success(request):
    return render(request, "accounts/password_success.html", {})
