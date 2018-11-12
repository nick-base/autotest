from django.core.management.base import BaseCommand, CommandError
from api.models import Group, Project, Case
from api.projects.list import projects as groups

class Command(BaseCommand):
    help = 'Update Config to database'

    def handle(self, *args, **options):
        g_ids = []
        p_ids = []
        c_ids = []
        for g in groups:
            name = 'name' in g and g['name'] or ''
            description = 'description' in g and g['description'] or ''
            disable = 'disable' in g and g['disable'] or ''
            disable = 1 if disable else 0
            root_path = 'root_path' in g and g['root_path'] or ''

            if not name:
                continue

            group, created = Group.objects.get_or_create(name=name)
            group.description = description
            group.disable = disable
            group.root_path = root_path
            group.save()
            g_ids.append(group.pk)
            if 'sub' in g:
                for p in g['sub']:
                    name = 'name' in p and p['name'] or ''
                    description = 'description' in p and p['description'] or ''
                    display = 'display' in p and p['display'] or ''
                    disable = 'disable' in p and p['disable'] or ''
                    disable = 1 if disable else 0
                    print('project %s' % name)
                    if not name:
                        continue
                    project, created = Project.objects.get_or_create(name=name)
                    project.description = description
                    project.display = display
                    project.disable = disable
                    project.group = group
                    project.save()
                    p_ids.append(project.pk)
                    if 'case' in p:
                        for c in p['case']:
                            name = 'name' in c and c['name'] or ''
                            description = 'description' in c and c['description'] or ''
                            display = 'display' in c and c['display'] or ''
                            file_name = 'file' in c and c['file'] or ''
                            data = 'data' in c and c['data'] or ''
                            if not file_name:
                                continue
                            case, created = Case.objects.get_or_create(name=name)
                            case.description = description
                            case.display = display
                            case.file_name = file_name
                            case.data = data
                            case.project = project
                            case.save()
                            c_ids.append(case.pk)
        Group.objects.exclude(id__in=g_ids).update(disable=1)
        Project.objects.exclude(id__in=p_ids).update(disable=1)
        Case.objects.exclude(id__in=c_ids).update(disable=1)
