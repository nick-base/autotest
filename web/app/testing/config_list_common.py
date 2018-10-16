common_dev = {
    'name': 'common-dev',
    'items': [
        {
            'name': 'ajinga-git',
            'file': 'ajinga/ajinga-git.json',
            'data': ''
        },
        {
            'name': 'qqmail-dev',
            'file': 'ajinga/qqmail-dev.json',
            'data': ''
        },
        {
            'name': 'qiniu-dev',
            'file': 'ajinga/qiniu-dev.json',
            'data': ''
        },
    ],
}

common_prod = {
    'name': 'common-prod',
    'items': [
        {
            'name': 'qqmail-prod',
            'file': 'ajinga/qqmail-prod.json',
            'data': ''
        },
        {
            'name': 'qiniu-prod',
            'file': 'ajinga/qiniu-prod.json',
            'data': ''
        },
    ],
}

demo = {
    'name': 'demo',
    'items': [
        {
            'name': 'baidu-home',
            'file': 'baidu/home.json',
            'data': ''
        },
    ],
}

config_list = [
    common_dev,
    common_prod,

    demo,
]
