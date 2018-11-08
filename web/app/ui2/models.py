from django.db import models

class BaseModel(models.Model):
    created_time = models.DateTimeField(auto_now_add=True, blank=True)
    updated_time = models.DateTimeField(auto_now=True, null=True, blank=True)
    class Meta:
        abstract = True

class Menu(BaseModel):
    name = models.CharField(max_length=30)
    description = models.TextField(null=True)

class Project(BaseModel):
    name = models.CharField(max_length=30)
    description = models.TextField(null=True)
    menu = models.ForeignKey('Menu', on_delete=models.CASCADE)
