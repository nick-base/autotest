from django.http import HttpResponse
from django.shortcuts import render
from .core.test import Test
from django.views.generic import View

from .config_list import config_list
from .config_list_ajinga import config_list as aj_list
from .config_list_common import config_list as common_list
from .config_list_ajinga_case import config_list as case_list

config_map = {
    'demo': config_list,
    'ajinga': aj_list,
    'common': common_list,
    'case': case_list,
}

skip = [
    'demo',
]

class BaseView(View):
    def __init__(self):
        super(BaseView, self).__init__()
        self.init_data()

    def init_data(self):
        keys = sorted(config_map.keys())
        menus = [k for k in keys if k not in skip]
        self.tempdict = {
            'menus': menus,
            'config_map': config_map
        }

class HomeView(BaseView):
    def get(self, request, *args, **kwargs):
        return render(request, 'home.html', self.tempdict)

class AjingaView(BaseView):
    def get(self, request, *args, **kwargs):
        self.tempdict.update({
            'project': 'ajinga',
            'config_list': aj_list
        })
        return render(request, 'index.html', self.tempdict)

class CommonView(BaseView):
    def get(self, request, *args, **kwargs):
        self.tempdict.update({
            'config_list': common_list,
            'project': 'common',
        })
        return render(request, 'index.html', self.tempdict)

class CaseView(BaseView):
    def get(self, request, *args, **kwargs):
        self.tempdict.update({
            'config_list': case_list,
            'project': 'case',
        })
        return render(request, 'index.html', self.tempdict)

class DemoView(BaseView):
    def get(self, request, *args, **kwargs):
        self.tempdict.update({
            'config_list': config_list,
            'project': 'demo',
        })
        return render(request, 'index.html', self.tempdict)

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
