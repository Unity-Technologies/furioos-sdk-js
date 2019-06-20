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
  MAXIMIZE: "maximize",
  MINIMIZE: "minimize",
  MOUSELOCK: "mouseLock",
  QUALITY: "quality",
  RESTART_APP: "restartApp",
  RESTART_CLIENT: "restartClient",
};

const _qualityValues = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  ULTRA: 3,
}

const _furioosServerUrl = "http://localhost:3000"; //"https://portal.furioos.com"

module.exports = class Player {
  static eventNames = _eventNames;
  static qualityValues = _qualityValues;

  constructor(sharedLink, containerId, options) {
    if (!_constructorParams(sharedLink, containerId, options)) {
      throw "Bad parameters";
    }

    // If there are options, treat those who change the url.
    if (options) {
      let prefix = "?";
      if (options.whiteLabel) {
        sharedLink += prefix + "whiteLabel=true";
        prefix = "&";
      }

      if (options.hideToolbar) {
        sharedLink += prefix + "hideToolbar=true";
        prefix = "&";
      }

      if (options.hideTitle) {
        sharedLink += prefix + "hideTitle=true";
        prefix = "&";
      }
    }

    // Create the iframe into the given container.
    this.sharedLink = sharedLink;
    this.containerId = containerId;
    this.options = options;
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
    iframe.setAttribute("id", "furioos-sdk-iframe");
    
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

    container.innerHTML = "";
    container.appendChild(div);
  }

  _onLoad() {
    // Bind listener for the messages.
    window.addEventListener("message", (e) => {
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

  maximize() {
    this.embed.contentWindow.postMessage({ type: _eventNames.MAXIMIZE }, _furioosServerUrl);
  }

  minimize() {
    this.embed.contentWindow.postMessage({ type: _eventNames.MINIMIZE }, _furioosServerUrl);
  }

  mouseLock(value) {
    this.embed.contentWindow.postMessage({ 
      type: _eventNames.MOUSELOCK,
      value: value
    }, _furioosServerUrl);
  }

  quality(value) {
    // Test if the value is correct.
    if (value != _qualityValues.LOW 
      && value != _qualityValues.MEDIUM
      && value != _qualityValues.HIGH
      && value != _qualityValues.ULTRA) 
    {
      throw "Bad parameter: The quality should be one of the given value in Player.qualityValues";
    }

    this.embed.contentWindow.postMessage({ 
      type: _eventNames.QUALITY,
      value: value
    }, _furioosServerUrl);
  }

  restartApp() {
    this.embed.contentWindow.postMessage({ type: _eventNames.RESTART_APP }, _furioosServerUrl);
  }

  restartClient() {
    this.embed.contentWindow.postMessage({ type: _eventNames.RESTART_CLIENT }, _furioosServerUrl);
  }
}