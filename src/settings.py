import os
from datetime import date, datetime

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

CONFIG_PATH = os.path.join(PROJECT_ROOT, "config")
DRIVER_PATH = os.path.join(PROJECT_ROOT, "drivers")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "output")

COMPONENT_FILENAME = "component"
DATA_FILENAME = "data"

def get_driver_path(path):
    return os.path.join(DRIVER_PATH, path)
