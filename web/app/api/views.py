from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, JsonResponse
import json

from .projects.list import projects
from auto.core.test import Test

class HomeView(View):
    def get(self, request, *args, **kwargs):
        data = {}
        data['status'] = 'success'
        data['message'] = 'Test Sucess'
        return HttpResponse(json.dumps(projects), content_type="application/json")

def run(request):
    import threading
    if request.method=="GET":
        project_name = request.GET.get("project", "")
        sub_name = request.GET.get("sub", "")
        case_name = request.GET.get("case", "")
        run = request.GET.get("run", "1")
        case = {}
        data = {}
        if project_name:
            project = [p for p in projects if p["name"] == project_name]
            if project:
                project = project[0]
                print("project %s" % project_name)

                if sub_name and 'sub' in project:
                    sub = [s for s in project['sub'] if s["name"] == sub_name]
                    if sub:
                        sub = sub[0]
                        print("sub %s" % sub_name)
                        case = [c for c in sub['case'] if c["name"] == case_name]
                        if case:
                            case = case[0]
        if case:
            test = Test(case, root_path=project['root_path'])

        if run == "0":
            data = {
                "thread_name": thread_name,
                "data": test.data or "",
                "config": test.config,
            }
        else:
            data = {
                "data": test.data or "",
                "config": test.config,
            }
            thread_name = "%s-%s-%s" % (project, sub, case)
            t = threading.Thread(target=test.run, name=thread_name)
            t.start()
        return JsonResponse(data)
