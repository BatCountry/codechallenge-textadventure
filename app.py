from flask import Flask, render_template, request

app = Flask(__name__)

def respond(text, location):
    return {
        "text": text,
        "location": location
    }

STATES = {
    "SPECIAL": respond(
        text="""You find yourself awakening from a brief reverie, as if from a deep slumber."""
             """You are in your lounge.  On the wall are paintings rendered by friends."""
             """"You are filled with a great sense of apathy, and you refuse to """
             """<b>leave</b> this room.""",
        location="START"),
    ("START", "leave"): respond(
        text="""You leave your room and begin the rest of your life.""", 
        location="WIN"),
    ("WIN", "*"): respond(
        text="""Having overcome apathy and left your room, you have already won at life.""",
        location="WIN"
    )
}

@app.route("/", methods=['GET'])
def start():
    """Root of site"""
    return render_template("index.html", title="Generic Text Adventure")

@app.route("/go", methods=['POST'])
def go_route():
    """Returns a new state given the current state and a command"""
    state = request.json
    location = None
    if state:
        location = state.get("location")
        command = state.get("command")

    if location is None:
        return STATES["SPECIAL"]

    return STATES.get((location, command)) or STATES.get((location, "*"))
