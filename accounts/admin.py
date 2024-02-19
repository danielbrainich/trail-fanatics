from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserInterest

admin.site.register(UserInterest)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("bio", "profile_picture")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("bio", "profile_picture", "contact_email")}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
