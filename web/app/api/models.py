from django.db import models

class Model(models.Model):
    created_time = models.DateTimeField(auto_now_add=True, blank=True)
    updated_time = models.DateTimeField(auto_now=True, null=True, blank=True)
    class Meta:
        abstract = True

class Group(Model):
    name = models.CharField(max_length=128, null=False, blank=False)
    description = models.CharField(max_length=128, null=True, blank=True)
    disable = models.IntegerField(default = 0)
    root_path = models.TextField(null=True, blank=True)

class Project(Model):
    name = models.CharField(max_length=128, null=False, blank=False)
    description = models.CharField(max_length=128, null=True, blank=True)
    display = models.TextField(null=True, blank=True)
    disable = models.IntegerField(default = 0)
    group = models.ForeignKey('Group', null = True, related_name = 'projects', on_delete=models.SET_NULL)

class Case(Model):
    name = models.CharField(max_length=128, null=False, blank=False)
    description = models.CharField(max_length=128, null=True, blank=True)
    display = models.TextField(null=True, blank=True)
    file_name = models.TextField(null=True, blank=True)
    data = models.TextField(null=True, blank=True)
    disable = models.IntegerField(default = 0)
    project = models.ForeignKey('Project', null = True, related_name = 'cases', on_delete=models.SET_NULL)

from django.contrib import admin
admin.site.register(Group)
admin.site.register(Project)
admin.site.register(Case)
