import requests
import base64
import re

s = requests.Session()


def is_login():
    url = 'http://poj.org'
    res = s.get(url)
    return res.text.find('action=login') < 0


def login():
    url = 'http://poj.org/login'
    user_info = {
        'user_id1': '136873448',
        'password1': '123456789',
        'B1': 'login',
        'url': '/',
    }
    s.post(url, user_info)


def submit(pid, language, code):
    while not is_login():
        login()
    data = {
        'problem_id': pid,
        'language': language,
        'source': base64.b64encode(code),
        'submit': 'Submit',
        'encoded': '1',
    }
    res = s.post('http://poj.org/submit', data)
    html = res.text
    return (html.find('Error Occurred') < 0) and (html.find('The page is temporarily unavailable') < 0)


def get_result(pid, language):
    reg = r'<tr.*?><td>(\d*?)</td>.*<font.*?>(.*?)</font>'
    reg_more = r'<tr.*?><td>(\d*?)</td>.*<font.*?>(.*?)</font></td><td>(\d*?)K</td><td>(\d*?)MS</td>'
    match = []
    while len(match) == 0:
        res = s.get('http://poj.org/status?'
                    'problem_id=' + str(pid) +
                    '&user_id=136873448'
                    '&language=' + str(language))
        match = re.findall(reg, res.text)
        match2 = re.findall(reg_more, res.text)
        if (len(match) > 0) and (len(match2) > 0) and (match[0][0] == match2[0][0]):
            match = match2
    result = match[0]
    submission = {
        'originSid': result[0],
        'result': result[1]
    }
    if len(result) > 2:
        submission['memoryUsage'] = result[2]
        submission['timeUsage'] = result[3]

    return submission


def get_ce_info(sid):
    reg = r'<pre>(.*)</pre>'
    res = s.get('http://poj.org/showcompileinfo?'
                'solution_id=' + str(sid))

    return re.findall(reg, res.text, re.DOTALL)[0]
