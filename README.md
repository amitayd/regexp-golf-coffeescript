regexp-golf-coffeescript
========================

Regular expression golf (finding a short regexp for a set) implemented in coffeescript

###How to run###

Main Coffee under Node:

    coffee src/main.js

In code or in the console:

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

For the browser:
open browser/index.html

### Test and build ###

Install grunt-cli, and run

    grunt