#!/usr/bin/python3


import sys
import json
import random

#{
#    [1, 100, 200, 300, "url", ["tag1", "tag2"]],
#    [2, 200, 100, 300, "url", ["tag1", "tag2"]]
#}



def main(argv):
    if len(argv) != 3:
        print("Generates json like this:")
        print('[1, 100, 200, 300, "url", ["tag1", "tag2]"]')
        sys.exit("Usage: ./generate.py Elements OutputFile")
    data = generate(argv[1])
    write_file(data, argv[2])


def generate(elements):
    data = []
    genders = ['male', 'female']
    files = [
	"66__plagasul__indios.wav",
	"67__plagasul__indios2.wav",
	"68__plagasul__indios3.wav",
	"69__plagasul__ohm-loko.wav",
	"70__plagasul__eh.wav",
	"71__plagasul__hruuhb.wav",
	"72__plagasul__houb.wav",
	"73__plagasul__houu.wav",
	"74__plagasul__jah.wav",
	"75__plagasul__jhuee.wav",
	"76__plagasul__joooaah.wav",
	"77__plagasul__juob.wav",
	"78__plagasul__jueb.wav",
	"79__plagasul__long-scream.wav",
	"80__plagasul__oaaaahmmm.wav",
	"81__plagasul__uehea.wav",
	"82__plagasul__uhraa.wav",
	"83__plagasul__uoh.wav",
	"84__plagasul__uueh.wav",
	"85__plagasul__jeeh.wav",
	"86__plagasul__oa-h.wav"
	]
    url = "audio/"


    for i in range(1, int(elements) + 1):
        x = random.randint(0, 1000)
        y = random.randint(0, 800)
        z = random.randint(0, 800)
        age_tag = random.randint(1,111)
        gender_tag = genders[random.randint(0,len(genders)-1)]
        random_wav = files[random.randint(0,len(files)-1)]
        item = [i, x, y, z, url + random_wav, [gender_tag, str(age_tag)]]
        data.append(item)

    return data


def write_file(data, filename):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile)


if __name__ == '__main__':
    main(sys.argv)
