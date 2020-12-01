# ------------------------------------------------------------------
# [Author] Maxence Brasselet - Furioos by Unity Technologies
#          Running script for development
# ------------------------------------------------------------------

# check and install NPM
if !hash node 2>/dev/null; then
  echo "Installing NPM..."
  brew install node
fi
echo "$(tput bold)NPM:$(tput setaf 2) OK $(tput sgr0)"

# Update furioos package.
npm i --save furioos-sdk

# Install browserify
if !hash browserify 2>/dev/null; then
  sudo npm i -g browserify
fi

# Browserify
browserify index.js -o indexBrowserified.js

# Launch server
node server.js