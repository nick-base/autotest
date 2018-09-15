from core.test import Test

def test_baidu():
    t = Test('baidu/home.json')
    t.run()

def test_qq():
    t = Test('qq/mail.json')
    t.run()

def test_ajinga():
    t = Test('ajinga-test/register.json')
    t.run()

# test_baidu()
# test_qq()
test_ajinga()
