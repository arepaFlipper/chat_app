# Import the admin module from Django's contrib package
from django.contrib import admin

# Import the models that need to be registered with the admin interface
from api.models import User, Profile, Todo, ChatMessage, VerificationCode

# Define a ModelAdmin class for the User model
class UserAdmin(admin.ModelAdmin):
    # Specify the fields to be displayed in the list view of the admin interface
    list_display = ['username', 'email', 'phone_number']

class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'number']

# Define a ModelAdmin class for the Profile model
class ProfileAdmin(admin.ModelAdmin):
    # Specify fields that can be edited directly from the list view
    list_editable = ['verified']
    # Specify the fields to be displayed in the list view
    list_display = ['user', 'full_name', 'verified']

# Define a ModelAdmin class for the Todo model
class TodoAdmin(admin.ModelAdmin):
    # Specify fields that can be edited directly from the list view
    list_editable = ['completed']
    # Specify the fields to be displayed in the list view
    list_display = ['user', 'title', 'completed', 'date']

# Define a ModelAdmin class for the ChatMessage model
class ChatMessageAdmin(admin.ModelAdmin):
    # Specify fields that can be edited directly from the list view
    list_editable = ['is_read']
    # Specify the fields to be displayed in the list view
    list_display = ['sender', 'receiver', 'message', 'is_read']

# Register the ModelAdmin classes with their respective models in the admin interface
admin.site.register(User, UserAdmin)
admin.site.register(VerificationCode, VerificationCodeAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Todo, TodoAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)

