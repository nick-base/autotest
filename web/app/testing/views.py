from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    context = {'msg': 'Hello world'}
    return render(request, 'index.html', context)
