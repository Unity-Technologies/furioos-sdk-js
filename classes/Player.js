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
    this.embed = this._createIframe(sharedLink, containerId);
  }

  _createIframe(sharedLink, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      throw "Cannot find the container";
    }

    // Create the iframe element.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", sharedLink);
    iframe.setAttribute("id", "myIframe");
    
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    container.appendChild(iframe);

    iframe.onload = this._onLoad.bind(this);

    return iframe;
  }

  _onLoad() {
    // Bind listener for the messages.
    window.addEventListener("message", (e) => {
      console.log("Message", e);
      switch(e.data) {
        case _eventNames.LOAD:
          if (this._onLoadCallback) {
            this._onLoadCallback();
          }
          return;
      }
    });
  }

  // Binding onload callback.
  onLoad(onLoadCallback) {
    this._onLoadCallback = onLoadCallback;
  }

  startSession() {
    this.embed.contentWindow.postMessage(_eventNames.START_SESSION, _furioosServerUrl);
  }

  stopSession() {
    this.embed.contentWindow.postMessage(_eventNames.STOP_SESSION, _furioosServerUrl);
  }
}