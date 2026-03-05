from pathlib import Path

from django.http import JsonResponse
from django.shortcuts import render

from api.models.graph import GraphBuilder
from project_platform.plugin_manager import PluginManager


def index(request):
    """Main page"""
    return render(request, 'index.html', {'message': 'Radi. Ovo je samo test prikaz.'})


# TODO: Replace fixed test-data loading with user-driven source selection.
# Later flow should allow user to choose a data source plugin (e.g. JSON/YAML),
# provide a file path/name, and then load/parse that file into a Graph dynamically.
def graph_data(request):
    test_data_path = Path(__file__).resolve().parents[2] / 'test_data' / 'graph_data.json'

    plugin_manager = PluginManager()
    json_plugin = plugin_manager.instantiate_data_plugin('json', graph_builder_class=GraphBuilder)

    if json_plugin is None:
        return JsonResponse({'error': 'JSON data source plugin is not available.'}, status=500)

    try:
        graph = json_plugin.parse(json_path=str(test_data_path), directed=True)
    except Exception as exc:
        return JsonResponse({'error': f'Failed to parse graph data: {exc}'}, status=500)

    data = {
        'directed': graph.directed,
        'nodes': {
            node_id: {
                'id': node.id,
                'attributes': node.attributes,
            }
            for node_id, node in graph.nodes.items()
        },
        'edges': [
            {
                'id': edge.id,
                'source': edge.source,
                'target': edge.target,
                'attributes': edge.attributes,
            }
            for edge in graph.edges.values()
        ],
    }

    return JsonResponse(data)
