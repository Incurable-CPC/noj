from results import *
import remote.poj as poj
import requests
import json
import time

username = 'CPCPC'
token = 'gWaBosEu297UAo5P/xlbXw=='
headers = {
    'Content-Type': 'application/json',
    'Cookie': 'username=' + username + '; token=' + token,
}

config = json.load(open('config.json'))
host = config['host']
while True:
    time.sleep(5)
    response = requests.post('http://'+host+'/api/submissions/unjudged',
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

        res = requests.patch('http://'+host+'/api/submissions/'+str(sid),
                             data=json.dumps(data),
                             headers=headers)
