from setuptools import setup, find_packages

setup(
    name="simple_visualizer",
    version="0.1.0",
    packages=find_packages(),
    python_requires=">=3.10",
    description="Simple Visualizer Plugin",
    install_requires=[],
    author="Milica Jovanic",
    entry_points={
        "graph_platform.visualizers": [
            "simple = simple_visualizer:SimpleVisualizer",
        ],
    },
)
