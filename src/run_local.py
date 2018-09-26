from core.test import Test

def register():
    t = Test('ajinga/local-register.json')
    t.run()

def login():
    t = Test('ajinga/local-login.json')
    t.run()

def survey_right():
    t = Test('ajinga/local-survey-right.json')
    t.run()

def survey_wrong():
    t = Test('ajinga/local-survey-wrong.json')
    t.run()

login()