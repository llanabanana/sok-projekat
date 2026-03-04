from setuptools import setup, find_packages

setup(
    name="yaml_plugin",
    version="0.1.0",
    packages=find_packages(),
    python_requires=">=3.10",
    description="YAML Data Source Plugin for SOK Project",
    install_requires=[],
    author="Ana Paroski",
    entry_points={
        "graph_platform.data_sources": [
            "yaml = yaml_plugin:YAMLSource",
        ],
    },
)
