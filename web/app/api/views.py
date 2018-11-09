from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
import json

class HomeView(View):
    def get(self, request, *args, **kwargs):
        data = {}
        data['status'] = 'success'
        data['message'] = 'Test Sucess'
        return HttpResponse(json.dumps(data), content_type="application/json")
