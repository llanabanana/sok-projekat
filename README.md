# Graph Visualization Platform

A plugin-based platform for loading, manipulating, and visualizing graph data. Built with Django and Python's entry point plugin system.

## Architecture

The platform uses a modular plugin architecture with two plugin types:

- **Data source plugins** -- load graph data from different formats (JSON, YAML)
- **Visualizer plugins** -- render graphs in different visual styles (simple view, block view)

Plugins are discovered automatically via Python entry points and managed by a singleton `PluginManager`.

### Project structure

```
sok-projekat/
  api/                  # Core abstractions (DataSourcePlugin, VisualizerPlugin, Graph model)
  project_platform/     # Platform core, plugin manager, workspace and graph operations
  graph_explorer/       # Django web application (views, templates, static files)
  plugins/              # Installable plugin packages
    json_data_source_plugin/
    yaml_data_source_plugin/
    simple_visualizer/
    block_visualizer/
  tests/                # Unit tests
  test_data/            # Sample graph data files
```

## Requirements

- Python 3.10+
- Django >= 4.2, < 5.0
- PyYAML 6.0.3

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

Install plugins in development mode:

```bash
pip install -e plugins/json_data_source_plugin
pip install -e plugins/yaml_data_source_plugin
pip install -e plugins/simple_visualizer
pip install -e plugins/block_visualizer
```

## Running

Start the Django development server:

```bash
cd graph_explorer
python manage.py runserver
```

Or run the CLI entry point to verify plugin loading:

```bash
python main.py
```

## Team

- Milica Jovanic SV 9/2023
- Danica Komatovic SV 20/2023
- Lana Mirkov SV 23/2023
- Ana Paroski SV 53/2023
