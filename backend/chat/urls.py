from django.urls import path
from .views import UserListView, ChatMessagesView

urlpatterns = [
    path('users/', UserListView.as_view()),
    path('messages/<int:user_id>/', ChatMessagesView.as_view()),
]