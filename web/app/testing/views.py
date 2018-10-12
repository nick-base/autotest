from django.http import HttpResponse
from django.shortcuts import render
from .core.test import Test

from .config_list import config_list
from .config_list_ajinga import config_list as aj_list

config_map = {
    'demo': config_list,
    'ajinga': aj_list,
}

def home(request):
    context = {
        'config_map': config_map
    }
    return render(request, 'home.html', context)

def demo(request):
    context = {
        'config_map': config_map,
        'config_list': config_list,
        'project': 'demo',
    }
    return render(request, 'index.html', context)

def ajinga(request):
    context = {
        'config_map': config_map,
        'config_list': aj_list,
        'project': 'ajinga',
    }
    return render(request, 'index.html', context)

def run(request):
    if request.method=='GET':
        project = request.GET.get('project')
        group = request.GET.get('group')
        name = request.GET.get('name')
        if project:
            configs = config_map[project]
            config = [c for c in configs if c['name'] == group]
            if config:
                items = config[0]['items']
                item = [i for i in items if i['name'] == name]
                if item:
                    param = (item[0]['file'], item[0]['data'])
                    t = Test(param)
                    t.run()
        return HttpResponse("project: %s, group: %s, name: %s" % (project, group, name))
