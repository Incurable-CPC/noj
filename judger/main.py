from results import *
import remote.poj as poj
import requests
import json
import time

config = json.load(open('config.json'))
root = config['root']

username = config['judger']
token = config['token']
headers = {
    'Content-Type': 'application/json',
    'Cookie': 'username=' + username + '; token=' + token,
}

while True:
    time.sleep(5)
    response = requests.post(root + '/api/submissions/unjudged',
                             headers=headers)

    data = response.json()
    if 'submission' in data:
        submission = data['submission']
        sid = submission['sid']
        pid = submission['originPid']
        language = submission['language']
        code = submission['code']

        poj.submit(pid, language, code)

        submission = {}
        while (len(submission) == 0) or (not is_completed(submission['result'])):
            time.sleep(0.1)
            submission = poj.get_result(pid, language)

        result = submission['result']
        if is_compile_error(result):
            submission['CEInfo'] = poj.get_ce_info(submission['originSid'])

        submission['result'] = RESULTS[result]
        data = {
            'submission': submission
        }

        res = requests.patch(root + '/api/submissions/' + str(sid),
                             data=json.dumps(data),
                             headers=headers)
