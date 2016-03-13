import requests
import base64
import re

url = 'http://poj.org/login'
user_info = {
    'user_id1': '136873448',
    'password1': '123456789',
    'B1': 'login',
    'url': '/',
}

s = requests.Session()
s.post(url, user_info)


def submit(pid, language, code):
    data = {
        'problem_id': pid,
        'language': language,
        'source': base64.b64encode(code),
        'submit': 'Submit',
        'encoded': '1',
    }
    res = s.post('http://poj.org/submit', data)
    print res.text


def get_result(pid, language):
    reg = r'<tr.*?><td>(\d*?)</td>.*<font.*?>(.*?)</font>'#</td><td>(\d*?)K</td><td>(\d*?)MS</td>'
    match = []
    while len(match) == 0:
        res = s.get('http://poj.org/status?'
                    'problem_id=' + str(pid) +
                    '&user_id=136873448'
                    '&language=' + str(language))
        match = re.findall(reg, res.text)
    return match[0]
