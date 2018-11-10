from django.urls import path
from . import views


urlpatterns = [
    path('getlist', views.HomeView.as_view(), name='getlist'),
    path('run', views.run, name='run'),
]
