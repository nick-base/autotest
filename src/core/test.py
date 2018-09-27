import os
import json
import codecs
import time
from selenium.webdriver.support.ui import WebDriverWait

from settings import PROJECT_ROOT
from core.utils import load_json_file

CONFIG_PATH = os.path.join(PROJECT_ROOT, "config")
DRIVER_PATH = os.path.join(PROJECT_ROOT, "drivers")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "output")

COMPONENT_FILENAME = ["component", "plugs", "c", "p"]
DATA_FILENAME = ["data", "d"]
SCRIPT_FILENAME = ["script", "s"]
EXTENSION_NAME = ".json"

def get_driver_path(path):
    return os.path.join(DRIVER_PATH, path)

OPERATION = {
    "GET": "get",
    "INPUT": "input",
    "CLICK": "click",

    "SCREENSHOT": "screenshot",
    "SCRIPT": "script",

    "SWITCH_TO_FRAME": "frame",
    "SWITCH_TO_DEFAULT_CONTENT": "content",

    "COMPONENT": "component",
    "LOOP": "loop",
    "SLEEP": "sleep",
    "STOP": "stop"
}

SELECTOR_SEPARATOR = '#'

class Test():
    def __init__(self, config_filename):
        config_file = os.path.join(CONFIG_PATH, config_filename)
        self.config_path = os.path.abspath(os.path.dirname(config_file))
        self.config = load_json_file(config_file)

    def get_config(self, key):
        if key and key in self.config:
            return self.config[key]
        return None

    def load_component(self, name):
        for com in COMPONENT_FILENAME:
            path = os.path.join(self.config_path, com, "%s%s" % (name, EXTENSION_NAME))
            if os.path.isfile(path):
                return load_json_file(path)
        return {}

    def load_data(self, name):
        for d in DATA_FILENAME:
            path = os.path.join(self.config_path, d, "%s%s" % (name, EXTENSION_NAME))
            if os.path.isfile(path):
                return load_json_file(path)
        return {}

    def get_script(self, name):
        for s in SCRIPT_FILENAME:
            if os.path.isfile(s):
                path = os.path.join(self.config_path, s, name)
                with open(path) as f:
                    script = f.read().strip('\n')
                return script
        return ""

    def get_browser(self, name):
        driver = self.get_config('driver') and self.get_config('driver').lower() or "chrome"
        if driver == "chrome":
            from selenium.webdriver.chrome.webdriver import WebDriver
        elif driver == "firefox":
            from selenium.webdriver.firefox.webdriver import WebDriver
        browser = WebDriver(executable_path = get_driver_path(self.get_config('driver_path')))
        browser.maximize_window()
        return browser

    def get_elem(self, selector):
        selector_type, target = selector.split(SELECTOR_SEPARATOR)
        if selector_type == 'id':
            elem = self.browser.find_element_by_id(target)
        if selector_type == "class":
            elem = self.browser.find_element_by_class_name(target)
        if selector_type == "name":
            elem = self.browser.find_element_by_name(target)
        if selector_type == "tag":
            elem = self.browser.find_element_by_tag_name(target)
        if selector_type == "xpath":
            elem = self.browser.find_element_by_xpath(target)
        if selector_type == "css":
            elem = self.browser.find_element_by_css_selector(target)
        return elem

    def fill_data(self, data):
        for key in data:
            if SELECTOR_SEPARATOR in key:
                elem = self.get_elem(key)
                elem.send_keys(data[key])

    def run_steps(self, steps):
        if steps:
            for step in steps:
                if step["operation"] == OPERATION["GET"]:
                    if "url" in step:
                        self.browser.get(step["url"])
                    elif "#data" in step:
                        self.browser.get(self.data[step["#data"]]["url"])

                if step["operation"] == OPERATION["INPUT"]:
                    if "data" in step:
                        self.fill_data(step["data"])
                    if "#data" in step:
                        self.fill_data(self.data[step["#data"]])

                if step["operation"] == OPERATION["CLICK"]:
                    try:
                        if "target" in step:
                            self.get_elem(step["target"]).click()
                        elif "#data" in step:
                            self.get_elem(self.data[step["#data"]]["target"]).click()
                    except Exception as e:
                        print(e)

                if step["operation"] == OPERATION["SCREENSHOT"]:
                    data_path = os.path.join(OUTPUT_PATH, self.config["screenshot"])
                    if  not os.path.exists(data_path):
                        os.makedirs(data_path)
                    if "#loop_counter#" in step["filename"]:
                        file_name = step["filename"].replace("#loop_counter#", str(step["loop_counter"]))
                    else:
                        file_name = step["filename"]

                    file_name = os.path.join(data_path, file_name)
                    self.browser.save_screenshot(file_name)

                if step["operation"] == OPERATION["SWITCH_TO_FRAME"]:
                    self.browser.switch_to_frame(self.get_elem(step['target']))

                if step["operation"] == OPERATION["SWITCH_TO_DEFAULT_CONTENT"]:
                    self.browser.switch_to_default_content()

                if step["operation"] == OPERATION["COMPONENT"]:
                    component = self.load_component(step["name"])
                    if "steps" in component:
                        self.run_steps(component["steps"])

                if step["operation"] == OPERATION["LOOP"]:
                    loop_steps = step["steps"]
                    loop_times = int(step["times"])

                    for loop in range(loop_times):
                        for step in loop_steps:
                            step["loop_counter"] = loop
                        self.run_steps(loop_steps)

                if step["operation"] == OPERATION["SLEEP"]:
                    time.sleep(int(step["time"]))
                    # self.browser.implicitly_wait(int(step["time"]))

                if step["operation"] == OPERATION["STOP"]:
                    break

                if step["operation"] == OPERATION["SCRIPT"]:
                    self.browser.execute_script(self.get_script(step["script"]))

    def run(self):
        self.browser = self.get_browser(self.config["driver_path"])
        self.data = self.load_data(self.config["data"])
        self.run_steps(self.config["steps"])

        print("Press enter to exit...")
        enter = input()
