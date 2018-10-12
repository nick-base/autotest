from django.http import HttpResponse
from django.shortcuts import render
from .config_list import config_list
from .core.test import Test

def index(request):
    context = {'config_list': config_list}
    return render(request, 'index.html', context)

def run(request):
    if request.method=='GET':
        group = request.GET.get('group')
        name = request.GET.get('name')
        config = [c for c in config_list if c['name'] == group]
        if config:
            items = config[0]['items']
            item = [i for i in items if i['name'] == name]
            if item:
                param = (item[0]['file'], item[0]['data'])
                t = Test(param)
                t.run()
        return HttpResponse("group: %s, name: %s" % (group, name))
