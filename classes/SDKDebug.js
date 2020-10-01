module.exports = class SDKDebug {
  constructor(localServerAddress) {
    if (!localServerAddress) {
      throw "Bad parameters";
    }

    // Init WS connection.
    this.ws = new WebSocket("ws://" + localServerAddress);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onerror = (event) => {this._wsOnError(event)};
    this.ws.onclose = (event) => {this._wsOnClose(event);}
    this.ws.onmessage = (event) => {this._wsOnMessage(event);}
    this.ws.onopen = () => {
      console.log("WS connected to: ", localServerAddress);
      if (this.onReady) {
        this.onReady()
      }
    };
  }

  ///////////////////////
  /// PRIVATE METHODS ///
  ///////////////////////
  _wsOnError(event) {
    console.error("WS Error", event);
  }

  _wsOnClose(event) {
    console.error("WS Close", event);
  }

  _wsOnMessage(event) {
    const msg = JSON.parse(event.data);
    if (msg.type == "furioos" && msg.task == "sdk") {
      this._onSDKMessageCallback(JSON.parse(msg.data));
    }
  }

  _wsOnSendError(event) {
    console.error("WS send error", event);
  }

  ////////////////////////
  //// PUBLIC METHODS ////
  ////////////////////////

  // Binding onload callback.
  // SDK
  onSDKMessage(onSDKMessageCallback) {
    this._onSDKMessageCallback = onSDKMessageCallback;
  }

  sendSDKMessage(data) {
    if (!this.ws || this.ws.readyState != WebSocket.OPEN) {
      console.log("Cannot send message, ws connection not open");
      return; // Not loaded.
    } 

    const parsedData = {
      type: "furioos",
      task: "sdk",
      data: data
    }

    this.ws.send(JSON.stringify(parsedData),this._wsOnSendError);
  }
}