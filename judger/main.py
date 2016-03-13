from results import *
import remote.poj as poj
import requests
import json
import time

headers = {
    'Content-Type': 'application/json',
}
data = {
    'auth': {
        'username': 'CPCPC',
        'token': 'gWaBosEu297UAo5P/xlbXw==',
    }
}

host = 'http://localhost:3000'
res = requests.post(host+'/api/submissions/unjudged',
                    data=json.dumps(data),
                    headers=headers)

submission = res.json()

sid = submission['sid']
pid = submission['originPid']
language = submission['language']
code = submission['code']

print code
poj.submit(pid, language, code)

result = []
while (len(result) == 0) or (not completed(result[1])):
    time.sleep(0.1)
    result = poj.get_result(pid, language)

data['submission'] = {
    'result': RESULTS[result[1]]
    # 'timeUsage': result[2],
    # 'memoryUsage': result[3],
}

res = requests.patch(host+'/api/submissions/'+str(sid),
                     data=json.dumps(data),
                     headers=headers)
print res.text
