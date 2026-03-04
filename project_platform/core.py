from api.models.graph import GraphBuilder
from project_platform.plugin_manager import PluginManager


class GraphPlatform:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.plugin_manager = PluginManager()
            cls._instance.current_graph = None    
            cls._instance.current_plugin = None  
        return cls._instance

    def get_data_source_plugins(self):
        return self.plugin_manager.get_all_data_plugin_names()
    
    def get_data_source_plugin_parameters(self, plugin_name: str):
        return self.plugin_manager.get_plugin_parameters(plugin_name)
    
    def load_graph(self, plugin_name: str, **parameters):
        """
        Load a graph using the specified data source plugin and parameters.
        """
        
        plugin_instance = self.plugin_manager.instantiate_data_plugin(
            plugin_name,
            graph_builder_class=GraphBuilder  
        )
        
        if not plugin_instance:
            raise ValueError(f"Ne mogu instancirati plugin: {plugin_name}")
        
        graph = plugin_instance.parse(**parameters)
        
        self.current_graph = graph
        self.current_plugin = plugin_name
        
        return graph