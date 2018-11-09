from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name=''),
    path('demo', views.DemoView.as_view(), name='demo'),
    path('ajinga', views.AjingaView.as_view(), name='ajinga'),
    path('common', views.CommonView.as_view(), name='common'),
    path('case', views.CaseView.as_view(), name='case'),
]

urlpatterns += [
    path('run', views.run, name='run'),
]
