// waitFor lifted from https://stackoverflow.com/a/61511955
function waitFor(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(_ => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  });
}

function makeState(story, input) {
  var state = {
    location: "START",
    command: null,
    update: null,
    accepting: true,
    input: input,
    story: story
  };

  function update(content) {
    var story = document.getElementById("story");
    story.innerHTML = "";

    content.text.split(/\*([^*]+)\*/).forEach((element, index) => {
      newElem = document.createTextNode(element);
      if(index > 0 && index % 2 !== 0) {
        newS = document.createElement("span");
        newS.style.color = "green";

        newS.appendChild(newElem);
        story.appendChild(newS);
      }
      else story.appendChild(newElem);
    });
  
    state.location = content.location;
    state.accepting = true;
  }
  
  state.update = update.bind(this);

  return state;
}

function post(command, state) {
  fetch('/go', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"location": state.location, "command": command })
  })
    .then(response => response.json())
    .then(content => state.update(content));
}

function acceptCommand(state, command) {
  if (!state.accepting) return;
  state.accepting = false;
  post(command, state);
}

waitFor("#userInput").then(input => {
  waitFor("#story").then(story => {
    userInput.value = "";
    state = makeState(story, input);

    input.addEventListener("keydown", (event) => {
      // lifted from https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
      if (event.isComposing || event.keyCode !== 13) return;
      var input = document.getElementById("userInput");
      var command = input.value;
      input.value = "";
      acceptCommand(state, command || null);
    });

    post("*", state);
  }
)});
