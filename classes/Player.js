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
  ON_SDK_MESSAGE: "onSDKMessage",
  ERROR: "error",
  START: "start",
  STOP: "stop",
  MAXIMIZE: "maximize",
  MINIMIZE: "minimize",
  MOUSELOCK: "mouseLock",
  QUALITY: "quality",
  RESTART_APP: "restartApp",
  RESTART_CLIENT: "restartClient",
  SEND_DATA: "sendData",
};

const _qualityValues = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  ULTRA: 3,
}

let _furioosServerUrl = "https://portal.furioos.com"

module.exports = class Player {
  static get qualityValues() { return _qualityValues };

  constructor(sharedLinkID, containerId, options) {
    if (!_constructorParams(sharedLinkID, containerId, options)) {
      throw "Bad parameters";
    }

    if (sharedLinkID.indexOf("?") > 0) {
      // Remove URL parameters, should use the options for parameters.
      sharedLinkID = sharedLinkID.split("?")[0];
    }

    if (options.overridedURL) {
      _furioosServerUrl = options.overridedURL;
    } 

    sharedLinkID = _furioosServerUrl + "/embed/" + sharedLinkID;

    // If there are options, treat those who change the url.
    if (options) {
      let prefix = "?";
      if (options.whiteLabel) {
        sharedLinkID += prefix + "whiteLabel=true";
        prefix = "&";
      }

      if (options.hideToolbar) {
        sharedLinkID += prefix + "hideToolbar=true";
        prefix = "&";
      }

      if (options.hideTitle) {
        sharedLinkID += prefix + "hideTitle=true";
        prefix = "&";
      }

      if (options.hidePlayButton) {
        sharedLinkID += prefix + "hidePlayButton=true";
        prefix = "&";
      }
    }

    // Create the iframe into the given container.
    this.sharedLink = sharedLinkID;
    this.containerId = containerId;
    this.options = options;
    this.embed = this._createIframe();
  }

  ///////////////////////
  /// PRIVATE METHODS ///
  ///////////////////////

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
        case ON_SDK_MESSAGE:
          if (this._onSDKMessageCallback) {
            this._onSDKMessageCallback(e.data.value);
          }
          return;
        case _eventNames.ERROR:
          this._displayErrorMessage(e.data.value);
          return;
      }
    });
  }

  ////////////////////////
  /////// GETTERS ////////
  ////////////////////////

  get quality() {
    switch(this.quality) {
      case _qualityValues.LOW:
        return "LOW";

      case _qualityValues.MEDIUM:
          return "MEDIUM";

      case _qualityValues.HIGH:
          return "HIGH";

      case _qualityValues.ULTRA:
          return "ULTRA";
    }
  }

  ////////////////////////
  //// PUBLIC METHODS ////
  ////////////////////////

  // Binding onload callback.
  onLoad(onLoadCallback) {
    this._onLoadCallback = onLoadCallback;
  }

  onSDKMessage(onSDKMessageCallback) {
    this._onSDKMessageCallback = onSDKMessageCallback;
  }

  start() {
    this.embed.contentWindow.postMessage({ type: _eventNames.START }, _furioosServerUrl);
  }

  stop() {
    this.embed.contentWindow.postMessage({ type: _eventNames.STOP }, _furioosServerUrl);
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

  setQuality(value) {
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

    this.quality = value;
  }

  restartApp() {
    this.embed.contentWindow.postMessage({ type: _eventNames.RESTART_APP }, _furioosServerUrl);
  }

  restartClient() {
    this.embed.contentWindow.postMessage({ type: _eventNames.RESTART_CLIENT }, _furioosServerUrl);
  }

  sendData(data) {
    this.embed.contentWindow.postMessage({ 
      type: _eventNames.SEND_DATA,
      value: data,
    }, _furioosServerUrl);
  }
}