const _constructorParams = function(shareId, containerId, options) {
  // Share Id.
  if (!shareId || typeof shareId != "string") {
    return false;
  }

  // Container
  if (!containerId || typeof containerId != "string") {
    return false;
  }

  return true;
}

const _eventNames = {
  LOAD: "load",
  ERROR: "error",
  START_SESSION: "startSession",
  STOP_SESSION: "stopSession",
};

const _furioosServerUrl = "http://localhost:3000"; //"https://portal.furioos.com"

module.exports = class Player {
  static eventNames = _eventNames;

  constructor(sharedLink, containerId, options) {
    if (!_constructorParams(sharedLink, containerId, options)) {
      throw "Bad parameters";
    }

    console.log("Instanciate the player", sharedLink, containerId, options);

    // Create the iframe into the given container.
    this.sharedLink = sharedLink;
    this.containerId = containerId;
    this.embed = this._createIframe();
  }

  _createIframe() {
    const container = document.getElementById(this.containerId);

    if (!container) {
      throw "Cannot find the container";
    }

    // Create the iframe element.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", this.sharedLink);
    iframe.setAttribute("id", "myIframe");
    
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    container.appendChild(iframe);

    iframe.onload = this._onLoad.bind(this);

    return iframe;
  }

  _displayErrorMessage(message) {
    const container = document.getElementById(this.containerId);

    const div = document.createElement("div");
    div.innerText = message;

    container.innerHTML = div;
  }

  _onLoad() {
    // Bind listener for the messages.
    window.addEventListener("message", (e) => {
      console.log("Message", e);
      switch(e.data.type) {
        case _eventNames.LOAD:
          if (this._onLoadCallback) {
            this._onLoadCallback();
          }
          return;

        case _eventNames.ERROR:
          this._displayErrorMessage(e.data.value);
          return;
      }
    });
  }

  // Binding onload callback.
  onLoad(onLoadCallback) {
    this._onLoadCallback = onLoadCallback;
  }

  startSession() {
    this.embed.contentWindow.postMessage({ type: _eventNames.START_SESSION }, _furioosServerUrl);
  }

  stopSession() {
    this.embed.contentWindow.postMessage({ type: _eventNames.STOP_SESSION }, _furioosServerUrl);
  }
}