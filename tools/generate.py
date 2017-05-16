#!/usr/bin/python3

import sys
import json
import random

#{
#    "1": [100, 200, 300, "url", ["male age50"]"],
#    "2": [200, 100, 300, "url", ["female age25"]]
#}



def main(argv):
    if len(argv) != 3:
        sys.exit("Usage: ./generate.py Number OutputFile")
    data = generate(argv[1])
    write_file(data, argv[2])


def generate(elements):
    data = []
    genders = ['male', 'female']
    for i in range(1, int(elements) + 1):
        x = random.randint(50, 2000)
        y = random.randint(50, 2000)
        z = random.randint(50, 2000)
        age_tag = random.randint(1,110)
        gender_tag = genders[random.randint(0,len(genders)-1)] 
        item = {str(i): [x, y, z, "url", [gender_tag + " " + str(age_tag)]]}
        data.append(item)

    return data

def write_file(data, filename):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile)


if __name__ == '__main__':
    main(sys.argv)




