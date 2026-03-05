from django.urls import path
from . import views

app_name = 'viewer'

urlpatterns = [
    path('', views.index, name='index'),
    path('graph-data/', views.graph_data, name='graph_data'),
]
