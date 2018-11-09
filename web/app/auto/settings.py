import os

ROOT_PATH = os.path.abspath(os.path.dirname(__file__))

# CONFIG_PATH = os.path.join(ROOT_PATH, "config")
# DRIVER_PATH = os.path.join(ROOT_PATH, "drivers")
# OUTPUT_PATH = os.path.join(ROOT_PATH, "output")

COMPONENT_FILENAME = ["component", "plugs", "c", "p"]
DATA_FILENAME = ["data", "d"]
SCRIPT_FILENAME = ["script", "s"]
SHELL_FILENAME = ["shell", "sh"]
EXTENSION_NAME = ".json"
SELECTOR_SEPARATOR = '#'

LOAD_TIMEOUT = 5
SLEEP_TIME_BETWEEN_STEPS = 1
