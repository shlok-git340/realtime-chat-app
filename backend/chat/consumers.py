import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth.models import User

from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        self.room_name = f'user_{self.user_id}'

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

        print(f'User {self.user_id} connected')

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

        print(f'User {self.user_id} disconnected')

    async def receive(self, text_data):
        data = json.loads(text_data)

        sender_id = data['sender_id']
        receiver_id = data['receiver_id']
        message = data['message']

        receiver_room = f'user_{receiver_id}'

        await self.save_message(
            sender_id,
            receiver_id,
            message
        )

        await self.channel_layer.group_send(
            receiver_room,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'receiver_id': receiver_id,
            }
        )

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'receiver_id': receiver_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id'],
        }))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
        )