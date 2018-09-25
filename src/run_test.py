from core.test import Test

def test_survey_wrong():
    t = Test('ajinga/test-survey-wrong.json')
    t.run()

def test_survey_right():
    t = Test('ajinga/test-survey-right.json')
    t.run()

test_survey_right()
