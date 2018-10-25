import json
import sys

color = []

def hex_to_int(s):
    s = s.lstrip("#")
    return int(s[:2], 16), int(s[2:4], 16), int(s[4:6], 16)
colors = dict()

with open('./functions/xkcd.json') as data_file:
    color_data = json.load(data_file)["colors"]
    for item in color_data:
        colors[item["color"]] = hex_to_int(item["hex"])

with open('./functions/sorted.json', 'w') as results_file:
    json.dump(colors, results_file)
