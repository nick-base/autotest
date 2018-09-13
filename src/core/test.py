import os
import json
import codecs
from selenium import webdriver

from settings import CONFIG_PATH
from constant import OPERATION, SELECTOR_SEPARATOR

class Test():
    def __init__(self, config_filename):
        self.config = self.load_config(config_filename)

    def load_config(self, config_filename):
        config_file = os.path.join(CONFIG_PATH, config_filename)
        config = {}
        with codecs.open(config_file, encoding='utf-8') as f:
            try:
                config = json.load(f)
            except Exception, e:
                print e
        print config
        return config

    def get_driver(self, name):
        driver = webdriver.Chrome()
        # TODO
        return driver

    def get_elem(self, selector):
        selector_type, target = selector.split(SELECTOR_SEPARATOR)
        print selector_type, target
        if selector_type == 'id':
            elem = self.driver.find_element_by_id(target)
        if selector_type == "class":
            elem = self.driver.find_element_by_class_name(target)
        if selector_type == "name":
            elem = self.driver.find_element_by_name(target)
        if selector_type == "tag":
            elem = self.driver.find_element_by_tag_name(target)
        if selector_type == "xpath":
            elem = self.driver.find_element_by_xpath(target)
        if selector_type == "css":
            elem = self.driver.find_element_by_css_selector(target)
        return elem

    def fill_data(self, data):
        for key in data:
            elem = self.get_elem(key)
            print elem
            print data[key]
            self.driver.find_element_by_id('id_email_mobile').send_keys('test')
            # elem.send_keys('test')

    def run(self):
        driver = self.get_driver(self.config["driver"])
        self.driver = driver
        steps = self.config["steps"]
        if steps:
            for step in steps:
                if step["operation"] == OPERATION["GET"]:
                    driver.get(step["url"])
                if step["operation"] == OPERATION["INPUT"]:
                    self.fill_data(step["data"])
                if step["operation"] == OPERATION["CLICK"]:
                    pass
