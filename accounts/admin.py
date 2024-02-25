from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Avatar


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("bio", "profile_picture", "avatar")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("bio", "profile_picture", "avatar")}),
    )

@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = ('id', 'description')

admin.site.register(CustomUser, CustomUserAdmin)
