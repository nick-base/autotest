import argparse
import os
from core.test import Test
from config_list import configs

parser = argparse.ArgumentParser(description='Config settings')

parser.add_argument(dest='key', help='Config key from config lists')

parser.add_argument('-p', '--project', dest='project',
                    help='Project Name')

parser.add_argument('-c', '--config', dest='config',
                    help='Config File Name')

parser.add_argument('-f', '--filename', dest='filename',
                    help='Project name plus confile filename')

if __name__ == '__main__':
    filename = ''
    args = parser.parse_args()
    if args.project and args.config:
        filename = os.path.join(args.project, args.config)
    elif args.filename:
        filename = args.filename
    elif args.key in configs:
        filename = configs[args.key]

    if not filename:
        print("Config file is required")

    t = Test(filename)
    t.run()
