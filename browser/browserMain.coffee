Set = require('../src/set.coffee')
regexpGolf = require('../src/regexpGolf.coffee')


findRegexp = ->
  winnersStr = document.getElementById('winners').value;
  winners =  new Set(winnersStr.split /[ ]+/)


  losersStr = document.getElementById('losers').value;
  losers = new Set(losersStr.split /[ ]+/)

  losers = losers.subtract winners

  settings = {
    randomFactor: 1
    branches: 1
    depthBranches: {}
  }

  console.log 'winners:', winners.toString()
  console.log 'losers:', losers.toString()

  found = regexpGolf.find(winners, losers, settings)
  document.getElementById('result').value = found.join('\n')

findButton = document.getElementById('find');
findButton.addEventListener("click", findRegexp, false)

