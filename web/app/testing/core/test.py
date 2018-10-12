import os
import json
import codecs
import time
from selenium.webdriver.support.ui import WebDriverWait

from testing.settings import PROJECT_ROOT
from testing.core.utils import load_json_file

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
    "OPERATION": ["operation", "op", "do"],
    "GET": "get",
    "INPUT": "input",
    "CLICK": "click",

    "SCREENSHOT": "screenshot",
    "SCRIPT": "script",

    "SWITCH_TO_FRAME": "frame",
    "SWITCH_TO_DEFAULT_CONTENT": "content",

    "COMPONENT": ["component", "c", "plugs", "p"],
    "LOOP": "loop",
    "SLEEP": "sleep",
    "STOP": "stop",
}
SELECTOR_SEPARATOR = '#'

class Test():
    def __init__(self, config):
        if type(config) == tuple:
            config_filename, data = config
        else:
            config_filename = config
            data = None

        config_file = os.path.join(CONFIG_PATH, config_filename)
        self.config_path = os.path.abspath(os.path.dirname(config_file))
        self.config = load_json_file(config_file)
        self.browser = self.get_browser(self.get_config("driver_path"))
        data = data or self.get_config("data")
        self.data = self.load_data(data)

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

    def get_operation_type(self, step):
        is_standard = True
        for op in OPERATION["OPERATION"]:
            if op in step:
                operation = step[op]
                return operation, is_standard
        keys = list(step.keys())
        if keys:
            return keys[0], not is_standard
        return None, None

    def do_get(self, step, is_standard=False):
        def get_url(variable_name):
            if variable_name not in self.data:
                return ""
            url_data = self.data[variable_name]
            if type(url_data) == str:
                url = url_data
            elif "url" in url_data:
                url = url_data["url"]
            return url

        url = ""
        if is_standard:
            if "url" in step:
                url = step["url"]
            elif "#data" in step:
                url = get_url(step["#data"])
        else:
            if isinstance(step["get"], dict):
                if "url" in step["get"]:
                    url = step["get"]["url"]
            elif not step["get"].startswith("#"):
                url = step["get"]
            else:
                url = get_url(step["get"][1::])
        self.browser.get(url)

    def do_input(self, step, is_standard=False):
        data = {}
        if is_standard:
            if "data" in step:
                data = step["data"]
            if "#data" in step:
                if step["#data"] in self.data:
                    data = self.data[step["#data"]]
        else:
            if isinstance(step["input"], dict):
                data = step["input"]
            elif step["input"].startswith("#"):
                variable_name = step["input"][1::]
                if variable_name in self.data:
                    data = self.data[variable_name]
        self.fill_data(data)

    def do_click(self, step, is_standard=False):
        elem = None
        if is_standard:
            if "target" in step:
                elem = step["target"]
            elif "#data" in step:
                elem = self.data[step["#data"]]["target"]
        else:
            elem = step["click"]

        if elem:
            try:
                self.get_elem(elem).click()
            except Exception as e:
                print("[Click Error]: %s" % elem)

    def do_screenshot(self, step, is_standard):
        screenshot = self.get_config("screenshot")
        if not screenshot:
            return
        if screenshot.startswith('#'):
            screenshot = self.data[screenshot.lstrip('#')]
        data_path = os.path.join(OUTPUT_PATH, screenshot)
        if  not os.path.exists(data_path):
            os.makedirs(data_path)

        if is_standard:
            if "#loop_counter#" in step["filename"]:
                file_name = step["filename"].replace("#loop_counter#", str(step["loop_counter"]))
            else:
                file_name = step["filename"]
        else:
            if "#loop_counter#" in step["screenshot"]:
                file_name = step["screenshot"].replace("#loop_counter#", str(step["loop_counter"]))
            elif step["screenshot"].startswith("#"):
                file_name = step["screenshot"][1::]
            else:
                file_name = step["screenshot"]

        path = os.path.join(data_path, file_name)
        self.browser.save_screenshot(path)

    def do_component(self, step, is_standard):
        if is_standard:
            component = self.load_component(step["name"])
        else:
            key = list(step.keys())[0]
            component = self.load_component(step[key])
        if "steps" in component:
            self.run_steps(component["steps"])

    def run_steps(self, steps):
        if steps:
            for step in steps:
                operation, is_standard = self.get_operation_type(step)

                if operation == OPERATION["GET"]:
                    self.do_get(step, is_standard)

                elif operation == OPERATION["INPUT"]:
                    self.do_input(step, is_standard)

                elif operation == OPERATION["CLICK"]:
                    self.do_click(step, is_standard)

                elif operation == OPERATION["SCREENSHOT"]:
                    self.do_screenshot(step, is_standard)

                # standard is same with simple
                elif operation == OPERATION["LOOP"]:
                    loop_steps = step["steps"]
                    loop_times = int(step["times"])
                    for loop in range(loop_times):
                        for step in loop_steps:
                            step["loop_counter"] = loop
                        self.run_steps(loop_steps)

                elif operation == OPERATION["SCRIPT"]:
                    self.browser.execute_script(self.get_script(step["script"]))

                elif operation == OPERATION["SWITCH_TO_FRAME"]:
                    self.browser.switch_to_frame(self.get_elem(step['frame']))

                elif operation == OPERATION["SWITCH_TO_DEFAULT_CONTENT"]:
                    self.browser.switch_to_default_content()

                elif operation in OPERATION["COMPONENT"]:
                    self.do_component(step, is_standard)

                elif operation == OPERATION["SLEEP"]:
                    time.sleep(int(step["time"]))

                elif operation == OPERATION["STOP"]:
                    break

    def run(self):
        self.run_steps(self.get_config("steps"))
