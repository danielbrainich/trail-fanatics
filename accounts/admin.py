from django.contrib import admin
from .models import UserProfile, UserInterest

# Register your models here.

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_username', 'bio', 'contact_email')

    def get_username(self, obj):
        return obj.user.username
    get_username.admin_order_field = 'user__username'
    get_username.short_description = 'Username'

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserInterest)
