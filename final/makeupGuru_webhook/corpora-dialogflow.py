import json
import sys

results = []

with open('xkcd.json') as data:
    color_data = json.load(data)["colors"]
    for word in color_data:
        word_obj = {}
        word_obj['value'] = word["color"]
        word_obj['synonyms'] = [word["hex"], word["color"]]
        results.append(word_obj)

with open('results.json', 'w') as results_file:
    json.dump(results, results_file)
