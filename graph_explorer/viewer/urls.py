from django.urls import path
from . import views

app_name = 'viewer'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/plugins/', views.list_plugins, name='list_plugins')
]
