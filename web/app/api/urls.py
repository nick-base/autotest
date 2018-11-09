from django.urls import path
from . import views


urlpatterns = [
    path('test', views.HomeView.as_view(), name='test'),
]
