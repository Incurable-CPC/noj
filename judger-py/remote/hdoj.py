import requests
import json
import re

config = json.load(open('config.json'))
user = config['remote']
if config.has_key('remote-hdoj'):
    user = config['remote-hdoj']
username = user['username']
password = user['password']

s = requests.Session()


def is_login():
    url = 'http://acm.hdu.edu.cn'
    res = s.get(url)
    return res.text.find('Sign In') < 0


def login():
    url = 'http://acm.hdu.edu.cn/userloginex.php?action=login'
    user_info = {
        'username': username,
        'userpass': password,
        'login': 'Sign+In',
    }
    s.post(url, user_info)


def submit(pid, language, code):
    while not is_login():
        login()
    data = {
        'check': '0',
        'problemid': pid,
        'language': language,  # G++, GCC, C++, C, Pascal, Java, C#
        'usercode': code,
    }
    res = s.post('http://acm.hdu.edu.cn/submit.php?action=submit', data)
    html = res.text
    return (html.find('Error Occurred') < 0) and (html.find('The page is temporarily unavailable') < 0)


def get_result(pid, language):
    reg = r'<tr.*?><td.*?>(\d*?)</td><td>.*?<font.*?>(.*?)</font>'
    reg_more1 = r'<tr.*?><td.*?>(\d*?)</td><td>.*?<font.*?>(.*?)</font></td><td><a.*?>.*?</a></td><td>(\d*?)MS</td><td>(\d*?)K</td>'
    reg_more2 = r'ewerror.php.rid=(\d*?)" target=_blank><font color=#6633FF>(.*?)</font></a></td><td><a.*?>.*?</a></td><td>(\d*?)MS</td><td>(\d*?)K</td>'
    match = []
    while len(match) == 0:
        res = s.get('http://acm.hdu.edu.cn/status.php?first=&'
                    'pid=' + str(pid) +
                    '&user=' + username +
                    '&lang=' + language +
                    '&status=0')  # check all type of code
        match = re.findall(reg, res.text)
        match2 = re.findall(reg_more1, res.text)
        match3 = re.findall(reg_more2, res.text)
        if (len(match) > 0) and (len(match2) > 0) and (match[0][0] == match2[0][0]):
            match = match2
        else:
            match = match3
    result = match[0]
    submission = {
        'originSid': result[0],
        'result': result[1]
    }
    if len(result) > 2:
        submission['memoryUsage'] = result[3]
        submission['timeUsage'] = result[2]  # hdu and poj are different

    return submission


def get_ce_info(sid):
    reg = r'<pre>(.*)</pre>'
    res = s.get('http://acm.hdu.edu.cn/viewerror.php?rid=' + str(sid))

    return re.findall(reg, res.text, re.DOTALL)[0]
