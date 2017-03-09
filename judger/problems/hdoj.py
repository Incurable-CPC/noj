import requests
import re

s = requests.Session()
title_reg = r'<h1 style=.*?>(.*?)</h1>'
description_reg = r'>Problem Description</div>(.*?)<div class=panel_bottom>&nbsp;'
input_reg = r'>Input</div>(.*?)<div class=panel_bottom>&nbsp;'
output_reg = r'>Output</div>(.*?)<div class=panel_bottom>&nbsp;'
sample_input_reg = r'>Sample Input.*?<pre><div.*?>(.*?)</div></pre>'
sample_output_reg = r'>Sample Output.*?<pre><div.*?>(.*?)</div></pre>'
time_limit_reg = r'Time Limit: (.*?)&nbsp;'
memory_limit_reg = r'Memory Limit: (.*?)<br>'


def get_problem(id):
    handle_url = lambda s: s  # re.sub(r'(src|href)=(.*?)>', r'\1="//acm.hud.edu.cn/\2"', s)
    res = s.get('http://acm.hdu.edu.cn/showproblem.php?pid=' + str(id))
    matched = {
        'title': re.findall(title_reg, res.text, re.DOTALL),
        'description': re.findall(description_reg, res.text, re.DOTALL),
        'input': re.findall(input_reg, res.text, re.DOTALL),
        'output': re.findall(output_reg, res.text, re.DOTALL),
        'sample_input': re.findall(sample_input_reg, res.text, re.DOTALL),
        'sample_output': re.findall(sample_output_reg, res.text, re.DOTALL),
        'time_limit': re.findall(time_limit_reg, res.text, re.DOTALL),
        'memory_limit': re.findall(memory_limit_reg, res.text, re.DOTALL),
    }
    for key in matched.keys():
        matched[key].append('')
    samples = []
    for sample in zip(matched['sample_input'], matched['sample_output']):
        samples.append({
            'input': sample[0],
            'output': sample[1]
        })
    if len(matched['sample_output']) == len(matched['sample_input']):
        samples.pop()
    return {
        'pid': 'HDOJ' + str(id),
        'title': handle_url(matched['title'][0]),
        'description': handle_url(matched['description'][0]),
        'input': handle_url(matched['input'][0]),
        'output': handle_url(matched['output'][0]),
        'samples': samples,
        'timeLimit': matched['time_limit'][0],
        'memoryLimit': matched['memory_limit'][0],
        'originOJ': 'HDOJ',
        'originPid': id,
    }
