# 127.0.0.1
ajinga = {
    'name': 'ajinga',
    'items': [
        {
            'name': 'login',
            'file': 'ajinga/login.json',
            'data': 'default/login',
        },
        {
            'name': 'ajing-hr',
            'file': 'ajinga/login.json',
            'data': 'default/login-hr',
        },
        {
            'name': 'starbuckscn',
            'file': 'ajinga/login.json',
            'data': 'default/login-starbuckscn',
        },
        {
            'name': 'henkel',
            'file': 'ajinga/login.json',
            'data': 'default/login-henkel',
        },
        {
            'name': 'nielsen',
            'file': 'ajinga/login.json',
            'data': 'default/login-nielsen',
        },
        {
            'name': 'coach',
            'file': 'ajinga/login.json',
            'data': 'default/login-coach',
        },
        {
            'name': 'elc',
            'file': 'ajinga/login.json',
            'data': 'default/login-elc',
        },
    ],
}

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

# stage.ajinga.com
ajinga_stage = {
    'name': 'ajinga-stage',
    'items': [
        {
            'name': 'login',
            'file': 'ajinga/login.json',
            'data': 'stage/login',
        },
        {
            'name': 'ajing-hr',
            'file': 'ajinga/login.json',
            'data': 'stage/login-hr',
        },
        {
            'name': 'starbuckscn',
            'file': 'ajinga/login.json',
            'data': 'stage/login-starbuckscn',
        },
        {
            'name': 'henkel',
            'file': 'ajinga/login.json',
            'data': 'stage/login-henkel',
        },
        {
            'name': 'nielsen',
            'file': 'ajinga/login.json',
            'data': 'stage/login-nielsen',
        },
        {
            'name': 'coach',
            'file': 'ajinga/login.json',
            'data': 'stage/login-coach',
        },
        {
            'name': 'elc',
            'file': 'ajinga/login.json',
            'data': 'stage/login-elc',
        },
    ],
}

# test.ajinga.com
ajinga_test = {
    'name': 'ajinga-test',
    'items': [
        {
            'name': 'login',
            'file': 'ajinga/login.json',
            'data': 'test/login',
        },
        {
            'name': 'ajing-hr',
            'file': 'ajinga/login.json',
            'data': 'test/login-hr',
        },
        {
            'name': 'starbuckscn',
            'file': 'ajinga/login.json',
            'data': 'test/login-starbuckscn',
        },
        {
            'name': 'henkel',
            'file': 'ajinga/login.json',
            'data': 'test/login-henkel',
        },
        {
            'name': 'nielsen',
            'file': 'ajinga/login.json',
            'data': 'test/login-nielsen',
        },
        {
            'name': 'coach',
            'file': 'ajinga/login.json',
            'data': 'test/login-coach',
        },
        {
            'name': 'elc',
            'file': 'ajinga/login.json',
            'data': 'test/login-elc',
        },
    ],
}

# 192.168.244.59
ajinga_local = {
    'name': 'ajinga-local',
    'items': [
        {
            'name': 'login',
            'file': 'ajinga/login.json',
            'data': 'local/login',
        },
        {
            'name': 'ajing-hr',
            'file': 'ajinga/login.json',
            'data': 'local/login-hr',
        },
        {
            'name': 'starbuckscn',
            'file': 'ajinga/login.json',
            'data': 'local/login-starbuckscn',
        },
        {
            'name': 'henkel',
            'file': 'ajinga/login.json',
            'data': 'local/login-henkel',
        },
        {
            'name': 'nielsen',
            'file': 'ajinga/login.json',
            'data': 'local/login-nielsen',
        },
        {
            'name': 'coach',
            'file': 'ajinga/login.json',
            'data': 'local/login-coach',
        },
        {
            'name': 'elc',
            'file': 'ajinga/login.json',
            'data': 'local/login-elc',
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
    ajinga,
    ajinga_stage,
    ajinga_test,
    ajinga_local,
    common_dev,
    common_prod,
    # demo,
]
