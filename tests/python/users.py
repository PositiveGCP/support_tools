# -*- coding: utf-8 -*-

import json
from pprint import pprint
file = 'users.json'


with open(file, 'r') as f:
    data = json.load(f)

types = []
for element in data:
    type = data[element]['Tipo']
    if type not in types:
        types.append(type)


print (types)
