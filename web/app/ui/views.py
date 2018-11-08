from django.http import HttpResponse
from django.shortcuts import render
from auto.core.test import Test
from django.views.generic import View
from django.http import JsonResponse

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
    import threading
    if request.method=='GET':
        project = request.GET.get('project')
        group = request.GET.get('group')
        name = request.GET.get('name')
        run = request.GET.get('run')
        data = {}
        if project:
            configs = config_map[project]
            config = [c for c in configs if c['name'] == group]
            if config:
                items = config[0]['items']
                item = [i for i in items if i['name'] == name]
                if item:
                    item = item[0]
                    f = item['file'] if 'file' in item else ''
                    d = item['data'] if 'data' in item else ''
                    param = (f, d)
                    test = Test(param)
                    if run == '1':
                        thread_name = '%s-%s-%s' % (project, group, name)
                        t = threading.Thread(target=test.run, name=thread_name)
                        t.start()
                        data = {
                            "thread_name": thread_name,
                            "data": test.data or '',
                            "config": test.config,
                        }
                    else:
                        print(test.data)
                        data = {
                            "data": test.data or '',
                            "config": test.config,
                        }
        return JsonResponse(data)
