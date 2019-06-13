var _constructorParams = function(shareId, containerId, options) {
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


module.exports =  class Player {
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
    iframe.style.width = "640px";
    iframe.style.height = "480px";

    container.appendChild(iframe);

    return iframe;
  }

  test() {
    console.log("Call test method.", this.embed, );
  }
}