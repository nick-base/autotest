configs = {
    'baidu-home': 'baidu/home.json',
}

# default 127.0.0.1:8000
configs.update({
    'login': ('ajinga/login.json', 'default/login'),
    'hr': ('ajinga/login.json', 'default/login-hr'),
})

# local 127.0.0.1:8000
configs.update({
    'local-login': ('ajinga/login.json', 'local/login'),
})
