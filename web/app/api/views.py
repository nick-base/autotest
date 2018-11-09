from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
import json
from .projects.list import projects

class HomeView(View):
    def get(self, request, *args, **kwargs):
        data = {}
        data['status'] = 'success'
        data['message'] = 'Test Sucess'
        return HttpResponse(json.dumps(projects), content_type="application/json")
