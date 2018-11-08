from django.urls import path
from . import views

vs = {
    '': views.HomeView,
    'demo': views.DemoView,
    'ajinga': views.AjingaView,
    'common': views.CommonView,
    'case': views.CaseView,
}

urlpatterns = [
    path(v, vs[v].as_view(), name=v) for v in vs
]

urlpatterns += [
    path('run', views.run, name='run'),
]
