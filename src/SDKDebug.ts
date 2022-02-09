export class SDKDebug {
  private ws: WebSocket;

  onReady?: () => void;
  private _onSDKMessageCallback?: (data: any) => void;

  constructor(localServerAddress: string) {
    if (!localServerAddress) {
      throw "Bad parameters";
    }

    // Init WS connection.
    this.ws = new WebSocket("ws://" + localServerAddress);
    this.ws.binaryType = "arraybuffer";
    this.ws.onerror = (event) => {
      this._wsOnError(event);
    };
    this.ws.onclose = (event) => {
      this._wsOnClose(event);
    };
    this.ws.onmessage = (event) => {
      this._wsOnMessage(event);
    };
    this.ws.onopen = () => {
      console.log("WS connected to: ", localServerAddress);
      if (this.onReady) {
        this.onReady();
      }
    };
  }

  ///////////////////////
  /// PRIVATE METHODS ///
  ///////////////////////
  private _wsOnError(event: Event) {
    console.error("WS Error", event);
  }

  private _wsOnClose(event: CloseEvent) {
    console.error("WS Close", event);
  }

  private _wsOnMessage(event: MessageEvent) {
    const msg = JSON.parse(event.data);
    if (msg.type == "furioos" && msg.task == "sdk") {
      if (this._onSDKMessageCallback) {
        this._onSDKMessageCallback(JSON.parse(msg.data));
      }
    }
  }

  private _wsOnSendError(event: Error) {
    console.error("WS send error", event);
  }

  ////////////////////////
  //// PUBLIC METHODS ////
  ////////////////////////

  // Binding onload callback.
  // SDK
  onSDKMessage(onSDKMessageCallback: (data: any) => void): void {
    this._onSDKMessageCallback = onSDKMessageCallback;
  }

  sendSDKMessage(data: any): void {
    if (!this.ws || this.ws.readyState != WebSocket.OPEN) {
      console.log("Cannot send message, ws connection not open");
      return; // Not loaded.
    }

    const parsedData = {
      type: "furioos",
      task: "sdk",
      data: data,
    };

    try {
      this.ws.send(JSON.stringify(parsedData));
    } catch (err) {
      this._wsOnSendError(err as Error);
    }
  }
}
