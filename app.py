"""
Low-code text-adventure framework. The whole script of the game is JSON, 
and can be hand written in notepad without knowing any programming languages.
It kinda sucks, as it doesn't provide good feedback, or even any guaranteed
functionality like a "look" command to remind you where you are, it just repeats
the text of the room entry command.  Opportunities to extend this would be to include
another field which provided a response to the command then either displayed the "look"
command again or suppressed it.
"""
import json

from flask import Flask, render_template, request

app = Flask(__name__)

def respond(text, location):
    """Helper function for the return object type"""
    return {
        "text": text,
        "location": location
    }

STATES = json.load(open('script.json', 'r', encoding='utf8'))

@app.route("/", methods=['GET'])
def start():
    """Root of site"""
    return render_template("index.html", title="Generic Text Adventure")

@app.route("/go", methods=['POST'])
def go_route():
    """Returns a new state given the current state and a command"""
    state = request.json
    print(STATES)
    print(state)

    location = "START"
    command = "*"

    if state:
        location = state.get("location") or "START"
        command = state.get("command") or "*"

    return STATES.get(f'{location},{command}') or STATES.get(f'{location},*')
