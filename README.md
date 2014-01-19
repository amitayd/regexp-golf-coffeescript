regexp-golf-coffeescript
========================

Regular expression golf (finding a short regexp for a set) implemented in coffeescript

###How to run###

Main Coffee under Node:

```bash
coffee src/main.js
```

In code or in the console:

```coffeescript
regexpGolf = require('./src/regexpGolf.coffee')
Set = require('./src/set.coffee')

winners =  new Set(['fireman', 'trucker', 'samurai', 'chef'])
losers = new Set(['lawyer', 'senator', 'waiter', 'chief'])

settings = {
  randomFactor: 1
  branches: 2
  depthBranches: {}
}

console.log regexpGolf.find(winners, losers, settings)
```    

For the browser:
open browser/index.html

### Test and build ###

Install grunt-cli and the package
```bash
sudo npm install -g grunt-cli
npm install .

grunt
```