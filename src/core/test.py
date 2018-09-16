import os
import json
import codecs
# from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait


from .constant import OPERATION, SELECTOR_SEPARATOR
from settings import CONFIG_PATH, OUTPUT_PATH, COMPONENT_FILENAME, DATA_FILENAME
from settings import get_driver_path

class Test():
    def __init__(self, config_filename):
        self.load_config(config_filename)

    def load_file(self, filename):
        config = {}
        with codecs.open(filename, encoding='utf-8') as f:
            try:
                config = json.load(f)
            except Exception as e:
                print(e)
        return config

    def load_config(self, config_filename):
        config_file = os.path.join(CONFIG_PATH, config_filename)
        self.config_path = os.path.abspath(os.path.dirname(config_file))

        self.config = self.load_file(config_file)

    def load_component(self, name):
        path = os.path.join(self.config_path, COMPONENT_FILENAME, "%s%s" % (name, '.json'))
        return self.load_file(path)

    def load_data(self, name):
        path = os.path.join(self.config_path, DATA_FILENAME, "%s%s" % (name, '.json'))
        return self.load_file(path)

    def get_browser(self, name):
        # TODO
        # browser = webdriver.Chrome(executable_path = get_driver_path(self.config['driver']))
        browser = WebDriver(executable_path = get_driver_path(self.config['driver']))

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
            elem = self.get_elem(key)
            elem.send_keys(data[key])

    def run_steps(self, steps):
        if steps:
            for step in steps:
                if step["operation"] == OPERATION["GET"]:
                    self.browser.get(step["url"])

                if step["operation"] == OPERATION["INPUT"]:
                    if "data" in step:
                        self.fill_data(step["data"])
                    if "#data" in step:
                        self.fill_data(self.data[step["#data"]])

                if step["operation"] == OPERATION["CLICK"]:
                    self.get_elem(step['target']).click()

                if step["operation"] == OPERATION["SCREENSHOT"]:
                    data_path = os.path.join(OUTPUT_PATH, self.config["screenshot"])
                    if  not os.path.exists(data_path):
                        os.makedirs(data_path)
                    file_name = os.path.join(data_path, step["filename"])
                    self.browser.save_screenshot(file_name)

                if step["operation"] == OPERATION["SWITCH_TO_FRAME"]:
                    self.browser.switch_to_frame(self.get_elem(step['target']))

                if step["operation"] == OPERATION["SWITCH_TO_DEFAULT_CONTENT"]:
                    self.browser.switch_to_default_content()

                if step["operation"] == OPERATION["COMPONENT"]:
                    component = self.load_component(step["name"])

                    if "steps" in component:
                        self.run_steps(component["steps"])

    def run(self):
        self.browser = self.get_browser(self.config["driver"])
        self.data = self.load_data(self.config["data"])
        self.run_steps(self.config["steps"])

        print("Enter...")
        enter = input()
