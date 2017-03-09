from results import *
import problems.hdoj as hdoj
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

id = 1015
data = {
    'problem': hdoj.get_problem(id),
}
res = requests.post(root + '/api/problems',
                    data=json.dumps(data),
                    headers=headers)
print res.text
print id - 999, '/ 100 done'

