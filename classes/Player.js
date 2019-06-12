module.exports =  class Player {
  constructor(shareId, container, options) {
    // Create the iframe into the given container.
    console.log("Instanciate the player", shareId, container, options);
  }

  test() {
    console.log("Call test method.");
  }
}