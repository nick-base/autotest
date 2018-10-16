from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    # path('demo', views.demo, name='demo'),
    path('ajinga', views.ajinga, name='ajinga'),
    path('common', views.common, name='common'),

    path('run', views.run, name='run'),
]