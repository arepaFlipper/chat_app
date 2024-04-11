from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Subquery, OuterRef, Q

from api.models import User, Todo, ChatMessage, Profile

from api.serializer import (
    MyTokenObtainPairSerializer, RegisterSerializer, TodoSerializer, 
    MessageSerializer, ProfileSerializer)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


class TodoListView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        todo = Todo.objects.filter(user=user) 
        return todo
    

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        todo_id = self.kwargs['todo_id']

        user = User.objects.get(id=user_id)
        todo = Todo.objects.get(id=todo_id, user=user)

        return todo
    

class TodoMarkAsCompleted(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        todo_id = self.kwargs['todo_id']

        user = User.objects.get(id=user_id)
        todo = Todo.objects.get(id=todo_id, user=user)

        todo.completed = True
        todo.save()

        return todo

# Define a view to retrieve messages for a user's inbox
class MyInbox(generics.ListAPIView):
    # Define the serializer class to serialize the retrieved messages
    serializer_class = MessageSerializer

    # Define a method to fetch the queryset of messages for the user's inbox
    def get_queryset(self):
        # Retrieve the user_id from the URL kwargs
        user_id = self.kwargs['user_id']

        # Retrieve messages from ChatMessage model
        messages = ChatMessage.objects.filter(
            # Filter messages based on their IDs
            id__in =  Subquery(
                # Subquery to filter distinct users involved in conversations
                User.objects.filter(
                    Q(sender__receiver=user_id) |  # Filter messages where user is the sender
                    Q(receiver__sender=user_id)     # Filter messages where user is the receiver
                ).distinct().annotate(
                    # Annotate each user with the ID of their last message
                    last_msg=Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef('id'), receiver=user_id) |  # Filter user's sent messages
                            Q(receiver=OuterRef('id'), sender=user_id)     # Filter user's received messages
                        ).order_by('-id')[:1].values_list('id', flat=True)  # Order by ID and get the last message
                    )
                ).values_list('last_msg', flat=True).order_by("-id")  # Get the ID of the last message for each user
            )
        ).order_by("-id")  # Order the messages by their IDs in descending order (latest messages first)
            
        return messages  # Return the queryset of messages

# Define a view to retrieve messages between two specific users
class GetMessages(generics.ListAPIView):
    # Define the serializer class to serialize the retrieved messages
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    # Define a method to fetch the queryset of messages between the specified users
    def get_queryset(self):
        # Retrieve the sender_id and receiver_id from the URL kwargs
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        # Retrieve messages from ChatMessage model based on sender and receiver IDs
        messages = ChatMessage.objects.filter(
            # Filter messages where the sender is either sender_id or receiver_id
            sender__in=[sender_id, receiver_id],
            # Filter messages where the receiver is either sender_id or receiver_id
            receiver__in=[sender_id, receiver_id],
        )
        return messages  # Return the queryset of messages

class SendMessage(generics.CreateAPIView):
    """
    View for sending a message.
    """
    serializer_class = MessageSerializer

class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    View for retrieving and updating user profile details.
    """
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]

class VerifyProfile(generics.GenericAPIView):
    """
    View for verifying a user's profile.
    """
    def post(self, request):
        user = request.user
        user.profile.save()
        return Response({"details": "Profile verified successfully"}, status=status.HTTP_200_OK)


class SearchUser(generics.ListAPIView):
    """
    View for searching users by username, full name, or email.
    """
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        """
        Custom list method for searching users by username, full name, or email.
        """
        username = self.kwargs['username']
        logged_in_user = self.request.user

        # Filtering users based on username, full name, or email
        users = Profile.objects.filter(
            Q(user__username__icontains=username) |
            Q(full_name__icontains=username) |
            Q(user__email__icontains=username)
        )

        # If no users found, return 404
        if not users.exists():
            return Response({"details": "No user found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the users
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

def verify(request):
    primary_key = request.session.get('primary_key')
    form = request.POST
    if primary_key:
        profile = Profile.objects.get(user_id=primary_key)
        user = User.objects.get(id=primary_key)
        username = user.username
        verification_code = profile.user.verification_code
        code_user = f"{username}: {verification_code}"
        if not request.POST:
            # send sms
            pass

        if form.is_valid():
            number = form.cleaned_data['number']

            if str(verification_code) == num:
                verification_code.save()
                return redirect('home')
            else:
                return redirect()
        return render(request, 'verify.html', {'form': form})
