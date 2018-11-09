from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

class BaseView(View):
    def __init__(self):
        super(BaseView, self).__init__()
        self.tempdict = {}

class HomeView(BaseView):
    def get(self, request, *args, **kwargs):
        return render(request, "index.html", self.tempdict)
