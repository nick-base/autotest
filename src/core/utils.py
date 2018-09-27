import codecs
import json

def load_json_file(filename):
    config = {}
    with codecs.open(filename, encoding='utf-8') as f:
        try:
            config = json.load(f)
        except Exception as e:
            print(e)
    return config
