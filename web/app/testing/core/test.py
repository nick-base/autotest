import os
import sys
import json
import codecs
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.select import Select

from testing.settings import PROJECT_ROOT
from testing.core.utils import load_json_file

CONFIG_PATH = os.path.join(PROJECT_ROOT, "config")
DRIVER_PATH = os.path.join(PROJECT_ROOT, "drivers")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "output")

COMPONENT_FILENAME = ["component", "plugs", "c", "p"]
DATA_FILENAME = ["data", "d"]
SCRIPT_FILENAME = ["script", "s"]
SHELL_FILENAME = ["shell", "sh"]
EXTENSION_NAME = ".json"

LOAD_TIMEOUT = 5
SLEEP_TIME_BETWEEN_STEPS = 1

def get_driver_path(path):
    return os.path.join(DRIVER_PATH, path)

OPERATION = {
    "operation": ["operation", "op", "do"],
    "get": "get",
    "input": "input",
    "click": "click",
    "select": "select",

    "screenshot": "screenshot",
    "script": "script",
    "scripts": "scripts",
    "shell": "sh",

    "switch_to_frame": "frame",
    "switch_to_default_content": "content",

    "component": ["component", "c", "plugs", "p"],
    "loop": "loop",
    "sleep": "sleep",
    "stop": "stop",
}

ALL_OPERATIONS = []
for k in OPERATION:
     if type(OPERATION[k]) is str:
         ALL_OPERATIONS.append(OPERATION[k])
     else:
         ALL_OPERATIONS += OPERATION[k]

SELECTOR_SEPARATOR = '#'

class Test():
    def __init__(self, config):
        if type(config) == tuple:
            config_filename, data = config
        else:
            config_filename = config
            data = None

        config_file = os.path.join(CONFIG_PATH, config_filename)
        print("[Config file]: %s" % config_file)
        self.config_path = os.path.abspath(os.path.dirname(config_file))
        self.config = load_json_file(config_file)
        print(self.get_config("data"))
        data = data or self.get_config("data")
        if data:
            self.data = self.load_data(data)
        else:
            self.data = {}

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
            print(path)
            if os.path.isfile(path):
                data = load_json_file(path)
                print('[data path]: %s' % path)
                print('[data]: %s' % data)
                return data
        return {}

    def get_script(self, name):
        for s in SCRIPT_FILENAME:
            path = os.path.join(self.config_path, s, name)
            if os.path.isfile(path):
                with open(path) as f:
                    script = f.read().strip('\n')
                return script
        return ""

    def get_shell_path(self, name):
        for sh in SHELL_FILENAME:
            path = os.path.join(self.config_path, sh, name)
            if os.path.isfile(path):
                print('[shell]: %s' % path)
                return path
        return None

    def get_browser(self, name):
        driver = self.get_config('driver') and self.get_config('driver').lower() or "chrome"
        if driver == "chrome":
            from selenium.webdriver.chrome.webdriver import WebDriver
        elif driver == "firefox":
            from selenium.webdriver.firefox.webdriver import WebDriver

        driver_path = self.get_config('driver_path')
        if driver_path:
            browser = WebDriver(executable_path = get_driver_path(driver_path))
            browser.maximize_window()
            # browser.set_page_load_timeout(LOAD_TIMEOUT)
            # browser.set_script_timeout(LOAD_TIMEOUT)
            return browser
        return None

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
        for op in OPERATION["operation"]:
            if op in step:
                operation = step[op]
                return operation, is_standard

        for key in list(step.keys()):
            if key in ALL_OPERATIONS:
                return key, not is_standard
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
        print("[GET]: %s" % url)
        self.browser.get(url)
        # try:
        #     self.browser.get(url)
        # except:
        #     self.browser.execute_script('window.stop()')

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
        print("[input]: %s" % data)

    def do_select(self, step, is_standard):
        try:
            target = ""
            if "target" in step:
                target = step["target"]
            else:
                target = step["select"]
            elem = self.get_elem(target)

            value, text, index = "", "", 0
            if "value" in step:
                value = step["value"]
            if "#value" in step:
                if step["#value"] in self.data:
                    value = self.data[step["#value"]]

            if "index" in step:
                index = step["index"]
            if "#index" in step:
                if step["#index"] in self.data:
                    index = self.data[step["#index"]]

            if "text" in step:
                text = step["text"]
            if "#text" in step:
                if step["#text"] in self.data:
                    text = self.data[step["#text"]]

            s = Select(elem)
            if index:
                s.select_by_index(index)
            elif value:
                s.select_by_value(value)
            elif text:
                s.select_by_visible_text(text)

            print(value, text, index)
            print("[Select]: %s" % target)
        except:
            print("[Error]: select %s" % target)

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
                print(e)

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

    def do_sleep(self, step, is_standard=False):
        if is_standard:
            if "time" in step:
                time.sleep(int(step["time"]))
            elif "#data" in step:
                elem = self.data[step["#data"]]
        else:
            time.sleep(int(step["sleep"]))

    def run_steps(self, steps):
        if steps:
            for step in steps:
                operation, is_standard = self.get_operation_type(step)

                if operation == OPERATION["shell"]:
                    sh = self.get_shell_path(step["sh"])
                    if sh:
                        print("[shell]: %s" % sh)
                        os.system(sh)

                elif operation == OPERATION["stop"]:
                    break

                if not self.browser:
                    continue

                if operation == OPERATION["get"]:
                    self.do_get(step, is_standard)

                elif operation == OPERATION["input"]:
                    self.do_input(step, is_standard)

                elif operation == OPERATION["select"]:
                    self.do_select(step, is_standard)

                elif operation == OPERATION["click"]:
                    self.do_click(step, is_standard)

                elif operation == OPERATION["screenshot"]:
                    self.do_screenshot(step, is_standard)

                # standard is same with simple
                elif operation == OPERATION["loop"]:
                    loop_steps = step["steps"]
                    loop_times = int(step["times"])
                    for loop in range(loop_times):
                        for step in loop_steps:
                            step["loop_counter"] = loop
                        self.run_steps(loop_steps)

                elif operation == OPERATION["script"]:
                    script = self.get_script(step["script"])
                    self.browser.execute_script(script)
                    print('[script]: %s' % script)

                elif operation == OPERATION["scripts"]:
                    self.browser.execute_script(step["scripts"])
                    print('[scripts]: %s' % script)

                elif operation == OPERATION["switch_to_frame"]:
                    self.browser.switch_to_frame(self.get_elem(step['frame']))

                elif operation == OPERATION["switch_to_default_content"]:
                    self.browser.switch_to_default_content()

                elif operation in OPERATION["component"]:
                    self.do_component(step, is_standard)

                elif operation == OPERATION["sleep"]:
                    self.do_sleep(step, is_standard)

                time.sleep(SLEEP_TIME_BETWEEN_STEPS)
    def run(self):
        self.browser = self.get_browser(self.get_config("driver_path"))
        self.run_steps(self.get_config("steps"))
