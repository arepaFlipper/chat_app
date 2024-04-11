from api.models import User, Todo, ChatMessage, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .verify_with_own_code import send_sms

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.
    """
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user", "full_name", "image", "username", "verified" ]

    def get_username(self, obj):
        return obj.user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer extending TokenObtainPairSerializer.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Custom claims
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified
        # ...

        return token

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'phone_number')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number']
        )

        user.set_password(validated_data['password'])
        user.save()
        verification_code = user.verificationcode.number
        # TODO: send sms
        # response = send_sms(user.phone_number,verification_code)
        response = send_sms(user.phone_number,verification_code)

        return user

class TodoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Todo model.
    """
    class Meta:
        model = Todo
        fields = ['id', 'user', 'title', 'completed']

class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the ChatMessage model.
    """
    receiver_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "user","sender", "sender_profile", "receiver", "receiver_profile", "message", "is_read" , "date"]

