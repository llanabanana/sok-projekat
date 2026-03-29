# Graph Visualization Platform

A plugin-based platform for loading and visualizing graph data, built with Django.
Developed as a university project for the SOK course (3rd year).

## What it does

The platform lets you load graph data from different file formats (JSON, YAML),
visualize it in the browser using different rendering styles, and perform search
and filter operations on the graph nodes.

Plugins are discovered automatically using Python's entry point mechanism, so
new data sources and visualizers can be added without changing the core code.

## Architecture

The project has three main layers:

- **api/** -- abstract interfaces for plugins and the graph data model (Node, Edge, Graph)
- **project_platform/** -- core logic: plugin manager (singleton), graph operations (search/filter), workspace persistence
- **graph_explorer/** -- Django web app that ties everything together with views, templates, and static files

Plugins live in `plugins/` as separate installable packages:

- `json_data_source_plugin` -- loads graphs from JSON files
- `yaml_data_source_plugin` -- loads graphs from YAML files
- `simple_visualizer` -- basic graph rendering
- `block_visualizer` -- block-style graph rendering

## Project structure

```
sok-projekat/
    api/                    # Plugin interfaces and graph model
    project_platform/       # Core platform logic, plugin manager, workspaces
    graph_explorer/         # Django app (views, templates, static CSS/JS)
    plugins/                # Installable plugin packages
    tests/                  # Unit tests (unittest + pytest)
    test_data/              # Sample JSON graph data
    main.py                 # CLI entry point for testing plugin loading
    requirements.txt
```

## Setup

Requires Python 3.10+.

```bash
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

Install the plugins in development mode:

```bash
pip install -e plugins/json_data_source_plugin
pip install -e plugins/yaml_data_source_plugin
pip install -e plugins/simple_visualizer
pip install -e plugins/block_visualizer
```

## Running

Start the Django dev server:

```bash
cd graph_explorer
python manage.py migrate
python manage.py runserver
```

To verify plugins are loading correctly:

```bash
python main.py
```

## Tests

```bash
python -m pytest tests/
python -m unittest tests/test_graph_operations.py
```

## Team

- Milica Jovanic SV 9/2023
- Danica Komatovic SV 20/2023
- Lana Mirkov SV 23/2023
- Ana Paroski SV 53/2023
