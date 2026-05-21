from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.db.models import Q

from .models import Message
from .serializers import MessageSerializer, UserSerializer


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.exclude(id=request.user.id)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        messages = Message.objects.filter(
            Q(sender=request.user, receiver_id=user_id) |
            Q(sender_id=user_id, receiver=request.user)
        )

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data)