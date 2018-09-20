from core.test import Test

def register():
    t = Test('ajinga-local/register.json')
    t.run()

def survey():
    t = Test('ajinga-local/survey.json')
    t.run()

def survey_right():
    t = Test('ajinga-local/survey-right.json')
    t.run()

def survey_wrong():
    t = Test('ajinga-local/survey-wrong.json')
    t.run()

def init():
    t = Test('ajinga-local/init.json')
    t.run()

survey_wrong()