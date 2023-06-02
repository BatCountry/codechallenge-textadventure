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
    accepting: true,
    location: null,
    command: null,
    update: null,
    input: input,
    story: story
  };

  function update(content) {
    document.getElementById("story").appendChild(
      document.createTextNode(content.text));
    state.location = content.location;
    state.accepting = true;
  }

  update.bind(this);
  state.update = update;

  return state;
}

function post(command, state) {
  fetch('/go', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...state, "command": command })
  })
    .then(response => response.json())
    .then(state.update);
}

function acceptCommand(state, command) {
  if (!state.accepting) return;
  state.accepting = false;
  document.getElementById(story)
  post(command, state);
}

waitFor("#input").then(input => {
  // lifted from https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
  input.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
  });

  waitFor("#story").then(
    story => {
      state = makeState(story, input);
      acceptCommand(state, null);
      story.dispatchEvent(new Event());
    }
  );
})
