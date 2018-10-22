import json
import sys

color = []

def hex_to_int(s):
    s = s.lstrip("#")
    return int(s[:2], 16), int(s[2:4], 16), int(s[4:6], 16)
colors = dict()

with open('xkcd.json') as data_file:
    color_data = json.load(data_file)["colors"]
    for item in color_data:
        colors[item["color"]] = hex_to_int(item["hex"])


import math
def distance(coord1, coord2):
    return math.sqrt(sum([(i - j)**2 for i, j in zip(coord1, coord2)]))

def closest(space, coord, n=6):
    closest = []
    for key in sorted(space.keys(),
                      key=lambda x: distance(coord, space[x]))[1:n+1]:
        closest.append(key)
    return closest

import random
key_color = random.choice(list(colors.keys()))
coolers = closest(colors, colors[key_color])

print (coolers)
