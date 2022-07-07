var SDKDebug = require("./SDKDebug.js");
const { version } = require('../package.json');

const _constructorParams = function (shareId, containerId, options) {
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

const _fsSdkEventsName = {
  SET_VERSION: "SET_VERSION",
}

const FS_SDK_EVENTS_NAME = {
  LOAD: "load",
  ERROR: "error",
  START: "start",
  STOP: "stop",
  MAXIMIZE: "maximize",
  MINIMIZE: "minimize",
  QUALITY: "quality",
  RESTART_STREAM: "restartStream",
  RESUME_SESSION: "resumeSession",
  ON_RESUME_SESSION: "onResumeSession",
  ON_SDK_MESSAGE: "onSDKMessage",
  SEND_SDK_MESSAGE: "sendSDKMessage",
  SET_LOCATION: "setLocation",
  ON_USER_ACTIVE: "onUserActive",
  ON_USER_INACTIVE: "onUserInactive",
  ON_SESSION_STOPPED: "onSessionStopped",
  ON_STATS: "onStats",
  GET_SERVER_AVAILABILITY: "getServerAvailability",
  GET_SERVER_METADATA: "getServerMetadata",
  SET_THUMBNAIL_URL: "setThumbnailUrl",
  ON_APP_INSTALL_PROGRESS: "onAppInstallProgress",
  ON_APP_INSTALL_SUCCESS: "onAppInstallSuccess",
  ON_APP_INSTALL_FAIL: "onAppInstallFail",
  ON_APP_START: "onAppStart",
  ON_STREAM_START: "onStreamStart",
  SET_VOLUME: "setVolume",
  ON_CRASH_APP: "appStop",
  // ON_VIDEO_SIZE_CHANGED: "videoSizeChanged",
};

const TIMEOUT = {
  MIN: 10000,
  MAX: 86400000,
}

const QUALITY_VALUES = {
  AUTO: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  ULTRA: 4,
}

const FS_QUALITY_VALUES = {
  AUTO: 0,
  LOW: 360,
  MEDIUM: 720,
  HIGH: 1080,
}

const FS_REGIONS = {
  EUW: [52.1326, 5.2913],
  USW: [47.751076, -120.740135],
  USE: [37.926868, -78.024902],
  AUE: [-33.865143, 151.2099]
}

let _furioosServerUrl = "https://portal.furioos.com";
const FS_SDK_VERSION = version;

class Player {
  static get qualityValues() { return QUALITY_VALUES };
  static get fsQualityValues() { return FS_QUALITY_VALUES };
  static get regions() { return FS_REGIONS };

  constructor(sharedLinkID, containerId, options) {
    if (!_constructorParams(sharedLinkID, containerId, options)) {
      throw "Bad parameters";
    }

    this.isRestartStream = false;
    this.canResumeSession = false;

    if (sharedLinkID.indexOf("?") > 0) {
      // Remove URL parameters, should use the options for parameters.
      sharedLinkID = sharedLinkID.split("?")[0];
    }

    if (options.overridedURL) {
      _furioosServerUrl = options.overridedURL;
    }

    this._quality = FS_QUALITY_VALUES.HIGH;
    this._volume = 1;

    sharedLinkID = _furioosServerUrl + "/embed/" + sharedLinkID;

    // If there are options, treat those who change the url.
    let debugAppMode = false;
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

      if (options.inactiveTimeout) {
        let inactiveTimeoutClamp = options.inactiveTimeout;
        if (options.inactiveTimeout < TIMEOUT.MIN) {
          inactiveTimeoutClamp = TIMEOUT.MIN;
        }

        if (options.inactiveTimeout > TIMEOUT.MAX) {
          inactiveTimeoutClamp = TIMEOUT.MAX;
        }

        sharedLinkID += prefix + "inactiveTimeout=" + inactiveTimeoutClamp / 1000;
        prefix = "&";
      }

      if (options.debugAppMode) {
        // Local debug the SDK communication with your app.
        debugAppMode = true;

        const container = document.getElementById(containerId);
        container.innerText = "You are currently debugging locally your app. There is not stream here. Open console to see logs";

        const serverAddress = options.wsServerAddress ? options.wsServerAddress + ":8081" : "127.0.0.1:8081"
        this.sdkDebug = new SDKDebug(serverAddress);

        this.sdkDebug.onReady = () => {
          // Here you know when the WS connection with your application is ready.
          this.loaded = true;
          if (this._onLoadCallback) {
            this._onLoadCallback();
          }
        };

        this.sdkDebug.onSDKMessage((data) => {
          // Here you can manage the received data.
          if (this._onSDKMessageCallback) {
            this._onSDKMessageCallback(data);
          }
        });
      }
    }

    // Create the iframe into the given container.
    this.loaded = false;
    this.debugAppMode = debugAppMode;
    this.sharedLink = sharedLinkID;
    this.containerId = containerId;
    this.options = options;

    if (!debugAppMode) {
      this.embed = this._createIframe();
    }
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
    iframe.setAttribute("allow", "autoplay; fullscreen");

    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    container.appendChild(iframe);

    iframe.onload = this._onLoad.bind(this);
    // this._bindEvents();

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
      switch (e.data.type) {
        case FS_SDK_EVENTS_NAME.LOAD:
          // When the player is loaded: Set the default setted location (if setted).
          if (this.location) {
            if (!this.embed.contentWindow) {
              // Wait the window is reachable.
              setTimeout(() => {
                this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.SET_LOCATION, value: this.location }, _furioosServerUrl);
              }, 100);
            }
            else {
              this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.SET_LOCATION, value: this.location }, _furioosServerUrl);
            }
          }

          this.loaded = true;
          this.embed.contentWindow.postMessage({ type: _fsSdkEventsName.SET_VERSION, value: FS_SDK_VERSION }, _furioosServerUrl);

          if (this._onLoadCallback) {
            this._onLoadCallback();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_SDK_MESSAGE:
          if (this._onSDKMessageCallback) {
            this._onSDKMessageCallback(e.data.value);
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_USER_ACTIVE:
          if (this._onUserActiveCallback) {
            this._onUserActiveCallback();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_USER_INACTIVE:
          if (this._onUserInactiveCallback) {
            this._onUserInactiveCallback();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_PROGRESS:
          if (this._onAppInstallProgress) {
            this._onAppInstallProgress(e.data.value);
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_SUCCESS:
          if (this._onAppInstallSuccess) {
            this._onAppInstallSuccess();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_FAIL:
          if (this._onAppInstallFail) {
            this._onAppInstallFail();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_APP_START:
          if (this._onAppStart) {
            this._onAppStart();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_STREAM_START:
          if (this._onStreamStart) {
            this.isRestartStream = false;
            this._onStreamStart();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_SESSION_STOPPED:
          if (this._onSessionStoppedCallback) {
            this._onSessionStoppedCallback();
          }
          return;
        case FS_SDK_EVENTS_NAME.ON_STATS:
          if (this._onStatsCallback) {
            this._onStatsCallback(JSON.parse(e.data.value));
          }
          return;
        case FS_SDK_EVENTS_NAME.GET_SERVER_AVAILABILITY:
          const response = e.data.value;

          if (response.error) {
            console.log("Error getting server availability", response.error);
            if (this._getServerAvailabilityErrorCallback) {
              this._getServerAvailabilityErrorCallback(response.error);
            }

            return;
          }

          if (!this._getServerAvailabilityCallback) {
            console.log("No success callback binded !");
            return;
          }

          this._getServerAvailabilityCallback(response.stats);
          return;
        case FS_SDK_EVENTS_NAME.GET_SERVER_METADATA:
          const res = e.data.value;

          if (res.error) {
            console.log("Error getting server metadata", res.error);
            if (this._getServerMetadataErrorCallback) {
              this._getServerMetadataErrorCallback(res.error);
            }

            return;
          }

          if (!this._getServerMetadataCallback) {
            console.log("No success callback binded !");
            return;
          }

          this._getServerMetadataCallback(res.metadata);
          return;
        case FS_SDK_EVENTS_NAME.ERROR:
          this._displayErrorMessage(e.data.value);
          return;

        case FS_SDK_EVENTS_NAME.ON_CRASH_APP:
          if (this._onAppStop) {
            this._onAppStop(e.data.value);
          }
          return;

        case FS_SDK_EVENTS_NAME.ON_RESUME_SESSION:
          if (this._onResumeSession) {
            this.canResumeSession = e.data.value;
            this._onResumeSession({ canResumeSession: e.data.value });
          }
          return;

        // case FS_SDK_EVENTS_NAME.ON_VIDEO_SIZE_CHANGED:
        //   if (this._onVideoSizeChanged) {
        //     this._onVideoSizeChanged(e.data.value);
        //   }
        //   return;
      }
    });
  }

  ////////////////////////
  //// BIND EVENTS ////
  ////////////////////////
  on(event, callback) {
    switch (event) {
      case FS_SDK_EVENTS_NAME.LOAD:
        this._onLoadCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_PROGRESS:
        this._onAppInstallProgress = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_SUCCESS:
        this._onAppInstallSuccess = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_APP_INSTALL_FAIL:
        this._onAppInstallFail = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_APP_START:
        this._onAppStart = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_STREAM_START:
        this._onStreamStart = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_SESSION_STOPPED:
        this._onSessionStoppedCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_STATS:
        this._onStatsCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_USER_INACTIVE:
        this._onUserInactiveCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_USER_ACTIVE:
        this._onUserActiveCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_SDK_MESSAGE:
        this._onSDKMessageCallback = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_CRASH_APP:
        this._onAppStop = callback;
        return;

      case FS_SDK_EVENTS_NAME.ON_RESUME_SESSION:
        this._onResumeSession = callback;
        return;

      // case FS_SDK_EVENTS_NAME.ON_VIDEO_SIZE_CHANGED:
      //   this._onVideoSizeChanged = callback;
      //   return;
    }
  }

  ////////////////////////
  //// PUBLIC METHODS ////
  ////////////////////////

  setDefaultLocation(location) {
    this.location = location;

    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No setDefaultLocation in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.SET_LOCATION, value: this.location }, _furioosServerUrl);
  }

  start(location) {
    if (!location) {
      location = this.location;
    }

    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No start in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.START, value: location }, _furioosServerUrl);
  }

  stop() {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No stop in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.STOP }, _furioosServerUrl);
  }

  maximize() {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No maximize in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.MAXIMIZE }, _furioosServerUrl);
  }

  minimize() {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No minimize in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.MINIMIZE }, _furioosServerUrl);
  }

  ////////////////////////
  /////// GETTERS ////////
  ////////////////////////
  get quality() {
    switch (this._quality) {
      case QUALITY_VALUES.AUTO:
      case FS_QUALITY_VALUES.AUTO:
        return "AUTO";

      case QUALITY_VALUES.LOW:
      case FS_QUALITY_VALUES.LOW:
        return "LOW";

      case QUALITY_VALUES.MEDIUM:
      case FS_QUALITY_VALUES.MEDIUM:
        return "MEDIUM";

      case QUALITY_VALUES.HIGH:
      case FS_QUALITY_VALUES.HIGH:
        return "HIGH";

      case QUALITY_VALUES.ULTRA:
        return "HIGH";
    }
  }

  get volume() {
    return this._volume;
  }

  setQuality(value) {
    // Test if the value is correct.
    if (value !== QUALITY_VALUES.LOW
      && value !== QUALITY_VALUES.MEDIUM
      && value !== QUALITY_VALUES.HIGH
      && value !== QUALITY_VALUES.ULTRA
      && value !== QUALITY_VALUES.AUTO
      && value !== FS_QUALITY_VALUES.AUTO
      && value !== FS_QUALITY_VALUES.LOW
      && value !== FS_QUALITY_VALUES.MEDIUM
      && value !== FS_QUALITY_VALUES.HIGH) {
      throw "Bad parameter: The quality should be one of the given value in Player.qualityValues";
    }

    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No setQuality in debug mode")
      return; // Not loaded.
    }

    // DEPRECATED
    let quality = value;
    if (quality === QUALITY_VALUES.LOW) {
      console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES");
      quality = FS_QUALITY_VALUES.LOW;
    }

    if (quality === QUALITY_VALUES.MEDIUM) {
      console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES");
      quality = FS_QUALITY_VALUES.MEDIUM;
    }

    if (quality === QUALITY_VALUES.HIGH || quality === QUALITY_VALUES.ULTRA) {
      console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES");
      quality = FS_QUALITY_VALUES.HIGH;
    }

    this._quality = quality;

    this.embed.contentWindow.postMessage({
      type: FS_SDK_EVENTS_NAME.QUALITY,
      value: quality
    }, _furioosServerUrl);
  }

  restartStream() {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No restartStream in debug mode");
      return; // Not loaded.
    }
    if (this.isRestartStream) {
      console.warn("Stream is already restarting");
      return;
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.RESTART_STREAM }, _furioosServerUrl);
    this.isRestartStream = true;
  }

  resumeSession() {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No resumeSession in debug mode")
      return; // Not loaded.
    }

    if (!this.canResumeSession) {
      console.warn("No active session")
      return;
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.RESUME_SESSION }, _furioosServerUrl);
  }

  // SDK
  sendSDKMessage(data) {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (typeof data == "object") {
      data = JSON.stringify(data);
    }

    if (this.debugAppMode) {
      this.sdkDebug.sendSDKMessage(data);
      return;
    }

    this.embed.contentWindow.postMessage({
      type: FS_SDK_EVENTS_NAME.SEND_SDK_MESSAGE,
      value: data,
    }, _furioosServerUrl);
  }

  setUserActive() {
    this.sendSDKMessage({ "userActive": true });
  }

  setThumbnailUrl(thumbnailUrl) {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No setThumbnailUrl in debug mode")
      return; // Not loaded.
    }

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.SET_THUMBNAIL_URL, value: thumbnailUrl }, _furioosServerUrl);
  }

  getServerAvailability(getServerAvailabilityCallback, getServerAvailabilityErrorCallback) {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No getServerAvailability in debug mode")
      return; // Not loaded.
    }

    this._getServerAvailabilityCallback = getServerAvailabilityCallback;
    this._getServerAvailabilityErrorCallback = getServerAvailabilityErrorCallback;

    // Call the get.
    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.GET_SERVER_AVAILABILITY }, _furioosServerUrl);
    // The response will be treat in the listener below.
  }

  getServerMetadata(getServerMetadataCallback, getServerMetadataErrorCallback) {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No getServerMetadata in debug mode")
      return; // Not loaded.
    }

    this._getServerMetadataCallback = getServerMetadataCallback;
    this._getServerMetadataErrorCallback = getServerMetadataErrorCallback;

    // Call the get.
    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.GET_SERVER_METADATA }, _furioosServerUrl);
    // The response will be treat in the listener below.
  }

  setVolume(volume, setVolumeCallback) {
    if (!this.loaded) {
      return; // Not loaded.
    }

    if (this.debugAppMode) {
      console.log("No setVolume in debug mode")
      return; // Not loaded.
    }

    this._setVolume = setVolumeCallback;
    this._volume = volume;

    this.embed.contentWindow.postMessage({ type: FS_SDK_EVENTS_NAME.SET_VOLUME, value: volume }, _furioosServerUrl);
  }

  ////////////////////////
  //// DEPRECATED ////
  ////////////////////////
  // Binding onload callback.
  onLoad(onLoadCallback) {
    this._onLoadCallback = onLoadCallback;
    console.warn("DEPRECATED: OnLoad is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onUserInactive(onUserInactiveCallback) {
    this._onUserInactiveCallback = onUserInactiveCallback;
    console.warn("DEPRECATED: onUserInactive is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onAppInstallProgress(onAppInstallProgress) {
    this._onAppInstallProgress = onAppInstallProgress;
    console.warn("DEPRECATED: onAppInstallProgress is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onAppInstallSuccess(onAppInstallSuccess) {
    this._onAppInstallSuccess = onAppInstallSuccess;
    console.warn("DEPRECATED: onAppInstallSuccess is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onAppInstallFail(onAppInstallFail) {
    this._onAppInstallFail = onAppInstallFail;
    console.warn("DEPRECATED: onAppInstallFail is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onAppStart(onAppStart) {
    this._onAppStart = onAppStart;
    console.warn("DEPRECATED: onAppStart is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onStreamStart(onStreamStart) {
    this._onStreamStart = onStreamStart;
    console.warn("DEPRECATED: onStreamStart is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onSessionStopped(onSessionStoppedCallback) {
    this._onSessionStoppedCallback = onSessionStoppedCallback;
    console.warn("DEPRECATED: onSessionStopped is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onStats(callback) {
    this._onStatsCallback = callback;
    console.warn("DEPRECATED: onStats is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onSDKMessage(onSDKMessageCallback) {
    this._onSDKMessageCallback = onSDKMessageCallback;
    console.warn("DEPRECATED: onSDKMessage is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }

  onUserActive(onUserActiveCallback) {
    this._onUserActiveCallback = onUserActiveCallback;
    console.warn("DEPRECATED: onUserActive is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events");
  }
}

module.exports = {
  Player,
  FS_SDK_EVENTS_NAME,
  FS_QUALITY_VALUES,
  FS_REGIONS,
  QUALITY_VALUES,
}
