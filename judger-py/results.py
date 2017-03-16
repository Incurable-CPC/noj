RESULTS = {
    'Pending': 0,
    'Pending Rejudging': 1,
    'Compiling': 2,
    'Running & Judging': 3,
    'Accepted': 4,
    'Presentation Error': 5,
    'Wrong Answer': 6,
    'Time Limit Exceeded': 7,
    'Memory Limit Exceeded': 8,
    'Output Limit Exceeded': 9,
    'Runtime Error': 10,
    'Compile Error': 11,
    'Compile OK': 12,
    'Test Running Done': 13,
    'System Error': 14,
    'Validator Error': 14,
    'Judging Error': 14,
}


def index(string):
    if string not in RESULTS:
        return 14
    return RESULTS[string]


def is_completed(result):
    return index(result) >= 4


def is_accepted(result):
    return index(result) == 4


def is_compile_error(result):
    return index(result) == 11
