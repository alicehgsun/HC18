# by Nicole He

import json
import sys

results = []

with open('./functions/xkcd.json') as data:
    color_data = json.load(data)["colors"]
    for word in color_data:
        word_obj = {}
        word_color = word["color"]
        word_obj['value'] = word_color
        word_obj['synonyms'] = [word_color]
        results.append(word_obj)

with open('dialogflow-results.json', 'w') as results_file:
    json.dump(results, results_file)
