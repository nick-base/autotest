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
            'file': 'ajinga/qqmail-login.json',
            'data': 'dev/qq'
        },
        {
            'name': 'qiniu-dev',
            'file': 'ajinga/qiniu-login.json',
            'data': 'dev/qiniu'
        },
    ],
}

common_prod = {
    'name': 'common-prod',
    'items': [
        {
            'name': 'qqmail-prod',
            'file': 'ajinga/qqmail-login.json',
            'data': 'prod/qq'
        },
        {
            'name': 'qiniu-prod',
            'file': 'ajinga/qiniu-login.json',
            'data': 'prod/qiniu'
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
