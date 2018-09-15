import os
import json
import codecs
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver

from settings import CONFIG_PATH, DATA_PATH, get_driver_path
from .constant import OPERATION, SELECTOR_SEPARATOR

class Test():
    def __init__(self, config_filename):
        self.config = self.load_config(config_filename)

    def load_config(self, config_filename):
        config_file = os.path.join(CONFIG_PATH, config_filename)
        config = {}
        with codecs.open(config_file, encoding='utf-8') as f:
            try:
                config = json.load(f)
            except Exception as e:
                print(e)
        return config

    def get_browser(self, name):
        # TODO
        # browser = webdriver.Chrome(executable_path = get_driver_path(self.config['driver']))
        browser = WebDriver(executable_path = get_driver_path(self.config['driver']))

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

    def run(self):
        browser = self.get_browser(self.config["driver"])
        self.browser = browser
        steps = self.config["steps"]
        if steps:
            for step in steps:
                if step["operation"] == OPERATION["GET"]:
                    browser.get(step["url"])

                if step["operation"] == OPERATION["INPUT"]:
                    self.fill_data(step["data"])

                if step["operation"] == OPERATION["CLICK"]:
                    self.get_elem(step['target']).click()

                if step["operation"] == OPERATION["SCREENSHOT"]:
                    data_path = os.path.join(DATA_PATH, self.config["screenshot"])
                    if  not os.path.exists(data_path):
                        os.makedirs(data_path)
                    file_name = os.path.join(data_path, step["filename"])
                    browser.save_screenshot(file_name)

                if step["operation"] == OPERATION["SWITCH_TO_FRAME"]:
                    browser.switch_to_frame(self.get_elem(step['target']))

                if step["operation"] == OPERATION["SWITCH_TO_DEFAULT_CONTENT"]:
                    browser.switch_to_default_content()
